import './CustomerDashboard.css'
import axios from 'axios'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useNavigate,Outlet} from 'react-router-dom'
import {useContext,useEffect,useState} from 'react'
import {loginContext} from '../contexts/LoginContext'
import {Offcanvas,Modal,Button} from 'react-bootstrap';
import {MdEditCalendar} from 'react-icons/md'
import {useForm} from 'react-hook-form'
import {IoSave} from 'react-icons/io5'
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import {TbLogout} from 'react-icons/tb'
import {FcEditImage} from 'react-icons/fc'
import {RiUserSettingsLine} from 'react-icons/ri'
import {RotatingLines} from 'react-loader-spinner'
import {BiSolidPurchaseTag} from "react-icons/bi"

function CustomerDashboard(){
  let navigate=useNavigate()
  let [currentUser,,userLogInStatus,,logOutUser]=useContext(loginContext)
  let [showOffcanvas,setShowOffcanvas]=useState(false);
  let [profileImage,setProfileImage]=useState(currentUser.Image)
  let {register,formState:{errors},setError,setValue,getValues}=useForm()
  let [showUpdateUserForm,setShowUpdateUserForm]=useState(false)
  let [showPassword,setShowPassword]=useState(false)
  let [displayText,setDisplayText]=useState(false)
  let [isLoading,setIsLoading]=useState(false)
  let toastConfig={
    position: "top-center",
    autoClose: 7500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    style:{width:'325px'}
  }
  let handleCatch=(error)=>{
    if(error.response)
      toast.error('Invalid URL Request', toastConfig);
    else if(error.request)
      toast.warning('Check your network connection', toastConfig);
    else
      toast.error('Oops!!! Something Went Wrong', toastConfig);
  }
  useEffect(()=>{
    if(userLogInStatus===false){
      logOutUser()
      navigate('/login')
    }
  },[userLogInStatus])
  let openOffcanvas=()=>setShowOffcanvas(true);
  let openModal=(x)=>{
    if(x===1)
      setShowUpdateUserForm(true)
  }
  let closeOffcanvas=()=>setShowOffcanvas(false);
  let closeModal=(x)=>{
    if(x===1){
      setValue('Username')
      setValue('Password')
      setValue('Email')
      setError('Username')
      setError('Password')
      setError('Email')
      setShowUpdateUserForm(false)
    }
  }
  let validateUsername=(modifiedCustomer)=>{
    if(modifiedCustomer.Username.length<10){
      setError("Username",{type:"required",message:'* Min length should be 10'})
      return true
    }
    else if(modifiedCustomer.Username.length>20){
      setError("Username",{type:"required",message:'* Max length should be 20'})
      return true
    }
    else if(modifiedCustomer.Username.split(' ').length>1){
      setError("Username",{type:"required",message:'* No white spaces are allowed'})
      return true
    }
    return false
  }
  let validatePassword=(modifiedCustomer)=>{
    if(modifiedCustomer.Password!==''){
      if(modifiedCustomer.Password.length<10){
        setError("Password",{type:"required",message:'* Min length should be 10'})
        return true
      }
      else if(modifiedCustomer.Password.length>20){
        setError("Password",{type:"required",message:'* Max length should be 20'})
        return true
      }
      else{
        let digit=0,lowerAlpha=0,capitalAlpha=0,specialChar=0
        let s=modifiedCustomer.Password
        for(let i=0;i<s.length;i++){
          let c=s.charAt(i)
          if(c>='0' && c<='9')
            digit=1
          else if(c>='a' && c<='z')
            lowerAlpha=1
          else if (c>='A' && c<='Z')
            capitalAlpha=1
          else if((c>=' ' && c<='/') || (c>=':' && c<='@') || (c>='[' && c<='`') || (c>='{' && c<='~'))
            specialChar=1
          else
            break
        }
        if(!digit){
          setError("Password",{type:'required',message:'* Password must contain a digit [0-9]'})
          return true
        }
        else if(!lowerAlpha){
          setError("Password",{type:'required',message:'* Password must contain a lowercase letter [a-z]'})
          return true
        }
        else if(!capitalAlpha){
          setError("Password",{type:'required',message:'* Password must contain an uppercase letter [A-Z]'})
          return true
        }
        else if(!specialChar){
          setError("Password",{type:'required',message:'* Password must contain a special character [!@#$_]'})
          return true
        }
      }
      return false
    }
    return false
  }
  let validateEmail=(modifiedCustomer)=>{
    if(modifiedCustomer.Email.length===0){
      setError("Email",{type:"required",message:"* Email required"})
      return true
    }
    else if(modifiedCustomer.Email.search('@')===-1){
      setError("Email",{type:"required",message:"* Enter valid email"})
      return true
    }
    return false
  }
  let editUser=()=>{
    openModal(1)
    setValue("Username",currentUser.Username)
    setValue("Password",'')
    setValue("Email",currentUser.Email)
  }
  let saveUser=()=>{
    let modifiedCustomer=getValues()
    setError('Username')
    setError('Password')
    setError('Email')
    if(validateUsername(modifiedCustomer) || validatePassword(modifiedCustomer) || validateEmail(modifiedCustomer))
        return
    else{
      setIsLoading(true)
      axios.put(`http://localhost:3500/customers-api/update-profile/${currentUser.Username}`,modifiedCustomer)
      .then(responseObj=>{
        setIsLoading(false)
        if(responseObj.data.message==='Profile updated'){
          console.log(responseObj.data.message)
          alert("User credentials updated successfully...\nLogin action required!!!")
          logOutUser()
        }
        else if(responseObj.data.message==='* Username already exists')
          setError('Username',{type:'required',message:responseObj.data.message})
        else if(responseObj.data.message==='Profile updation unsuccessful')
          toast.error('Profile updation unsuccessful', toastConfig)
      })
      .catch(err=>{
        setIsLoading(false)
        handleCatch(err)
      })
    }
  }
  let onFileSelect=(eventObj)=>{
    let formData=new FormData()
    formData.append('Updated-Customer-Photo',eventObj.target.files[0])
    axios.put(`http://localhost:3500/customers-api/update-profile-image/${currentUser.Username}`,formData)
    .then(responseObj=>{
      if(responseObj.data.message==='Profile image updated successfully'){
        toast.success(responseObj.data.message, toastConfig)
        setProfileImage(responseObj.data.image)
      }
      else if(responseObj.data.message==='Profile image updation unsuccessful')
        toast.error(responseObj.data.message, toastConfig)
      else if(responseObj.data.message==='Select only jpeg/jpg/png file')
        toast.warning(responseObj.data.message, toastConfig)
    })
    .catch(err=>handleCatch(err))
  }
  return (
    <div className='customerdb'>
      <Button className='mt-3 mx-3' variant='dark'  onClick={openOffcanvas}>
        <RiUserSettingsLine className='fs-4 fw-bold'/>
      </Button>
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" style={{minWidth:'40px',minHeight:'40px'}} className='mt-3 cartIcon' onClick={()=>navigate('shop')}><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z"/></svg>
      <BiSolidPurchaseTag className='mt-3 mx-3 purchaseTag' style={{minWidth:'40px',minHeight:'40px'}} onClick={()=>navigate('orders')}/>
      <h2 className='text-center text-danger' style={{position:'absolute',left:'600px',top:'100px',fontWeight:'bold'}}>In Customers We Believe</h2>
      <div>
        <Offcanvas show={showOffcanvas} onHide={closeOffcanvas} style={{background:'#FFCC70'}}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>User Settings</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className='text-center'>
            <input
                id='file-input'
                type='file'
                onInput={onFileSelect}
            />
            <h4 className='text-danger'>PROFILE <label htmlFor='file-input' id='file-input-label' className='editIcon mx-2' style={{cursor:'pointer'}} onMouseEnter={()=>{setDisplayText(true)}} onMouseLeave={()=>{setDisplayText(false)}}><FcEditImage className='fw-bold fs-3 mb-1'/></label></h4>
            {displayText&&<h6 className='bg-dark text-info pt-1 pb-1 w-25' style={{fontSize:'11px',position:'absolute',left:'264px',top:'110px'}}>Edit Cover Photo</h6>}
            <h3 className='mt-4 text-center profile-image '><img src={profileImage} className='mb-3 rounded userImg' alt="Image Not Found"></img></h3>
            <div className='text-center fw-bold lead'>
              <p className='fs-5' style={{color:'#7c3f00'}}>Username : {currentUser.Username}</p>
              <p className='fs-5' style={{color:'#7c3f00'}}>User Type : {currentUser.Type}</p>
            </div>
            <button className='btn btn-dark fs-5 pt-1 pb-1 fw-semibold text-light' onClick={editUser} style={{opacity:1}}>Edit <span><MdEditCalendar className='mb-1'/></span></button>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
      <div className='rightContent'>
        <h3 className='text-danger fw-bold'><img src={profileImage} className='profile-image rounded displayImg' alt='Image Not Found'></img></h3>
        <button onClick={logOutUser} className='float-end btn btn-info text-light fw-bold logoutButton me-3 p-1 px-2'>LogOut<span><TbLogout className='mx-1 mb-1 fw-bold fs-5'/></span></button>
      </div>
      <Modal 
        show={showUpdateUserForm} 
        onHide={()=>closeModal(1)} 
        backdrop="static" 
        centered 
      >{/*backdrop property ensures the modal to be closed on occurance of particular event (ex :- onClick event of button)*/}
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className='pb-0 mt-2'>
        <form>
            <div className='mb-4 form-floating'>
              <input
                type='text'
                className='form-control'
                placeholder='Username'
                id='username'
                {...register("Username")}
              />
              <label htmlFor='username'>Username</label>
              {errors.Username?.type==='required' && <p className='text-danger fw-semibold errors'>{errors.Username.message}</p>}
            </div>
            <div className='mt-4 form-floating input-group'>
              <input
                type={showPassword?'text':'password'}
                className='form-control'
                id='password'
                placeholder='Password'
                {...register("Password")}
              />
              <a onClick={()=>{setShowPassword(!showPassword)}} className='input-group-text rounded-end text-dark fs-5'>{showPassword?<AiFillEyeInvisible/>:<AiFillEye/>}</a>
              <label htmlFor='password'>Password (Ignore the field if you don't like to change)</label>
            </div>
            {errors.Password?.type==='required' && <p className='text-danger fw-semibold errors'>{errors.Password.message}</p>}
            <div className='mb-4 mt-4 form-floating'>
              <input
                type='email'
                className='form-control'
                id='email'
                placeholder='email'
                {...register("Email")}
              />
              <label htmlFor='email'>Email</label>
              {errors.Email?.type==='required'&&<p className='text-danger fw-semibold errors'>{errors.Email.message}</p>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>closeModal(1)}>Close</Button>
          <Button className='mt-1' onClick={saveUser} disabled={isLoading}>
            Save
            {
              isLoading===true ? 
                <RotatingLines height={25} width={25} strokeColor="white" strokeWidth="5"/> :
                <span><IoSave className='mx-1 mb-1 fs-5'/></span>
            }
          </Button>
        </Modal.Footer>
      </Modal>
      <div className='mt-5 mb-5 container-fluid float-center pt-5 pb-4' style={{position:'relative',top:'30px'}}>
        <Outlet/>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default CustomerDashboard