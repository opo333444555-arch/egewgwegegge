const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      const rows = await sql`
        SELECT data FROM user_data WHERE user_id = ${userId}
      `;

      if (rows.length === 0) {
        return res.status(200).json({ data: {} });
      }

      return res.status(200).json({ data: rows[0].data });
    } 
    
    else if (req.method === 'POST') {
      const { userId, data } = req.body;
      
      if (!userId || !data) {
        return res.status(400).json({ error: 'Missing userId or data' });
      }

      // Upsert data
      await sql`
        INSERT INTO user_data (user_id, data)
        VALUES (${userId}, ${data}::jsonb)
        ON CONFLICT (user_id) 
        DO UPDATE SET data = ${data}::jsonb
      `;

      return res.status(200).json({ success: true });
    }
    
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Data error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
