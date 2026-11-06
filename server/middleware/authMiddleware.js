import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const JWT_SECRET = process.env.JWT_SECRET || 'skillswap_rvu_cs3301_secret_key_2026';
export const TOKEN_EXPIRY = '24h';

// Middleware to authenticate JWT token from Authorization header
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

  if (!token) {
    return res.status(401).json({
      error: 'Access Denied: Missing Authorization Token',
      code: 'AUTH_TOKEN_REQUIRED'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
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
  });
};

// Optional auth: attaches user if token present, proceeds if absent
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    req.user = err ? null : decodedUser;
    next();
  });
};

// Authorization: ensure user owns the target resource
export const requireOwnership = (idParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
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

// Security Verification Test Suite (Criteria 4: Security review & testing)
export async function runSecurityVerification() {
  const tests = [];

  // Test 1: Bcrypt Password Hashing Test
  try {
    const rawPassword = 'StudentSecretPassword123!';
    const saltRounds = 10;
    const hash = await bcrypt.hash(rawPassword, saltRounds);

    const matchesCorrect = await bcrypt.compare(rawPassword, hash);
    const rejectsWrong = await bcrypt.compare('WrongPassword456', hash);

    const passed = matchesCorrect && !rejectsWrong && hash.startsWith('$2');

    tests.push({
      id: 'SEC-01',
      title: 'Bcrypt Password Hashing & Salt Verification',
      status: passed ? 'PASSED' : 'FAILED',
      detail: passed
        ? `Successfully generated 10-round salted bcrypt hash (${hash.substring(0, 15)}...). Verified correct password matches and wrong password is rejected.`
        : 'Password hash matching failed.'
    });
  } catch (err) {
    tests.push({ id: 'SEC-01', title: 'Bcrypt Password Hashing', status: 'FAILED', detail: err.message });
  }

  // Test 2: JWT Issuance & Cryptographic Signature Test
  let sampleToken = '';
  try {
    const payload = {
      user_id: 'usr_sec_test',
      email: 'security.test@rvu.edu.in',
      role: 'student'
    };
    sampleToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(sampleToken, JWT_SECRET);

    const passed = decoded.user_id === payload.user_id && decoded.email === payload.email;

    tests.push({
      id: 'SEC-02',
      title: 'JWT Signing & Verification (HMAC-SHA256)',
      status: passed ? 'PASSED' : 'FAILED',
      detail: passed
        ? `Issued cryptographic JWT with 1h expiry. Decoded claims match expected student payload.`
        : 'JWT verification failed.'
    });
  } catch (err) {
    tests.push({ id: 'SEC-02', title: 'JWT Signing & Verification', status: 'FAILED', detail: err.message });
  }

  // Test 3: Tampered Token Interception Test
  try {
    const tamperedToken = sampleToken.slice(0, -6) + 'xxxxxx'; // corrupt last 6 signature characters
    let tamperedPassed = false;

    try {
      jwt.verify(tamperedToken, JWT_SECRET);
    } catch (tamperErr) {
      tamperedPassed = tamperErr.name === 'JsonWebTokenError';
    }

    tests.push({
      id: 'SEC-03',
      title: 'Tampered Token Rejection Defense',
      status: tamperedPassed ? 'PASSED' : 'FAILED',
      detail: tamperedPassed
        ? 'Successfully detected cryptographic signature mismatch on tampered JWT and rejected request.'
        : 'Failed to reject tampered token.'
    });
  } catch (err) {
    tests.push({ id: 'SEC-03', title: 'Tampered Token Rejection', status: 'FAILED', detail: err.message });
  }

  // Test 4: Token Expiration Enforcement Test
  try {
    const expiredToken = jwt.sign({ user_id: 'expired' }, JWT_SECRET, { expiresIn: '0s' });
    let expiredCaught = false;

    try {
      jwt.verify(expiredToken, JWT_SECRET);
    } catch (expErr) {
      expiredCaught = expErr.name === 'TokenExpiredError';
    }

    tests.push({
      id: 'SEC-04',
      title: 'Token Expiration Enforcement (Timeout Protection)',
      status: expiredCaught ? 'PASSED' : 'FAILED',
      detail: expiredCaught
        ? 'Expired JWT tokens automatically trigger TokenExpiredError preventing stale session replay.'
        : 'Failed expiration check.'
    });
  } catch (err) {
    tests.push({ id: 'SEC-04', title: 'Token Expiration Enforcement', status: 'FAILED', detail: err.message });
  }

  return {
    timestamp: new Date().toISOString(),
    hashingAlgorithm: 'bcrypt (Blowfish 10 rounds)',
    tokenAlgorithm: 'JWT (HMAC-SHA256)',
    tokenExpiry: TOKEN_EXPIRY,
    tests,
    overallStatus: tests.every(t => t.status === 'PASSED') ? 'PASSED' : 'FAILED'
  };
}
