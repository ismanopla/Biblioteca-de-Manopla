import 'server-only';
import {get, list, put} from '@vercel/blob';

const namespace = 'biblioteca-v1/';
async function readBody(key: string) {
  const result = await get(namespace + key, {access: 'private', useCache: false});
  if (!result) return null;
  if (result.statusCode !== 200) throw new Error('Respuesta inesperada del almacenamiento');
  return new Response(result.stream);
}

export function store() {
  return {
    async set(key: string, value: Blob) {
      await put(namespace + key, value, {access: 'private', addRandomSuffix: false});
    },
    async get(key: string, _options: {type: 'arrayBuffer'}): Promise<ArrayBuffer | null> {
      const body = await readBody(key);
      return body ? body.arrayBuffer() : null;
    },
  };
}

export async function listRecords<T>(prefix: string): Promise<T[]> {
  const records: T[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({prefix: namespace + prefix, cursor, limit: 100});
    const rows = await Promise.all(page.blobs.map(async blob => {
      const body = await readBody(blob.pathname.slice(namespace.length));
      return body ? await body.json() as T : null;
    }));
    for (const row of rows) if (row !== null) records.push(row);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return records;
}

export async function writeRecord(prefix: string, id: string, value: unknown) {
  await put(namespace + prefix + id, JSON.stringify(value), {
    access: 'private', addRandomSuffix: false, allowOverwrite: true,
    contentType: 'application/json',
  });
}

export async function readRecord<T>(prefix: string, id: string): Promise<T | null> {
  const body = await readBody(prefix + id);
  return body ? await body.json() as T : null;
}
