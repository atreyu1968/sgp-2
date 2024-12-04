import { createClient } from '@libsql/client';
import { config } from '../config';

const client = createClient({
  url: config.db.url,
  authToken: config.db.authToken,
});

export async function query(sql: string, params: any[] = []) {
  try {
    const result = await client.execute(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function transaction<T>(callback: () => Promise<T>): Promise<T> {
  try {
    await client.execute('BEGIN');
    const result = await callback();
    await client.execute('COMMIT');
    return result;
  } catch (error) {
    await client.execute('ROLLBACK');
    throw error;
  }
}