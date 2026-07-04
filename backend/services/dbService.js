import { getIsMongoConnected } from '../config/db.js';
import User from '../models/User.js';
import LeetCodeProfile from '../models/LeetCodeProfile.js';
import SyncLog from '../models/SyncLog.js';
import ProblemCache from '../models/ProblemCache.js';
import { localDb } from '../database/localDb.js';

// Helper to convert Mongo docs to plain objects
const toPlain = (doc) => {
  if (!doc) return null;
  if (typeof doc.toObject === 'function') {
    const plain = doc.toObject();
    if (plain._id) plain._id = plain._id.toString();
    return plain;
  }
  return doc;
};

class DBService {
  // --- USER OPERATIONS ---
  async findUser(query) {
    if (getIsMongoConnected()) {
      const doc = await User.findOne(query);
      return toPlain(doc);
    } else {
      return await localDb.findOne('users', query);
    }
  }

  async findUserById(id) {
    if (getIsMongoConnected()) {
      const doc = await User.findById(id);
      return toPlain(doc);
    } else {
      return await localDb.findOne('users', { _id: id });
    }
  }

  async createUser(data) {
    if (getIsMongoConnected()) {
      const doc = new User(data);
      await doc.save();
      return toPlain(doc);
    } else {
      return await localDb.insertOne('users', data);
    }
  }

  async updateUser(query, update) {
    if (getIsMongoConnected()) {
      const doc = await User.findOneAndUpdate(query, update, { new: true });
      return toPlain(doc);
    } else {
      const res = await localDb.updateOne('users', query, update);
      return res.doc || null;
    }
  }

  async deleteUser(query) {
    if (getIsMongoConnected()) {
      return await User.deleteOne(query);
    } else {
      return await localDb.deleteOne('users', query);
    }
  }

  async getAllUsers() {
    if (getIsMongoConnected()) {
      const docs = await User.find({});
      return docs.map(toPlain);
    } else {
      return await localDb.find('users', {});
    }
  }

  // --- LEETCODE PROFILE OPERATIONS ---
  async findLeetCodeProfile(query) {
    if (getIsMongoConnected()) {
      const doc = await LeetCodeProfile.findOne(query);
      return toPlain(doc);
    } else {
      return await localDb.findOne('leetcodeProfiles', query);
    }
  }

  async saveLeetCodeProfile(userId, username, profileData) {
    if (getIsMongoConnected()) {
      const doc = await LeetCodeProfile.findOneAndUpdate(
        { userId },
        { username, ...profileData, userId },
        { upsert: true, new: true }
      );
      return toPlain(doc);
    } else {
      const existing = await localDb.findOne('leetcodeProfiles', { userId: userId.toString() });
      if (existing) {
        const res = await localDb.updateOne('leetcodeProfiles', { userId: userId.toString() }, { $set: { username, ...profileData } });
        return res.doc;
      } else {
        return await localDb.insertOne('leetcodeProfiles', { userId: userId.toString(), username, ...profileData });
      }
    }
  }

  // --- SYNC LOG OPERATIONS ---
  async createSyncLog(data) {
    if (getIsMongoConnected()) {
      const doc = new SyncLog(data);
      await doc.save();
      return toPlain(doc);
    } else {
      return await localDb.insertOne('syncLogs', data);
    }
  }

  async getSyncLogs(query = {}) {
    if (getIsMongoConnected()) {
      const docs = await SyncLog.find(query).sort({ timestamp: -1 }).limit(100);
      return docs.map(toPlain);
    } else {
      const logs = await localDb.find('syncLogs', query);
      // Sort and limit local logs
      return logs
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 100);
    }
  }

  async findProblemCache(titleSlug) {
    if (getIsMongoConnected()) {
      const doc = await ProblemCache.findOne({ titleSlug });
      return toPlain(doc);
    } else {
      return await localDb.findOne('problemCache', { titleSlug });
    }
  }

  async saveProblemCache(titleSlug, data) {
    if (getIsMongoConnected()) {
      const doc = await ProblemCache.findOneAndUpdate(
        { titleSlug },
        { titleSlug, ...data },
        { upsert: true, new: true }
      );
      return toPlain(doc);
    } else {
      const existing = await localDb.findOne('problemCache', { titleSlug });
      if (existing) {
        const res = await localDb.updateOne('problemCache', { titleSlug }, { $set: data });
        return res.doc;
      } else {
        return await localDb.insertOne('problemCache', { titleSlug, ...data });
      }
    }
  }
}

export const dbService = new DBService();
