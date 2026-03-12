import { openDB } from 'idb';
import { DB_NAME, DB_VERSION, STORE_APPLICATIONS, STORE_PENDING } from '../utils/constants';

// Open / upgrade IndexedDB
async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_APPLICATIONS)) {
        const store = db.createObjectStore(STORE_APPLICATIONS, { keyPath: 'id' });
        store.createIndex('status', 'status');
        store.createIndex('tanggal_lamar', 'tanggal_lamar');
      }
      if (!db.objectStoreNames.contains(STORE_PENDING)) {
        db.createObjectStore(STORE_PENDING, { keyPath: 'id' });
      }
    },
  });
}

// ── Applications cache ──────────────────────────────────────────────────────

export async function saveAllToDB(applications) {
  const db = await getDB();
  const tx = db.transaction(STORE_APPLICATIONS, 'readwrite');
  await Promise.all([
    ...applications.map(app => tx.store.put(app)),
    tx.done,
  ]);
}

export async function getAllFromDB() {
  const db = await getDB();
  return db.getAll(STORE_APPLICATIONS);
}

export async function saveOneToDB(application) {
  const db = await getDB();
  return db.put(STORE_APPLICATIONS, application);
}

export async function deleteOneFromDB(id) {
  const db = await getDB();
  return db.delete(STORE_APPLICATIONS, id);
}

export async function clearApplicationsDB() {
  const db = await getDB();
  return db.clear(STORE_APPLICATIONS);
}

// ── Pending Sync queue ──────────────────────────────────────────────────────

export async function addPendingSync(item) {
  const db = await getDB();
  return db.put(STORE_PENDING, item);
}

export async function getAllPendingSyncs() {
  const db = await getDB();
  return db.getAll(STORE_PENDING);
}

export async function deletePendingSync(id) {
  const db = await getDB();
  return db.delete(STORE_PENDING, id);
}

export async function clearPendingSyncs() {
  const db = await getDB();
  return db.clear(STORE_PENDING);
}
