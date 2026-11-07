
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { Session } from '../models/Session.js';
import { Slot } from '../models/Slot.js';
import { Message } from '../models/Message.js';
import { Feedback } from '../models/Feedback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(
  __dirname,
  '..',
  'data',
  'initialData.json'
);

export let dbState = {
  isMongoConnected: false,
  connectionType: 'Disconnected',
  stats: {}
};

export let memoryDb = {
  skills: [],
  users: [],
  available_slots: [],
  sessions: [],
  feedback: [],
  messages: []
};

// ========================================
// INSERT MISSING SKILLS INTO MONGODB
// ========================================

async function seedSkillsToMongoDB() {
  try {
    const skills = memoryDb.skills || [];

    if (skills.length === 0) {
      console.log('⚠️ [Database] No skills found in seed data.');
      return;
    }

    let insertedCount = 0;

    for (const skill of skills) {
      if (!skill.skill_id || !skill.skill_name || !skill.category) {
        console.warn(
          '⚠️ [Database] Skipping invalid skill:',
          skill
        );
        continue;
      }

      const result = await Skill.updateOne(
        { skill_id: skill.skill_id },
        {
          $setOnInsert: {
            skill_id: skill.skill_id,
            skill_name: skill.skill_name,
            category: skill.category,
            description: skill.description || ''
          }
        },
        {
          upsert: true,
          runValidators: true
        }
      );

      if (result.upsertedCount > 0) {
        insertedCount++;
      }
    }

    const totalSkills = await Skill.countDocuments();

    console.log(
      `✅ [Database] Skills synchronized: ${insertedCount} inserted, ${totalSkills} total in MongoDB.`
    );

  } catch (error) {
    console.error(
      '❌ [Database] Skill seeding failed:',
      error.message
    );

    throw error;
  }
}

// ========================================
// MONGODB ATLAS CONNECTION
// ========================================

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      'MONGODB_URI is missing. Check your server/.env file.'
    );
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    dbState.isMongoConnected = true;
    dbState.connectionType = 'MongoDB Atlas';

    console.log(
      '✅ [Database] Successfully connected to MongoDB Atlas'
    );

  } catch (err) {
    dbState.isMongoConnected = false;
    dbState.connectionType = 'Disconnected';

    console.error(
      '❌ [Database] MongoDB connection failed:',
      err.message
    );

    throw err;
  }

  // Load initial seed data into memoryDb
  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf-8');
      const parsedData = JSON.parse(raw);

      memoryDb = {
        ...memoryDb,
        ...parsedData
      };

      console.log(
        `✅ [Database] Seed data loaded: ${memoryDb.users.length} users and ${memoryDb.skills.length} skills.`
      );

      // Insert missing skills into MongoDB Atlas
      await seedSkillsToMongoDB();

    } else {
      console.warn(
        '⚠️ [Database] initialData.json was not found.'
      );
    }

  } catch (fileErr) {
    console.error(
      '❌ [Database] Error loading seed data:',
      fileErr.message
    );

    throw fileErr;
  }

  return dbState;
}

// ========================================
// DATABASE VERIFICATION SUITE
// ========================================

export async function runDatabaseVerification() {

  const results = {
    timestamp: new Date().toISOString(),
    connectionMode: dbState.connectionType,
    isMongoConnected: dbState.isMongoConnected,

    schemas: [
      {
        name: 'User',
        fields: Object.keys(User.schema.paths),
        pathCount: Object.keys(User.schema.paths).length
      },
      {
        name: 'Skill',
        fields: Object.keys(Skill.schema.paths),
        pathCount: Object.keys(Skill.schema.paths).length
      },
      {
        name: 'Session',
        fields: Object.keys(Session.schema.paths),
        pathCount: Object.keys(Session.schema.paths).length
      },
      {
        name: 'Slot',
        fields: Object.keys(Slot.schema.paths),
        pathCount: Object.keys(Slot.schema.paths).length
      },
      {
        name: 'Message',
        fields: Object.keys(Message.schema.paths),
        pathCount: Object.keys(Message.schema.paths).length
      },
      {
        name: 'Feedback',
        fields: Object.keys(Feedback.schema.paths),
        pathCount: Object.keys(Feedback.schema.paths).length
      }
    ],

    tests: [],
    stats: {},
    overallStatus: 'PASSED'
  };

  // TEST 1: Valid User Validation

  try {
    const validUserDoc = new User({
      user_id: 'test_usr_1',
      name: 'Verification Student',
      email: 'test@rvu.edu.in',
      password_hash: 'hashed_pw_example',
      usn: '1RUA24SCS9999',
      department: 'CSE',
      semester: '5th Sem'
    });

    const err = validUserDoc.validateSync();

    results.tests.push({
      id: 'DB-01',
      title: 'User Schema Validation (Positive)',
      status: err ? 'FAILED' : 'PASSED',
      detail: err
        ? err.message
        : 'Successfully validated student schema'
    });

  } catch (e) {
    results.tests.push({
      id: 'DB-01',
      title: 'User Schema Validation (Positive)',
      status: 'FAILED',
      detail: e.message
    });
  }

  // TEST 2: Invalid User Validation

  try {
    const invalidUser = new User({
      user_id: 'test_usr_invalid',
      name: 'X',
      email: 'invalid-email-no-at',
      password_hash: 'pw'
    });

    const err = invalidUser.validateSync();

    const caughtErrors = err
      ? Object.keys(err.errors)
      : [];

    const passed =
      caughtErrors.includes('email') &&
      caughtErrors.includes('usn') &&
      caughtErrors.includes('name');

    results.tests.push({
      id: 'DB-02',
      title: 'Validation Constraint Enforcement (Negative)',
      status: passed ? 'PASSED' : 'FAILED',
      detail: `Intercepted invalid fields: [${caughtErrors.join(', ')}]`
    });

  } catch (e) {
    results.tests.push({
      id: 'DB-02',
      title: 'Validation Constraint Enforcement',
      status: 'FAILED',
      detail: e.message
    });
  }

  // TEST 3: Feedback Rating Validation

  try {
    const invalidFeedback = new Feedback({
      feedback_id: 'test_fb_invalid',
      session_id: 'ses_1',
      teacher_id: 'usr_2',
      given_by_id: 'usr_1',
      given_by_name: 'Test',
      skill_name: 'Testing',
      rating: 6,
      comment: 'Valid comment'
    });

    const err = invalidFeedback.validateSync();

    const ratingError =
      err && err.errors && err.errors.rating;

    results.tests.push({
      id: 'DB-03',
      title: 'Rating Boundary Constraint (1-5)',
      status: ratingError ? 'PASSED' : 'FAILED',
      detail: ratingError
        ? 'Correctly rejected rating = 6'
        : 'Rating constraint failed'
    });

  } catch (e) {
    results.tests.push({
      id: 'DB-03',
      title: 'Rating Boundary Constraint',
      status: 'FAILED',
      detail: e.message
    });
  }

  // TEST 4: Relational Integrity

  try {
    const [
      usersCount,
      skillsCount,
      sessionsCount,
      slotsCount,
      feedbackCount,
      messagesCount,
      users,
      sessions
    ] = await Promise.all([
      User.countDocuments(),
      Skill.countDocuments(),
      Session.countDocuments(),
      Slot.countDocuments(),
      Feedback.countDocuments(),
      Message.countDocuments(),
      User.find().select('user_id').lean(),
      Session.find().select('teacher_id learner_id').lean()
    ]);

    const userIds = new Set(
      users.map(user => user.user_id)
    );

    const brokenSessions = sessions.filter(
      session =>
        !userIds.has(session.teacher_id) ||
        !userIds.has(session.learner_id)
    );

    const passed = brokenSessions.length === 0;

    results.tests.push({
      id: 'DB-04',
      title: 'Relational Integrity Check',
      status: passed ? 'PASSED' : 'FAILED',
      detail: passed
        ? 'No orphaned session records found in MongoDB.'
        : `${brokenSessions.length} sessions reference missing users.`
    });

    results.stats = {
      users: usersCount,
      skills: skillsCount,
      sessions: sessionsCount,
      slots: slotsCount,
      feedback: feedbackCount,
      messages: messagesCount
    };

    dbState.stats = results.stats;

  } catch (e) {
    results.tests.push({
      id: 'DB-04',
      title: 'Relational Integrity Check',
      status: 'FAILED',
      detail: e.message
    });
  }

  results.overallStatus = results.tests.every(
    test => test.status === 'PASSED'
  ) ? 'PASSED' : 'FAILED';

  return results;
}
