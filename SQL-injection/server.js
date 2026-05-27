const express = require('express');
const db = require('./database');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <h2>Login (Vulnerable System)</h2>
        <form method="POST" action="/login">
            Username: <input type="text" name="username"><br>
            Password: <input type="password" name="password"><br>
            <button type="submit">Login</button>
        </form>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"; sql injection in case like
    // admin' -- ทำให้เงื่อนไข password หายไป
    // ' OR '1'= '1 ทำให้ เงื่อนไข password เป็นจริงเสมอ
    const query = "SELECT * FROM users WHERE username = ? AND password = ?"; //แก้ได้ด้วยสิ่งนี้
    console.log("Executing Query: ", query);

    // db.get(query, (err, row) => {
    db.get(query, [username, password], (err, row) => {
        if (row) {
            res.send("<h1>Welcome back, " + row.username + "!</h1>");
        } else {
            res.send("<h1>Login Failed!</h1>");
        }
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));