const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, username, passwordHash, displayName, id } = req.body;

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    if (action === 'register') {
      if (!username || !passwordHash || !displayName || !id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if username exists
      const existing = await sql`SELECT id FROM users WHERE username = ${username.toLowerCase()}`;
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Insert new user
      await sql`
        INSERT INTO users (id, username, display_name, password_hash)
        VALUES (${id}, ${username.toLowerCase()}, ${displayName}, ${passwordHash})
      `;
      
      // Initialize empty user_data
      await sql`
        INSERT INTO user_data (user_id, data)
        VALUES (${id}, '{}'::jsonb)
      `;

      return res.status(200).json({ success: true, user: { id, username, displayName } });
    } 
    
    else if (action === 'login') {
      if (!username || !passwordHash) {
        return res.status(400).json({ error: 'Missing username or password' });
      }

      const users = await sql`
        SELECT id, username, display_name, password_hash 
        FROM users 
        WHERE username = ${username.toLowerCase()}
      `;

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
      if (user.password_hash !== passwordHash) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return res.status(200).json({ 
        success: true, 
        user: { id: user.id, username: user.username, displayName: user.display_name } 
      });
    } 
    
    else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
