const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser || '');
const PASSWORD = encodeURIComponent(config.dbPassword || '');
const DB_NAME = config.dbName || 'properties-dev';

let MONGO_URI;
if (config.dbUser && config.dbPassword && config.dbHost) {
  MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;
} else if (config.dbHost && config.dbHost !== 'localhost') {
  MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;
} else {
  const host = config.dbHost || 'localhost';
  const port = config.dbPort || '27017';
  MONGO_URI = `mongodb://${host}:${port}/${DB_NAME}`;
}

// Dev seed data for in-memory store
const DEV_API_KEYS = [
  {
    _id: new ObjectId(),
    token: config.publicApiKeyToken || 'public-dev-token',
    scopes: ['signin:auth', 'signup:auth', 'read:properties']
  },
  {
    _id: new ObjectId(),
    token: config.adminApiKeyToken || 'admin-dev-token',
    scopes: [
      'signin:auth', 'signup:auth',
      'read:properties', 'create:properties',
      'update:properties', 'delete:properties'
    ]
  }
];

// In-memory store used when MongoDB is not available (dev mode)
class InMemoryDb {
  constructor() {
    this.collections = {
      'api-keys': [...DEV_API_KEYS]
    };
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }
    const data = this.collections[name];
    return {
      find(query) {
        return {
          toArray() {
            if (!query || Object.keys(query).length === 0) return Promise.resolve([...data]);
            return Promise.resolve(data.filter(doc => {
              return Object.entries(query).every(([key, val]) => {
                if (val && val.$in) return val.$in.some(v => doc[key] && doc[key].includes(v));
                return doc[key] === val;
              });
            }));
          }
        };
      },
      findOne(query) {
        const match = data.find(doc => {
          return Object.entries(query).every(([key, val]) => {
            if (key === '_id') return String(doc._id) === String(val);
            return doc[key] === val;
          });
        });
        return Promise.resolve(match || null);
      },
      insertOne(doc) {
        const _id = new ObjectId();
        const newDoc = { _id, ...doc };
        data.push(newDoc);
        return Promise.resolve({ insertedId: _id });
      },
      updateOne(query, update) {
        const idx = data.findIndex(doc => String(doc._id) === String(query._id));
        if (idx !== -1 && update.$set) {
          Object.assign(data[idx], update.$set);
          return Promise.resolve({ upsertedId: null });
        }
        return Promise.resolve({ upsertedId: null });
      },
      deleteOne(query) {
        const idx = data.findIndex(doc => String(doc._id) === String(query._id));
        if (idx !== -1) data.splice(idx, 1);
        return Promise.resolve({ deletedCount: idx !== -1 ? 1 : 0 });
      }
    };
  }
}

class MongoLib {
  constructor() {
    this.dbName = DB_NAME;
    this._mongoUri = MONGO_URI;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        const client = new MongoClient(this._mongoUri, { useNewUrlParser: true });
        client.connect(err => {
          if (err) {
            if (config.dev) {
              console.log('[DEV] MongoDB unavailable, using in-memory store');
              resolve(new InMemoryDb());
              return;
            }
            reject(err);
            return;
          }

          console.log('Connected succesfully to mongo');
          resolve(client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  getAll(collection, query) {
    return this.connect().then(db => {
      return db
        .collection(collection)
        .find(query)
        .toArray();
    });
  }

  get(collection, id) {
    return this.connect().then(db => {
      return db.collection(collection).findOne({ _id: ObjectId(id) });
    });
  }

  create(collection, data) {
    return this.connect()
      .then(db => {
        return db.collection(collection).insertOne(data);
      })
      .then(result => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect()
      .then(db => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: false });
      })
      .then(result => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect()
      .then(db => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) });
      })
      .then(() => id);
  }
}

module.exports = MongoLib;
