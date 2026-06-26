const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

async function init() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const dbUrl = envFile.match(/DATABASE_URL=(.*)/)[1];
  
  console.log('Initializing DB...');
  const sql = neon(dbUrl);

  try {
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
    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

init();
