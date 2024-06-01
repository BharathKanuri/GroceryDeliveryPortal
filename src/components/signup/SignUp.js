import React from 'react'
import './SignUp.css'
import {validateUsername,validatePassword,validateEmail} from '../ValidateForm'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import axios from 'axios' 
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import {RotatingLines} from 'react-loader-spinner'

function SignUp(){
  let [err,setErr]=useState("")
  let {register,handleSubmit,setError,formState:{errors}}=useForm()
  let navigate=useNavigate()
  let [selectedFile,setSelectedFile]=useState(null)
  let [showPassword,setShowPassword]=useState(false)
  let [isLoading,setIsLoading]=useState(false)
  let onFileSelect=(eventObj)=>{
    setSelectedFile(eventObj.target.files[0])
  }
  let formSubmit=async(userObj)=>{
    if(validateUsername(userObj,setError) || validatePassword(userObj,setError) || validateEmail(userObj,setError))
      return
    else{
      setIsLoading(true)
      //FormData object wraps data object on form submission and selected file
      let formData=new FormData()
      formData.append("User",JSON.stringify(userObj))//object parsed to string
      formData.append('Photo',selectedFile)//binary large object(blob)
      await axios.post(`http://localhost:3500/${userObj.Type}s-api/sign-up`,formData)
      .then(responseObj=>{
        setIsLoading(false)
          if(responseObj.status===201){
            setErr("")
            navigate("/login")
          }
          else if(responseObj.status===200){
            if(responseObj.data.message==='* Select only jpeg/jpg/png file')
              setError("Image",{message:responseObj.data.message,type:'required'})
            else
              setError('Username',{message:responseObj.data.message,type:'required'})
          }
        })
      .catch(err=>{
        setIsLoading(false)
        if(err.response)
          setErr("Invalid URL request...")
        else if(err.request)
          setErr("Check your network connection...")
        else
          setErr("Oops!!! Something went wrong...")
      })
    }
  }
  return(
    <div className='user-signup'>
      <h1 className='text-center pt-4 fs-4 fw-semibold'>Don't have an account... Let's create one...</h1>
      {err?.length!=0 && <p className='text-danger fs-4 pb-2 pt-2 text-center'>{err}</p>}
      <div className='row mt-5'>
        <div className='col-11 col-sm-8 col-md-8 col-lg-5 mx-auto'>
          <form onSubmit={handleSubmit(formSubmit)} >
            <div className='mb-4 form-floating'>
              <input
                type='text'
                className='form-control'
                placeholder='Username'
                id='username'
                {...register("Username",{required:'* Username required'})}
              />
              <label htmlFor='username'>Username</label>
              {errors.Username?.type==='required' && <p className='text-danger fw-semibold errors'>{errors.Username.message}</p>}
            </div>
            <div className='input-group form-floating'>
              <input
                  type={showPassword ? "text":"password"}
                  id='password'
                  placeholder='Password'
                  className='form-control'
                  {...register("Password",{required:'* Password required'})}
              />
              <a onClick={()=>{setShowPassword(!showPassword)}} className='input-group-text rounded-end text-dark fs-5'>{showPassword?<AiFillEyeInvisible/>:<AiFillEye/>}</a>
              <label htmlFor='password'>Password&nbsp;&nbsp;&nbsp;(a-z, A-Z, 0-9, (_@#$%))</label>
            </div>
              {errors.Password?.type==='required' && <p className='text-danger fw-semibold errors'>{errors.Password.message}</p>}
            <div className='form-floating mt-4'>
              <input
                type='email'
                className='form-control'
                id='email'
                placeholder='email'
                {...register("Email",{required:'* Email required'})}
              />
              <label htmlFor='email'>Email&nbsp;&nbsp;&nbsp;(ex :- jimmy.carter@gmail.com)</label>
              {errors.Email?.type==='required'&&<p className='text-danger fw-semibold errors'>{errors.Email.message}</p>}
            </div>
            <div>
              <select
                  className='form-select mt-4'
                  {...register("Type",{required:true})}
              >
                  <option value=''>--Select User Type--</option>
                  <option value="customer">Customer</option>
                  <option value="farmer">Farmer</option>
              </select>
            </div>
            {errors.Type?.type==='required' && <p className='text-danger fw-semibold mb-4 errors'>* Select user type</p>}
            <div className='mt-4 mb-4 form-floating'>
              <input
                type='file'
                className='form-control'
                id='img'
                {...register("Image",{required:'* No file selected'})}
                onInput={onFileSelect}
              />
              <label htmlFor='img'>Upload Cover Photo (jpeg/jpg/png)</label>
              {errors.Image?.type==='required' && <p className='text-danger fw-semibold errors'>{errors.Image.message}</p>}
            </div>
            <button type='submit' className='d-flex m-auto btn btn-success mb-5' disabled={isLoading}>
              Register {isLoading && <RotatingLines height={25} width={25} strokeColor="white" strokeWidth="5"/>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp