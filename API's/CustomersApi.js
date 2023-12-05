//Create mini express application (Router)
let exp=require("express")
let customersApp=exp.Router()
//Import express-async-handler
let expressAsyncHandler=require('express-async-handler')
//Import bcryptjs
let bcryptjs=require('bcryptjs')
//Import JWT token
let jwt=require('jsonwebtoken')
//Import multerObject
let multerObj=require('./middlewares/CloudinaryConfig') 
//Body parser middleware
customersApp.use(exp.json())//exp.json() is a built in middleware which executes for every request and recieves body of the request object and parses it
//Customer SignUp
customersApp.post("/sign-up",multerObj.single('Photo'),expressAsyncHandler(async(req,res)=>{
    //Check whether uploaded file is in correct format or not
    if(req.file===undefined)
        res.status(200).send({message:'* Select only jpeg/jpg/png file'})
    else{
        //Get customersCollectionObj
        const customersCollectionObj=req.app.get("customersCollectionObj")
        //Get new user from request
        const newCustomer=JSON.parse(req.body.User)
        //Check for duplicate user
        let DbUser=await customersCollectionObj.findOne({Username:newCustomer.Username})
        //If the username already exists
        if(DbUser!==null){
            res.status(200).send({message:"* Username already exists...Create another"})
        }
        else{
            //Add CDN link of Cloudinary image to newCustomer object
            newCustomer.Image=req.file.path
            //Hash the password        
            let hashedPassword=await bcryptjs.hash(newCustomer.Password, 5)//(2nd arg is salt variable which hashes the password some specified number of times)
            //Replace the plain password with hashed password
            newCustomer.Password=hashedPassword
            //Insert new user
            await customersCollectionObj.insertOne(newCustomer)
            //Send response
            res.status(201).send({message:"User Created"})
        }
    }
}))
//Customer Login
customersApp.post("/login",expressAsyncHandler(async(req,res)=>{
    //Get customersCollectionObj
    const customersCollectionObj=req.app.get("customersCollectionObj")
    //Get user credentials from request
    const customerCredentialsObj=req.body
    //Verify username
    let DbUser=await customersCollectionObj.findOne({Username:customerCredentialsObj.Username})
    //If username is Invalid
    if(DbUser===null)
        res.status(200).send({message:"Username not found"})
    //If username is valid
    else{
        //Verify password
        let isEqual=await bcryptjs.compare(customerCredentialsObj.Password,DbUser.Password)
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
//Update customer profile
customersApp.put('/update-profile/:username',expressAsyncHandler(async(req,res)=>{
    //Get customersCollectionObj
    const customersCollectionObj=req.app.get("customersCollectionObj")
    //Get username from url
    let usernameToBeModified=req.params.username
    //Get modified user object from request
    let modifiedCustomerObj=req.body
    //Check if the username already exists or not
    let existingCustomer=await customersCollectionObj.findOne({Username:modifiedCustomerObj.Username})
    if(existingCustomer!==null && modifiedCustomerObj.Username!==usernameToBeModified)
        res.status(200).send({message:'* Username already exists'})
    else{
        //If password is '' update username and email only
        if(modifiedCustomerObj.Password===''){
            let updatedUser=await customersCollectionObj.updateOne(
                {
                    Username:usernameToBeModified
                },
                {
                    $set:{
                            Username:modifiedCustomerObj.Username,
                            Email:modifiedCustomerObj.Email
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
            let hashedPassword=await bcryptjs.hash(modifiedCustomerObj.Password, 5)
            //Replace plain password with hashed password
            modifiedCustomerObj.Password=hashedPassword
            //Update modified user
            let updatedUser=await customersCollectionObj.updateOne(
                {
                    Username:usernameToBeModified
                },
                {
                    $set:{
                            Username:modifiedCustomerObj.Username,
                            Password:modifiedCustomerObj.Password,
                            Email:modifiedCustomerObj.Email
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
//Update customer profile-image
customersApp.put('/update-profile-image/:username',multerObj.single('Updated-Customer-Photo'),expressAsyncHandler(async(req,res)=>{
    //Check whether uploaded file is in correct format or not
    if(req.file===undefined)
        res.status(200).send({message:'Select only jpeg/jpg/png file'})
    else{
        //Get customersCollectionObj
        const customersCollectionObj=req.app.get("customersCollectionObj")
        //Get username from url
        let usernameOfProfileToBeModified=req.params.username
        //Get CDN link of image and update it
        let imageUpdation=await customersCollectionObj.updateOne(
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
//Add or Modify customer address
customersApp.put('/modify-address/:username',expressAsyncHandler(async(req,res)=>{
    //Get customersCollectionObj
    const customersCollectionObj=req.app.get("customersCollectionObj")
    //Get username from url
    let username=req.params.username
    //Get modified address object from request
    let modifiedAddressObj=req.body
    //Update address
    let addressUpdation=await customersCollectionObj.updateOne(
        {
            Username:username
        },
        {
            $set:{Address:modifiedAddressObj}
        }
    )
    if(addressUpdation.acknowledged===true)
        res.status(201).send({message:'Address updation successfull'})
    else
        res.status(200).send({message:'Address updation unsuccessful'})
}))
//Payment gateway
customersApp.post('/payment-session', expressAsyncHandler(async(req,res)=>{
    const {price, quantity} = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card','upi'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Your Product',
            },
            unit_amount: price // Convert price to cents
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success', // Redirect to success page
      cancel_url: 'http://localhost:3000/cancel', // Redirect to cancel page
    })
    res.json({ id: session.id });
}))
  
module.exports=customersApp