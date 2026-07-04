import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE_PATH = path.resolve(__dirname, '../../database/local_db.json');

class LocalDB {
  constructor() {
    this.data = {
      users: [],
      leetcodeProfiles: [],
      syncLogs: [],
      heatmaps: [],
      contestHistory: [],
      dailyStats: []
    };
    this.init();
  }

  init() {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf8');
        this.data = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading local fallback database file, re-initializing...', err);
        this.save();
      }
    } else {
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing local database file:', err);
    }
  }

  async find(collection, query = {}) {
    const list = this.data[collection] || [];
    return list.filter(item => this.matchQuery(item, query));
  }

  async findOne(collection, query = {}) {
    const list = this.data[collection] || [];
    return list.find(item => this.matchQuery(item, query)) || null;
  }

  async insertOne(collection, doc) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const newDoc = {
      _id: doc._id || Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    this.data[collection].push(newDoc);
    this.save();
    return newDoc;
  }

  async updateOne(collection, query, update) {
    const list = this.data[collection] || [];
    const index = list.findIndex(item => this.matchQuery(item, query));
    if (index === -1) return { matchedCount: 0, modifiedCount: 0 };

    const original = list[index];
    const updateOperators = Object.keys(update);
    let updated = { ...original };

    if (updateOperators.includes('$set') || updateOperators.includes('$push')) {
      if (update.$set) {
        updated = { ...updated, ...update.$set };
      }
      if (update.$push) {
        for (const [key, val] of Object.entries(update.$push)) {
          if (!Array.isArray(updated[key])) {
            updated[key] = [];
          }
          updated[key].push(val);
        }
      }
    } else {
      updated = { ...updated, ...update };
    }

    updated.updatedAt = new Date().toISOString();
    list[index] = updated;
    this.save();
    return { matchedCount: 1, modifiedCount: 1, doc: updated };
  }

  async deleteOne(collection, query) {
    const list = this.data[collection] || [];
    const index = list.findIndex(item => this.matchQuery(item, query));
    if (index === -1) return { deletedCount: 0 };

    list.splice(index, 1);
    this.save();
    return { deletedCount: 1 };
  }

  matchQuery(item, query) {
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === 'object' && value !== null) {
        // Simple support for Mongo query operators if needed
        if (value.$eq !== undefined && item[key] !== value.$eq) return false;
        if (value.$ne !== undefined && item[key] === value.$ne) return false;
      } else if (item[key] !== value) {
        return false;
      }
    }
    return true;
  }
}

export const localDb = new LocalDB();
