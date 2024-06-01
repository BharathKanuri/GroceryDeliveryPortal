export function validateUsername(userObj,setError){
    var usernamePat=/^[a-zA-Z\s_]{6,23}$/
    if(usernamePat.test(userObj.Username)===false){
        setError("Username",{type:"required",message:'* Please enter a valid username [a-zA-Z_ ] of length 6-23'})
        return true
    }
    else{
        setError("Username",'')
        return false
    }
}
export function validatePassword(userObj,setError,f=1){
    var passwordPat=/^(?=.*[@#$%_])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{12,20}$/
    if(passwordPat.test(userObj.Password)===false && f===1){
        setError("Password",{type:"required",message:'* Please enter a valid password (a-z, A-Z, 0-9, (_@#$%)) of length 12-20'})
        return true
    }
    else{
        setError("Password",'')
        return false
    }
}
export function validateEmail(userObj,setError){
    var emailPat=/^[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}$/
    if(emailPat.test(userObj.Email)===false){
        setError('Email',{type:"required",message:'* Please enter a valid email (ex :- jimmy_carter@gmail.com)'})
        return true
    }
    else{
        setError('Email','')
        return false
    }
}