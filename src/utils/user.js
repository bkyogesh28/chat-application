const user=[]
const details=({id,name,room})=>{
        name=name.trim()
        room=room.trim()
        if(!name || !room){
            return{
                error:"The username or room details must be entered"
            }
        }
        const existuser=user.find((user)=>{
            return user.room===room && user.name===name
        })
      if(existuser){
          return{
              error:"The user already exists"
          }
        }

        const usedetails=({id,name,room})
        user.push(usedetails)
        return{usedetails}
    
}
const getuser=(id)=>{
    return user.find((us)=>us.id===id)
}
const getroomusers=(room)=>{
    return user.filter((us)=>us.room===room)
}
const removeuser=(id)=>{
    const index=user.findIndex((user)=>user.id===id)
    if(index!==-1){
        return user.splice(index,1)[0]
    }
}
module.exports={
    details,
    getroomusers,
    removeuser,
    getuser
}