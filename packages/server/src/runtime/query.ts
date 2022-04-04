import sqlite3 from 'sqlite3';
import connect, { open } from 'sqlite';

const dbPromise = open({
  filename: 'employees.db',
  driver: sqlite3.Database
});


export const query = async (stack: any[]) => {
  // pop args in reverse order
  const aggregator = String(stack.shift());
  const query = String(stack.shift());

  const db = await dbPromise;

  const results = await db.all(query);

  if (aggregator) {
    let total = 0;
    for (const result of results) {
      total += Number(result[aggregator]);
    }

    return total;
  } else {
    return Object.values(results[0])[0];
  }
}
