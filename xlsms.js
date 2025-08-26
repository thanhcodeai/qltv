const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 8080;
const path = require('path');

app.use(express.static(path.join(__dirname, 'front-end')));
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',     
  database: 'library_db'
});

// Kết nối CSDL
db.connect(err => {
  if (err) {
    console.error('Kết nối CSDL thất bại:', err);
  } else {
    console.log('Đã kết nối CSDL.');
  }
});

// Route lấy lịch sử mượn theo ID tài khoản
app.get('/lich-su/:id', (req, res) => {
  const taiKhoanId = req.params.id;
  const query = `
    SELECT 
      s.tenSach, 
      s.anhSach,
      tg.tenTacGia,
      ms.soLuongMuon, 
      ms.ngayMuon, 
      ms.ngayTra, 
      ms.trangThai
    FROM MUON_SACH ms
    JOIN SACH s ON ms.maSach = s.maSach
    JOIN tac_gia tg ON s.maTacGia = tg.maTacGia
    WHERE ms.ID = ?
  `;

  db.query(query, [taiKhoanId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Lỗi server');
    }

    if (results.length === 0) {
      return res.status(404).send('Không tìm thấy lịch sử mượn sách');
    }

    res.json(results);
  });
});
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
