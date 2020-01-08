const express = require('express')
const app = express()
const http = require('http').Server(app)
var io = require('socket.io')(http)
app.use('/static',express.static(__dirname+'/public'));
// 建立连接
io.on("connection",function (socket) {
  // 注册广播事件，事件名称同前端页面注册的事件名
  socket.on("chat message",function (obj) {
    console.log("广播的内容是",obj)
    // 广播给所有人
    io.emit('chat message',obj.message)
  })

  // 监听连接中断
  socket.on("disconnect",function () {
    console.log("disconnect：用户连接中断")
  })
})



http.listen(4000,()=>{
  console.log("4000端口启动成功")
})






