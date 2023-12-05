//Create mini express application (Router)
let exp=require("express")
let farmersApp=exp.Router()
//Import express-async-handler
let expressAsyncHandler=require('express-async-handler')
//Import bcryptjs
let bcryptjs=require('bcryptjs')
//Import JWT token
let jwt=require('jsonwebtoken')
//Import multerObject
let multerObj=require('./middlewares/CloudinaryConfig') 
//Body parser middleware
farmersApp.use(exp.json())//exp.json() is a built in middleware which executes for every request and recieves body of the request object and parses it
//Farmer SignUp
farmersApp.post("/sign-up",multerObj.single('Photo'),expressAsyncHandler(async(req,res)=>{
    //Check whether uploaded file is in correct format or not
    if(req.file===undefined)
        res.status(200).send({message:'* Select only jpeg/jpg/png file'})
    else{
        //Get farmersCollectionObj
        const farmersCollectionObj=req.app.get("farmersCollectionObj")
        //Get new user from request
        const newFarmer=JSON.parse(req.body.User)
        //Check for duplicate user
        let DbUser=await farmersCollectionObj.findOne({Username:newFarmer.Username})
        //If the username already exists
        if(DbUser!==null){
            res.status(200).send({message:"* Username already exists...Create another"})
        }
        else{
            //Add CDN link of Cloudinary image to newFarmer object
            newFarmer.Image=req.file.path
            //Hash the password
            let hashedPassword=await bcryptjs.hash(newFarmer.Password, 5)//(2nd arg is salt variable which hashes the password some specified number of times)
            //Replace the plain password with hashed password
            newFarmer.Password=hashedPassword
            //Insert new user
            await farmersCollectionObj.insertOne(newFarmer)
            //Send response
            res.status(201).send({message:"User Created"})
        }
    }
}))
//User Login
farmersApp.post("/login",expressAsyncHandler(async(req,res)=>{
    //Get farmersCollectionObj
    const farmersCollectionObj=req.app.get("farmersCollectionObj")
    //Get user credentials from request
    const farmerCredentialsObj=req.body
    //Verify username
    let DbUser=await farmersCollectionObj.findOne({Username:farmerCredentialsObj.Username})
    //If username is Invalid
    if(DbUser===null)
        res.status(200).send({message:"Username not found"})
    //If username is valid
    else{
        //Verify password
        let isEqual=await bcryptjs.compare(farmerCredentialsObj.Password,DbUser.Password)
        //If password doesn't match
        if(isEqual===false)
            res.status(200).send({message:"Invalid password"})
        //If password matches
        else{
            //Create JWT token (JSON Web Token)
            let jwtToken=jwt.sign({Username:DbUser.Username},"username",{expiresIn:60})//20 - ms, "2 days"|"2d" - days, "2h" - hours
            delete DbUser.Password
            res.status(201).send({message:"Login Success",token:jwtToken,user:DbUser})
        }
    }
}))
//Update farmer profile
farmersApp.put('/update-profile/:username',expressAsyncHandler(async(req,res)=>{
    //Get farmersCollectionObj
    const farmersCollectionObj=req.app.get("farmersCollectionObj")
    //Get username from url
    let usernameToBeModified=req.params.username
    //Get modified user object from request
    let modifiedFarmerObj=req.body
    //Check if the username already exists or not
    let existingFarmer=await farmersCollectionObj.findOne({Username:modifiedFarmerObj.Username})
    if(existingFarmer!==null && modifiedFarmerObj.Username!==usernameToBeModified)
        res.status(200).send({message:'* Username already exists'})
    else{
        //If password is '' update username and email only
        if(modifiedFarmerObj.Password===''){
            let updatedUser=await farmersCollectionObj.updateOne(
                {
                    Username:usernameToBeModified
                },
                {
                    $set:{
                            Username:modifiedFarmerObj.Username,
                            Email:modifiedFarmerObj.Email
                        }
                }
            )
            if(updatedUser.acknowledged===true)
                res.status(201).send({message:'Profile updated'})
            else
                res.status(200).send({message:'Profile updation unsuccessful'})
        }
        //If password!='' update username, password, email
        else{
            //Hash the password
            let hashedPassword=await bcryptjs.hash(modifiedFarmerObj.Password, 5)
            //Replace plain password with hashed password
            modifiedFarmerObj.Password=hashedPassword
            //Update modified user
            let updatedUser=await farmersCollectionObj.updateOne(
                {
                    Username:usernameToBeModified
                },
                {
                    $set:{
                            Username:modifiedFarmerObj.Username,
                            Password:modifiedFarmerObj.Password,
                            Email:modifiedFarmerObj.Email
                        }
                }
            )
            if(updatedUser.acknowledged===true)
                res.status(201).send({message:'Profile Updated'})
            else
                res.status(200).send({message:'Profile updation unsuccessful'})
        }
    }
}))
//Update farmer profile-image
farmersApp.put('/update-profile-image/:username',multerObj.single('Updated-Farmer-Photo'),expressAsyncHandler(async(req,res)=>{
    //Check whether uploaded file is in correct format or not
    if(req.file===undefined)
        res.status(200).send({message:'Select only jpeg/jpg/png file'})
    else{
        //Get farmersCollectionObj
        const farmersCollectionObj=req.app.get("farmersCollectionObj")
        //Get username from url
        let usernameOfProfileToBeModified=req.params.username
        let imageUpdation//Get CDN link of image and update it
        await farmersCollectionObj.updateOne(
            {
                Username:usernameOfProfileToBeModified
            },
            {
                $set:{Image:req.file.path}
            }
        )
        if(imageUpdation.acknowledged===true)
            res.status(201).send({message:'Profile image updated successfully',image:req.file.path})
        else
            res.status(200).send({message:'Profile image updation unsuccessful'})
    }
}))
//Add Product
farmersApp.put('/add-product/:username',multerObj.array("Images"),expressAsyncHandler(async(req,res)=>{
    //Get farmersCollectionObj
    const farmersCollectionObj=req.app.get("farmersCollectionObj")
    //Get username from url
    let productOwner=req.params.username
    //Get CDN links array of images
    let productImages=req.files.map((fileListObj)=>fileListObj.path)
    //Check whether uploaded files are in correct format or not
    if(productImages.length===0 || req.statusMessage==='Invalid file format')
        res.status(200).send({message:'* Select only jpeg/jpg/png files'})
    else{
        //Add product images to product object
        const productObj=JSON.parse(req.body.Product)
        //Add CDN links of Cloudinary images to product object
        productObj.Images=productImages
        //Enforce timestamp as unique key to each object
        let key=Date.now().toString()
        productObj.Key=key
        //Add product object to existing farmer document
        await farmersCollectionObj.updateOne(
            {
                Username:productOwner
            },
            {
                $set:{[`Products.${key}`]:productObj}
            }
        )
        res.status(201).send({message:'Product added'})
    }
}))
//Get Products by farmer username
farmersApp.get('/get-products/:username',expressAsyncHandler(async(req,res)=>{
    //Get farmersCollectionObj
    const farmersCollectionObj=req.app.get("farmersCollectionObj")
    //Get username from url
    let productOwner=req.params.username
    //Get products of farmer by username
    let DbUser=await farmersCollectionObj.findOne({Username:productOwner})
    //Check for products
    if(DbUser.Products===undefined || Object.keys(DbUser.Products).length===0)
        res.status(200).send({message:'No products found'})
    else
        res.status(201).send({message:DbUser.Products})
}))
//Edit Product
farmersApp.put('/edit-product/:username',expressAsyncHandler(async(req,res)=>{
    //Get farmersCollectionObj
    const farmersCollectionObj=req.app.get("farmersCollectionObj")
    //Get username from url
    let productOwner=req.params.username
    //Get modified product object from request
    let modifiedProductObj=req.body
    let key=modifiedProductObj.Key
    //Update product details according to key
    let resultSet=await farmersCollectionObj.updateMany(
        {   
            Username:productOwner,
            [`Products.${key}.Key`]:key
        },
        {
            $set:{[`Products.${key}`]:modifiedProductObj}
        }
    )
    if(resultSet.acknowledged===true)
        res.status(201).send({message:'Product details updated'})
    else
        res.status(200).send({message:'Update unsuccessful'})
}))
//Delete Product
farmersApp.delete('/delete-product/resource',expressAsyncHandler(async(req,res)=>{
    //Get farmersCollectionObj
    const farmersCollectionObj=req.app.get("farmersCollectionObj")
    //Get username, key from url
    let productOwner=req.query.username
    let key=req.query.key
    //Delete product according to key
    let resultSet=await farmersCollectionObj.updateMany(
        {   
            Username:productOwner,
            [`Products.${key}.Key`]:key
        },
        {
            $unset:{[`Products.${key}`]:''}
        }
    )
    if(resultSet.acknowledged===true)
        res.status(201).send({message:'Product deleted'})
    else
        res.status(200).send({message:'Delete unsuccessful'})
}))
//Get all Products
farmersApp.get('/get-all-products',expressAsyncHandler(async(req,res)=>{
    //Get farmersCollectionObj
    const farmersCollectionObj=req.app.get("farmersCollectionObj")
    //Get products of all farmers
    let resultSet=await farmersCollectionObj.find({},{projection:{_id:0,"Username":1,[`Products`]:1}}).toArray()
    if(resultSet.length===0)
        res.status(200).send({message:'Products are unavailable currently'})
    else
        res.status(201).send({message:resultSet})
}))
module.exports=farmersApp