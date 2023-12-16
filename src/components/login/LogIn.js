import React, {useState} from 'react'
import './LogIn.css'
import {useForm} from 'react-hook-form'
import {loginContext} from '../contexts/LoginContext'
import {useNavigate} from 'react-router-dom'
import {useEffect,useContext} from 'react'
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import {RotatingLines} from 'react-loader-spinner'

function LogIn() {
  let [showPassword,setShowPassword]=useState(false)
  let {register,handleSubmit,formState:{errors}}=useForm()
  let navigate=useNavigate()
  let [currentUser,logInError,userLogInStatus,logInUser,,]=useContext(loginContext)
  let [isLoading,setIsLoading]=useState(false)
  let formSubmit=async(userObj)=>{
    setIsLoading(true)
    await logInUser(userObj)
    setIsLoading(false)
  }
  useEffect(()=>{
    if(userLogInStatus===true){
      navigate(`/${currentUser.Type}-dashboard`)
    }
  },[userLogInStatus])
  return (
    <div className='user-login container rounded pt-3 mt-5 mb-5'>
      <h1 className='text-center mt-2 fs-4 fw-semibold'>Already have an account...Let's login...</h1>
      {logInError.length!==0 && <p className='text-danger fs-4 pt-2 pb-2 text-center'>{logInError}</p>}
      <div className='row mt-5'>
        <div className='col-11 col-sm-8 col-md-5 mx-auto'>
          <form onSubmit={handleSubmit(formSubmit)} >
            <div className='mb-4 form-floating'>
              <input
                type='text'
                className='form-control'
                placeholder='Username'
                id='username'
                {...register("Username",{required:'* Username Required'})}
              />
              <label htmlFor='username'>Username</label>
              {errors.Username?.type==='required' && <p className='text-danger fw-semibold errors'>{errors.Username.message}</p>}
            </div>
            <div className='input-group form-floating'>
              <input
                type={showPassword ? "text":"password"}
                className='form-control'
                placeholder='Password'
                id='password'
                {...register("Password",{required:'* Password Required'})}
              />
              <a onClick={()=>setShowPassword(!showPassword)} className='input-group-text rounded-end text-dark fs-5'>{showPassword?<AiFillEyeInvisible/>:<AiFillEye/>}</a>
              <label htmlFor='password'>Password</label>
            </div>
            {errors.Password?.type==='required' && <p className='text-danger fw-semibold errors'>{errors.Password.message}</p>}
            <div>
              <div className='form-check mt-4'>
                <input type='radio' className='form-check-input' id='farmer' value="farmer" {...register("Type",{required:true})}/>
                <label htmlFor='farmer' className='form-check-label mb-3'>Farmer</label>
              </div>
              <div className='form-check'>
                <input type='radio' className='form-check-input' id='customer' value="customer" {...register("Type",{required:true})}/>
                <label htmlFor='customer' className='form-check-label mb-3'>Customer</label>
              </div>
              {errors.Type?.type==='required' && <p className='text-danger fw-semibold errors'>* Select user type</p>}
            </div>
            <button type='submit' className='d-flex m-auto btn btn-danger mb-5' disabled={isLoading}>
              LogIn  {isLoading && <RotatingLines height={25} width={25} strokeColor="white" strokeWidth="5"/>}
            </button>
          </form>
        </div>
      </div>
      
    </div>
  )
}

export default LogIn