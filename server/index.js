
const {Server} = require("socket.io")
const http = require("http")
const express = require("express")
const cors = require("cors")

const app = express();

app.use(cors())
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"]
  }
})

io.on("connection",(socket)=>{
  socket.on("message",(data)=>{
     io.emit("received",{
      input:data.input,
      user:data.user
     })
  })
})

server.listen(9000,()=>{
  console.log("Server listening on",9000);
})
