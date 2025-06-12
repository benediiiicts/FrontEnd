const pool = require('../config/database');

const getMatchedUsers = async (req, res) => {
  const currentUserId = req.body.userId; 

  if (!currentUserId) {
    return res.status(400).json({ message: 'userId is missing from request body' });
  }

  try {
    const createConversationsQuery = `
      INSERT INTO percakapan (user1_id, user2_id)
      SELECT
        LEAST($1, liked_user_id) AS user1,
        GREATEST($1, liked_user_id) AS user2
      FROM liked_users
      WHERE
        liking_user_id = $1 AND
        liked_user_id IN (SELECT liking_user_id FROM liked_users WHERE liked_user_id = $1)
      ON CONFLICT (user1_id, user2_id) DO NOTHING;
    `;
    await pool.query(createConversationsQuery, [currentUserId]);

    const getContactsQuery = `
      SELECT
        u.user_id,
        u.nama,
        encode(u.profile_picture, 'base64') AS profile_picture
      FROM
        users u
      WHERE
        u.user_id IN (
          SELECT user2_id FROM percakapan WHERE user1_id = $1
          UNION
          SELECT user1_id FROM percakapan WHERE user2_id = $1
        );
    `;
    
    const result = await pool.query(getContactsQuery, [currentUserId]);
    res.json(result.rows);

  } catch (error) {
      console.error("Error fetching or syncing contacts:", error);
      res.status(500).json({ message: 'Internal server error' });
  }
}

const initializeChat = async (io, socket) => {
  console.log(`[Chat Controller] Mengelola koneksi untuk user: ${socket.id}`);

  // Listener untuk memuat riwayat chat
  socket.on('muat_riwayat_chat', async (data) => {
    try {
        const { user1_id, user2_id } = data;
        const id1 = Math.min(user1_id, user2_id);
        const id2 = Math.max(user1_id, user2_id);

        let percakapan_id;

        // --- FIX: Replace complex query with explicit find-then-create logic ---
        // Step 1: Try to find the existing conversation
        let percakapanQuery = await pool.query(
            'SELECT id FROM percakapan WHERE user1_id = $1 AND user2_id = $2',
            [id1, id2]
        );

        if (percakapanQuery.rows.length > 0) {
            // Conversation exists
            percakapan_id = percakapanQuery.rows[0].id;
            console.log(`[muat_riwayat_chat] Percakapan ditemukan. ID: ${percakapan_id}`);
        } else {
            // Conversation does not exist, so create it
            console.log(`[muat_riwayat_chat] Percakapan tidak ditemukan. Membuat baru...`);
            let insertQuery = await pool.query(
                'INSERT INTO percakapan (user1_id, user2_id) VALUES ($1, $2) RETURNING id',
                [id1, id2]
            );
            percakapan_id = insertQuery.rows[0].id;
            console.log(`[muat_riwayat_chat] Percakapan baru dibuat. ID: ${percakapan_id}`);
        }

        socket.join(percakapan_id.toString());
        console.log(`[muat_riwayat_chat] User ${socket.id} joined room ${percakapan_id}`);

        // Step 2: Fetch messages using the confirmed percakapan_id
        const messagesQuery = await pool.query(
            'SELECT * FROM chats WHERE percakapan_id = $1 ORDER BY created_at ASC',
            [percakapan_id]
        );
        console.log(`[muat_riwayat_chat] Ditemukan ${messagesQuery.rows.length} pesan untuk percakapan ID ${percakapan_id}`);

        // Step 3: Emit the history and the percakapan_id to the client
        socket.emit('riwayat_chat', {
            messages: messagesQuery.rows,
            percakapan_id: percakapan_id
        });

    } catch (error) {
        console.error('!!! ERROR di muat_riwayat_chat:', error);
        socket.emit('chat_error', 'Gagal memuat riwayat chat di server.');
    }
  });

  // Listener untuk mengirim pesan baru
  socket.on('kirim_pesan', async (data) => {
    try {
      const { sender_id, receiver_id, content } = data;
      
      const id1 = Math.min(sender_id, receiver_id);
      const id2 = Math.max(sender_id, receiver_id);
      
      const percakapanResult = await pool.query(
        'SELECT id FROM percakapan WHERE user1_id = $1 AND user2_id = $2',
        [id1, id2]
      );
        
      if (percakapanResult.rows.length === 0) {
        throw new Error("Gagal menemukan percakapan. Percakapan seharusnya sudah dibuat.");
      }
      const percakapan_id = percakapanResult.rows[0].id;
      
      const messageQuery = await pool.query(
        'INSERT INTO chats (percakapan_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
        [percakapan_id, sender_id, content]
      );
      const pesanBaru = messageQuery.rows[0];
      
      io.to(percakapan_id.toString()).emit('pesan_baru', pesanBaru);

    } catch (error) {
      console.error('Error di kirim_pesan:', error);
      socket.emit('kirim_pesan_error', 'Pesan gagal diproses oleh server.');
    }
  });
};

module.exports = {initializeChat, getMatchedUsers};