
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET;

export const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '24h';

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    'JWT_SECRET is missing or too short. Check your server/.env file.'
  );
}

// 1. Authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      error: 'Access Denied: Missing Authorization Token',
      code: 'AUTH_TOKEN_REQUIRED'
    });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    { algorithms: ['HS256'] },
    (err, decodedUser) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(403).json({
            error: 'Session Expired: Please log in again',
            code: 'TOKEN_EXPIRED'
          });
        }

        return res.status(403).json({
          error: 'Forbidden: Invalid or tampered token',
          code: 'TOKEN_INVALID'
        });
      }

      req.user = decodedUser;
      next();
    }
  );
};

// 2. Optional authentication
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(
    token,
    JWT_SECRET,
    { algorithms: ['HS256'] },
    (err, decodedUser) => {
      req.user = err ? null : decodedUser;
      next();
    }
  );
};

// 3. Resource ownership verification
export const requireOwnership = (idParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const targetId = req.params[idParam];

    if (req.user.user_id !== targetId) {
      return res.status(403).json({
        error: 'Forbidden: You can only modify your own profile or resources',
        code: 'OWNERSHIP_VIOLATION'
      });
    }

    next();
  };
};

// 4. Security Verification Test Suite
export async function runSecurityVerification() {
  const tests = [];

  // SEC-01: Bcrypt Password Hashing
  try {
    const rawPassword = 'StudentSecretPassword123!';
    const hash = await bcrypt.hash(rawPassword, 10);

    const matchesCorrect = await bcrypt.compare(rawPassword, hash);
    const rejectsWrong = await bcrypt.compare(
      'WrongPassword456',
      hash
    );

    const passed =
      matchesCorrect &&
      !rejectsWrong &&
      hash.startsWith('$2');

    tests.push({
      id: 'SEC-01',
      title: 'Bcrypt Password Hashing & Salt Verification',
      status: passed ? 'PASSED' : 'FAILED',
      detail: passed
        ? 'Successfully generated a salted bcrypt hash. Correct password accepted and incorrect password rejected.'
        : 'Password hash verification failed.'
    });
  } catch (err) {
    tests.push({
      id: 'SEC-01',
      title: 'Bcrypt Password Hashing',
      status: 'FAILED',
      detail: err.message
    });
  }

  // SEC-02: JWT Signing and Verification
  let sampleToken = '';

  try {
    const payload = {
      user_id: 'usr_sec_test',
      email: 'security.test@rvu.edu.in',
      role: 'student'
    };

    sampleToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h',
      algorithm: 'HS256'
    });

    const decoded = jwt.verify(sampleToken, JWT_SECRET, {
      algorithms: ['HS256']
    });

    const passed =
      decoded.user_id === payload.user_id &&
      decoded.email === payload.email;

    tests.push({
      id: 'SEC-02',
      title: 'JWT Signing & Verification (HMAC-SHA256)',
      status: passed ? 'PASSED' : 'FAILED',
      detail: passed
        ? 'JWT successfully issued and verified with matching payload.'
        : 'JWT verification failed.'
    });
  } catch (err) {
    tests.push({
      id: 'SEC-02',
      title: 'JWT Signing & Verification',
      status: 'FAILED',
      detail: err.message
    });
  }

  // SEC-03: Tampered Token Detection
  try {
    const parts = sampleToken.split('.');
    parts[2] = parts[2].slice(0, -1) +
      (parts[2].slice(-1) === 'a' ? 'b' : 'a');

    const tamperedToken = parts.join('.');

    let tamperedPassed = false;

    try {
      jwt.verify(tamperedToken, JWT_SECRET, {
        algorithms: ['HS256']
      });
    } catch (err) {
      tamperedPassed = err.name === 'JsonWebTokenError';
    }

    tests.push({
      id: 'SEC-03',
      title: 'Tampered Token Rejection Defense',
      status: tamperedPassed ? 'PASSED' : 'FAILED',
      detail: tamperedPassed
        ? 'Tampered JWT signature successfully rejected.'
        : 'Failed to reject tampered JWT.'
    });
  } catch (err) {
    tests.push({
      id: 'SEC-03',
      title: 'Tampered Token Rejection',
      status: 'FAILED',
      detail: err.message
    });
  }

  // SEC-04: Token Expiration
  try {
    const expiredToken = jwt.sign(
      { user_id: 'expired' },
      JWT_SECRET,
      { expiresIn: '0s' }
    );

    let expiredCaught = false;

    try {
      jwt.verify(expiredToken, JWT_SECRET, {
        algorithms: ['HS256']
      });
    } catch (err) {
      expiredCaught = err.name === 'TokenExpiredError';
    }

    tests.push({
      id: 'SEC-04',
      title: 'Token Expiration Enforcement',
      status: expiredCaught ? 'PASSED' : 'FAILED',
      detail: expiredCaught
        ? 'Expired JWT tokens are successfully rejected.'
        : 'Token expiration verification failed.'
    });
  } catch (err) {
    tests.push({
      id: 'SEC-04',
      title: 'Token Expiration Enforcement',
      status: 'FAILED',
      detail: err.message
    });
  }

  return {
    timestamp: new Date().toISOString(),
    hashingAlgorithm: 'bcrypt (10 salt rounds)',
    tokenAlgorithm: 'JWT (HMAC-SHA256)',
    tokenExpiry: TOKEN_EXPIRY,
    tests,
    overallStatus: tests.every(
      test => test.status === 'PASSED'
    ) ? 'PASSED' : 'FAILED'
  };
}
