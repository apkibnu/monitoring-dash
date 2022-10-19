// module express
const express = require('express');
const app = express();
const port = 3333;
const http = require('http').Server(app)
const io = require("socket.io")(http)
const int = require('./socket/interval-c4')
const router = require('./routes/route')

// module ejs
app.set('view engine', 'ejs');
// access file static
app.use(express.static('public'));

io.on('connection', (socket) => {
    int.intervalc4(socket)
    int.intervaldetail(socket)
    int.intervaldetailng(socket)
    int.disconnect(socket)
})

app.use(router)

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(new Date());
});
