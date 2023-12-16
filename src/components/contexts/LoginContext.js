import {createContext,useState} from "react"
import axios from 'axios'

export const loginContext=createContext({})
function LoginContext({children}){
    let [currentUser,setCurrentUser]=useState({})
    let [logInError,setLoginError]=useState("")
    let [userLogInStatus,setUserLogInStatus]=useState(false)
    let logInUser=async(userCredentialsObj)=>{
        await axios.post(`http://localhost:3500/${userCredentialsObj.Type}s-api/login`,userCredentialsObj)
        .then(res=>{
            if(res.data.message==='Login Success'){
                setCurrentUser({...res.data.user})
                setLoginError("")
                setUserLogInStatus(true)
                //Save token to local storage/session storage
                //local storage stores (key-value) pair until the page is reloaded
                //session storage stores (key-value) pair until the url is changed
                sessionStorage.setItem("token",res.data.token)
            }
            else if(res.status===200)
                setLoginError(res.data.message)
        })
        .catch(err=>{
            if(err.response)
                setLoginError("Invalid URL request...")
            else if(err.request)
                setLoginError("Check your network connection...")
            else
                setLoginError("Oops!!! Something went wrong...")
        })
    }
    let logOutUser=()=>{
        sessionStorage.clear("token")
        setUserLogInStatus(false)
    }
    return (
        <loginContext.Provider value={[currentUser,logInError,userLogInStatus,logInUser,logOutUser,setLoginError]}>
            {children}
        </loginContext.Provider>    
    )
}

export default LoginContext