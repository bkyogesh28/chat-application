const genmessage=(tweets,name)=>{
        return{
            name,
            tweets,
            createdAt:new Date().getTime()
        }
}

const locationtime=(url,name)=>{
    return{
        name,
        url,
        createdAt:new Date().getTime()
    }
}
module.exports={
    genmessage,
    locationtime
}