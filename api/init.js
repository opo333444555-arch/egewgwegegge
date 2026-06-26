const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL is not set' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // Drop existing tables if needed (optional, uncomment for testing but be careful!)
    // await sql`DROP TABLE IF EXISTS journals, assignments, subject_notes, streaks, user_status, quest_checks, quests, subjects, users CASCADE;`;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY,
        username VARCHAR UNIQUE NOT NULL,
        display_name VARCHAR NOT NULL,
        password_hash VARCHAR NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_data (
        user_id VARCHAR PRIMARY KEY REFERENCES users(id),
        data JSONB NOT NULL DEFAULT '{}'::jsonb
      );
    `;

    return res.status(200).json({ message: 'Database tables initialized successfully' });
  } catch (error) {
    console.error('Initialization error:', error);
    return res.status(500).json({ error: 'Database initialization failed', details: error.message });
  }
};
