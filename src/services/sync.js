import * as apiService from './api';
import * as db from './db';

/**
 * Attempt to flush all pending sync items to the backend.
 * Returns { synced, failed } counts.
 */
export async function syncPendingData(onProgress) {
  const pending = await db.getAllPendingSyncs();
  if (pending.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;

  for (const item of pending) {
    try {
      if (item.operation === 'create') {
        await apiService.createApplication(item.data);
      } else if (item.operation === 'update') {
        await apiService.updateApplication(item.data.id, item.data);
      } else if (item.operation === 'delete') {
        await apiService.deleteApplication(item.data.id);
      }
      await db.deletePendingSync(item.id);
      synced++;
      onProgress?.({ synced, failed, total: pending.length });
    } catch (err) {
      console.warn(`Sync failed for item ${item.id}:`, err.message);
      failed++;
    }
  }

  return { synced, failed };
}

/**
 * Queue an operation to be synced later (when offline).
 */
export async function queueForSync(operation, data) {
  const item = {
    id: `${operation}-${data.id}-${Date.now()}`,
    operation,
    data,
    queuedAt: new Date().toISOString(),
  };
  await db.addPendingSync(item);
  return item;
}
