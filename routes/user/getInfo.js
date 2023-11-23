module.exports = {
  name: "count",
  middleware: [],
  method: "get",
  run: ({ req, res, sql }) => {
    // Câu truy vấn SQL để đếm số thành viên trong bảng 'user'
    const countUsersQuery = 'SELECT * FROM user';

    // Thực hiện truy vấn
    sql.query(countUsersQuery, (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn:', err);
        res.status(500).json({ error: true, message: 'Lỗi truy vấn' });
        return;
      }

      // Kết quả trả về là một mảng gồm một đối tượng, với thuộc tính 'totalUsers'
      const totalUsers = results;

      // Trả kết quả về client
      res.json({ totalUsers });
    });
  },
};
