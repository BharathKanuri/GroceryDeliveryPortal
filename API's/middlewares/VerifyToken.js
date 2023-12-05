const jwt=require('jsonwebtoken')
const verifyToken=(req,res,next)=>{
    //Bearer token
    const bearerToken=req.headers.authorization
    //If bearer token not found
    if(bearerToken==undefined)
        res.send({message:"Unauthorized access...please login again"})
    //If bearer token is existed
    else{
        //Get the token from bearerToken
        const token=bearerToken.split(' ')[1]//["Bearer","token"]
        //Verify token
        try{
            jwt.verify(token,"username")
            next()
        }
        catch(err){
            //Forward error message to errorHandlingMiddleware
            next(new Error("Session expired!!! Please login again..."))
        }
    }
}
module.exports=verifyToken