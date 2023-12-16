//Create express app
const exp=require('express')//Module contains function
const app=exp()//returns express object
require('dotenv').config()
//Assign port number
const port=process.env.PORT||4000
app.listen(port,()=>console.log("web server listening at port 3500..."))
const cors = require('cors')
app.use(cors())
//Import farmersApp
let farmersApp=require("./API's/FarmersApi")
//Import customersApp
let customersApp=require("./API's/CustomersApi")
//Connect react build
const path=require('path')
app.use(exp.static(path.join(__dirname,'./build')))
//Get mongo client
let mongoClient=require('mongodb').MongoClient
//Connect mongoDb server to mongoClient
mongoClient.connect("mongodb://127.0.0.1:27017")
.then(dbRef=>{
    //Connect to database
    const dbObj=dbRef.db('MyDb2')
    //Connect to collections of the database
    const farmersCollectionObj=dbObj.collection('farmersCollection')
    const customersCollectionObj=dbObj.collection('customersCollection')
    console.log(`database server listening at port 27017...`)
    //Share collection objects to API's
    app.set('farmersCollectionObj',farmersCollectionObj)//key,value
    app.set('customersCollectionObj',customersCollectionObj)
})
.catch(err=>console.log("Database connection refused - "+err))
//Execute when path is farmers-api
app.use("/farmers-api",farmersApp)
//Execute when the path is customers-api
app.use("/customers-api",customersApp)
//Page Refresh Middleware
const pageRefreshMiddleware=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'./build/index.html'))
}
app.use('*',pageRefreshMiddleware)
//Invalid Path Middleware
const invalidPathMiddleware=(req,res,next)=>{
    res.send({message:`Invalid Path`})
}
app.use(invalidPathMiddleware)
//Error Handling Middleware
const errorHandlingMiddleware=(err,req,res,next)=>{
    res.send({message:err.message})
}
app.use(errorHandlingMiddleware)