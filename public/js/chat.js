const socket=io()
const form=document.querySelector("#send")
const input=form.querySelector("#input")
const button=form.querySelector("#butt")
const template=document.querySelector("#template").innerHTML
const loctemplate=document.querySelector("#loctemplate").innerHTML
const mss=document.querySelector("#mess")
const {name,room}=Qs.parse(location.search,{ ignoreQueryPrefix:true})
const userlist=document.querySelector("#sidebar-template").innerHTML

const autoscroll=()=>{
    const newmss=mss.lastElementChild
    const newmss1=getComputedStyle(newmss)
    const margin=parseInt(newmss1.marginBottom)
    const height=newmss.offsetHeight+margin
    const vhght=mss.offsetHeight
    const chgt=mss.scrollHeight
    const scroll=mss.scrollTop+vhght

    if(chgt-height<=scroll){
        mss.scrollTop=mss.scrollHeight
    }
}
socket.on("message",(message)=>{
    console.log(message)
    const html=Mustache.render(template,{
        name:message.name,
        message:message.tweets,
        createdAT:moment(message.createdAT).format("h:mm a")
    })
    mss.insertAdjacentHTML("beforeend",html)
    autoscroll()
})
socket.on("location",(url)=>{
    console.log(url)
    const html=Mustache.render(loctemplate,{
        name:name,
        url:url,
        createdAT:moment(url.createdAT).format('h:mm a')
    })
    mss.insertAdjacentHTML("beforeend",html)
    autoscroll()
})
send.addEventListener('submit',(e)=>{
   e.preventDefault()
  button.setAttribute('disabled','disabled')
   const message=document.querySelector('input').value
   socket.emit("Sendmessage",message,(err)=>{
       button.removeAttribute('disabled')
       input.value=''
       input.focus()
      if(err){
          return console.log(err)
      }
      console.log("Message Delivered")
   })
})

document.querySelector("#share").addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("Loacation cannot be shared via this browser")
    }

    navigator.geolocation.getCurrentPosition((pos)=>{
            socket.emit("sendloc",{
                latitude:pos.coords.latitude,
                longitude:pos.coords.longitude
            },(msg)=>{
                console.log("Location Shared"+" "+msg)
            })
    })
})
socket.emit("join",{name,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})

socket.on("roomdata",({room, users})=>{
const html=Mustache.render(userlist,{
    room,
    users
})
document.querySelector("#sidebar").innerHTML=html
})