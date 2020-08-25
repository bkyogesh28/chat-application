const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require("socket.io")
const ejs=require("ejs")
const bad=require('bad-words')
const app=express()
const {genmessage,locationtime}=require("./utils/messages")
const{details,removeuser,getuser,getroomusers}=require("./utils/user")
const server=http.createServer(app)
const io=socketio(server)
app.set('view engine','ejs')
app.use(express.static('public'))
const publicdirec=path.join(__dirname,"../public")
const port=process.env.PORT||5000
// app.get("/",(req,res)=>{
//     res.render("index.html")
// })
io.on('connection',(socket)=>{
    try{
        console.log("Websocket connection established")
      
     
       socket.on("join",({name,room},callback)=>{
           const {error,usedetails}=details({id:socket.id,name,room})
           if(error){
               return  callback(error)
           }
                socket.join(usedetails.room)
                socket.emit("message",genmessage("Welcome to chatstore",usedetails.name))
                //console.log(user)
                socket.broadcast.to(usedetails.room).emit("message",genmessage(`${usedetails.name} has joined the Chat`))
                callback()
                io.to(usedetails.room).emit("roomdata",{
                    room:usedetails.room,
                    users:getroomusers(usedetails.room)
                })
       })
       socket.on("Sendmessage",(msg,callback)=>{
           const user=getuser(socket.id)
           const filter=new bad()
           if(filter.isProfane(msg)){
               return callback("Bad words are not allowed")
           }
           io.to(user.room).emit("message",genmessage(msg,user.name))
           callback()
       })
       socket.on("sendloc",(coords,callback)=>{
           const user=getuser(socket.id)
            io.to(user.room).emit("location",locationtime(user.name,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
            callback("Succesfully")
       })
       socket.on('disconnect',()=>{
           const user=removeuser(socket.id)
           if(user){
            io.to(user.room).emit("message",genmessage(`${user.name} has left the chat`))
            io.to(user.room).emit("roomdata",{
                room:user.room,
                users:getroomusers(user.room)
            })
           }
     
          
       })
    }catch(e){
        console.log(e)
    }


})

server.listen(port,()=>{
    console.log("Port running at "+port)
})