const pool = require('../config/database');

async function checkMutualLike(user1_id, user2_id) {
  const query = `
    SELECT COUNT(*) 
    FROM liked_users
    WHERE 
      (liking_user_id = $1 AND liked_user_id = $2) OR
      (liking_user_id = $2 AND liked_user_id = $1);
  `;
  try {
    const result = await pool.query(query, [user1_id, user2_id]);
    //check jika user saling like
    return parseInt(result.rows[0].count) === 2;
  } catch (error) {
    console.error("Database error on checking mutual like:", error);
    return false;
  }
}

const initializeChat = (io, socket) => {
  console.log(`[Chat Controller] Mengelola koneksi untuk user: ${socket.id}`);

  // Listener untuk memuat riwayat chat
  socket.on('muat_riwayat_chat', async (data) => {
    try {
      const { user1_id, user2_id } = data;

      // verifikasi like dua arah
      const isMatch = await checkMutualLike(user1_id, user2_id);
      if (!isMatch) {
        console.log(`${user1_id} dan ${user2_id} tidak match`);
        socket.emit('chat_error', 'Anda hanya dapat memulai percakapan dengan pengguna yang cocok.');
        return;
      }

      console.log(`Memuat riwayat chat antara ${user1_id} dan ${user2_id}`);
      const id1 = Math.min(user1_id, user2_id);
      const id2 = Math.max(user1_id, user2_id);
      const query = await pool.query(
        'SELECT id FROM percakapan WHERE user1_id = $1 AND user2_id = $2',
        [id1, id2]
      );

      if (query.rows.length > 0) {
        const percakapan_id = query.rows[0].id;
        socket.join(percakapan_id.toString());
        
        const messagesQuery = await pool.query(
          'SELECT * FROM chats WHERE percakapan_id = $1 ORDER BY created_at ASC',
          [percakapan_id]
        );
        socket.emit('riwayat_chat', messagesQuery.rows);
      } else {
        socket.emit('riwayat_chat', []);
      }
    } catch (error) {
      console.error('Error di muat_riwayat_chat:', error);
    }
  });

  // Listener untuk mengirim pesan baru
  socket.on('kirim_pesan', async (data) => {
    try {
      const { sender_id, receiver_id, content } = data;
      const isMatch = await checkMutualLike(sender_id, receiver_id);
      if (!isMatch) {
        console.log(`[AUTH] Pengiriman pesan diblokir dari ${sender_id} ke ${receiver_id} karena tidak cocok.`);
        socket.emit('kirim_pesan_error', 'Pesan tidak terkirim. Anda hanya dapat mengirim pesan ke pengguna yang cocok.');
        return;
      }
      
      const id1 = Math.min(sender_id, receiver_id);
      const id2 = Math.max(sender_id, receiver_id);

      const percakapanQuery = await pool.query(
        `WITH ins AS (
            INSERT INTO percakapan (user1_id, user2_id) VALUES ($1, $2)
            ON CONFLICT (user1_id, user2_id) DO NOTHING RETURNING id
         )
         SELECT id FROM ins UNION ALL SELECT id FROM percakapan WHERE user1_id = $1 AND user2_id = $2;`,
        [id1, id2]
      );
      const percakapan_id = percakapanQuery.rows[0].id;
      
      const messageQuery = await pool.query(
        'INSERT INTO chats (percakapan_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
        [percakapan_id, sender_id, content]
      );
      const pesanBaru = messageQuery.rows[0];

      io.to(percakapan_id.toString()).emit('pesan_baru', pesanBaru);
    } catch (error) {
      console.error('Error di kirim_pesan:', error);
      socket.emit('kirim_pesan_error', 'Pesan gagal dikirim.');
    }
  });
};

module.exports = initializeChat;