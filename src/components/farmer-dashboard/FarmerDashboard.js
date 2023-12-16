import './FarmerDashboard.css'
import axios from 'axios'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useNavigate,Outlet} from 'react-router-dom'
import {useState,useEffect,useContext} from 'react'
import {loginContext} from '../contexts/LoginContext'
import {Offcanvas,Modal,Button} from 'react-bootstrap'
import {MdEditCalendar} from 'react-icons/md'
import {useForm} from 'react-hook-form'
import {IoSave} from 'react-icons/io5'
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import {TbLogout} from 'react-icons/tb'
import {FcEditImage} from 'react-icons/fc'
import {RiUserSettingsLine} from 'react-icons/ri'
import {RotatingLines} from 'react-loader-spinner'
import {GiFruitBowl} from "react-icons/gi"

function FarmerDashboard(){
  let navigate=useNavigate()
  let [currentUser,,userLogInStatus,,logOutUser]=useContext(loginContext)
  let [showOffcanvas,setShowOffcanvas]=useState(false);
  let [profileImage,setProfileImage]=useState(currentUser.Image)
  let {register,handleSubmit,setError,formState:{errors},setValue,getValues}=useForm()
  let [useUpdateUserForm,setUseUpdateUserForm]=useState(false)
  let [showUpdateUserModal,setShowUpdateUserModal]=useState(false)
  let [showPassword,setShowPassword]=useState(false)
  let [useAddProductForm,setUseAddProductForm]=useState(false)
  let [showAddProductModal,setShowAddProductModal]=useState(false)
  let [selectedImages,setSelectedImages]=useState(null)
  let [showProduct,setShowProduct]=useState(false)
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
    if(x===1){
      setUseUpdateUserForm(true)
      setShowUpdateUserModal(true)
    }
    if(x===2){
      setUseAddProductForm(true)
      setShowAddProductModal(true)
    }
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
      setUseUpdateUserForm(false)
      setShowUpdateUserModal(false)
    }
    if(x===2){
      setValue('Name')
      setValue('Quantity')
      setValue('Measurement')
      setValue('Price')
      setValue('Stock')
      setValue('Images')
      setError('Name')
      setError('Quantity')
      setError('Measurement')
      setError('Price')
      setError('Stock')
      setError('Images')
      setUseAddProductForm(false)
      setShowAddProductModal(false)
    }
  }
  let validateUsername=(modifiedFarmer)=>{
    if(modifiedFarmer.Username.length<10){
      setError("Username",{type:"required",message:'* Min length should be 10'})
      return true
    }
    else if(modifiedFarmer.Username.length>20){
      setError("Username",{type:"required",message:'* Max length should be 20'})
      return true
    }
    else if(modifiedFarmer.Username.split(' ').length>1){
      setError("Username",{type:"required",message:'* No white spaces are allowed'})
      return true
    }
    return false
  }
  let validatePassword=(modifiedFarmer)=>{
    if(modifiedFarmer.Password!==''){
      if(modifiedFarmer.Password.length<10){
        setError("Password",{type:"required",message:'* Min length should be 10'})
        return true
      }
      else if(modifiedFarmer.Password.length>20){
        setError("Password",{type:"required",message:'* Max length should be 20'})
        return true
      }
      else{
        let digit=0,lowerAlpha=0,capitalAlpha=0,specialChar=0
        let s=modifiedFarmer.Password
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
  let validateEmail=(modifiedFarmer)=>{
    if(modifiedFarmer.Email.length===0){
      setError("Email",{type:"required",message:"* Email required"})
      return true
    }
    else if(modifiedFarmer.Email.search('@')===-1){
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
    let modifiedFarmer=getValues()
    setError('Username')
    setError('Password')
    setError('Email')
    if(validateUsername(modifiedFarmer) || validatePassword(modifiedFarmer) || validateEmail(modifiedFarmer))
      return
    else{
      setIsLoading(true)
      axios.put(`http://localhost:3500/farmers-api/update-profile/${currentUser.Username}`,modifiedFarmer)
      .then(responseObj=>{
        setIsLoading(false)
        if(responseObj.data.message==='Profile updated'){
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
    formData.append('Updated-Farmer-Photo',eventObj.target.files[0])
    axios.put(`http://localhost:3500/farmers-api/update-profile-image/${currentUser.Username}`,formData)
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
  let onImagesSelect=(eventObj)=>{
    setError("Images")
    setSelectedImages(eventObj.target.files)
  }
  let addProduct=(productObj)=>{
    let formData=new FormData()
    formData.append("Product",JSON.stringify(productObj))
    for(let i=0;i<selectedImages.length;i++){
      formData.append("Images", selectedImages[i]);
    }
    if(productObj.Images.length < 2)
      setError("Images",{message:'* Select atleast 2 images',type:'required'})
    else if(productObj.Images.length > 4)
      setError("Images",{message:'* File limit exceeded',type:'required'})
    else if(useAddProductForm===true){
      setIsLoading(true)
      axios.put(`http://localhost:3500/farmers-api/add-product/${currentUser.Username}`,formData)
      .then(responseObj=>{
        setIsLoading(false)
        if(responseObj.data.message==='Product added'){
          toast.success('Product added to store', toastConfig)
          setShowProduct(!showProduct)
          setValue('Name')
          setValue('Quantity')
          setValue('Measurement')
          setValue('Price')
          setValue('Images')
          setValue('Stock')
        }
        else if(responseObj.data.message==='* Select only jpeg/jpg/png files')
          setError("Images",{message:responseObj.data.message,type:'required'})
      })
      .catch(err=>{
        setIsLoading(false)
        handleCatch(err)
      })
    }
  }
  return (
    <div className='farmerdb'>
      <Button className='mt-3 mx-3' variant='dark' onClick={openOffcanvas}>
        <RiUserSettingsLine className='fs-4 fw-bold'/>
      </Button>
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" style={{minWidth:'40px',minHeight:'40px'}} onClick={()=>openModal(2)} className='box mt-3'><path d="M256 48c0-26.5 21.5-48 48-48H592c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H381.3c1.8-5 2.7-10.4 2.7-16V253.3c18.6-6.6 32-24.4 32-45.3V176c0-26.5-21.5-48-48-48H256V48zM571.3 347.3c6.2-6.2 6.2-16.4 0-22.6l-64-64c-6.2-6.2-16.4-6.2-22.6 0l-64 64c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L480 310.6V432c0 8.8 7.2 16 16 16s16-7.2 16-16V310.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0zM0 176c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H16c-8.8 0-16-7.2-16-16V176zm352 80V480c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V256H352zM144 320c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H144z"/></svg>
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" style={{minWidth:'40px',minHeight:'40px'}} onClick={()=>navigate('store')} className='store mt-3 mx-3'><path d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0H109.6C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9l-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3V384H128V250.6c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3V384v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V384 252.6c-4 1-8 1.8-12.3 2.3z"/></svg>
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" style={{minWidth:'40px',minHeight:'40px'}} onClick={()=>navigate('deliveries')} className='mt-3 deliveryIcon'><path d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
      <h2 className='text-center' style={{position:'absolute',left:'600px',top:'100px',fontWeight:'bold',color:'darkorange'}}>In Farmers We Trust</h2>
      <div>
        <Offcanvas show={showOffcanvas} onHide={closeOffcanvas} style={{background:'#dcffa1'}}>
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
            <h3 className='text-center profile-image mt-4'><img src={profileImage} className='mb-3 rounded userImg' alt="Image Not Found"></img></h3>
            <div className='text-center fw-bold lead'>
              <p className='fs-5'>Username : {currentUser.Username}</p>
              <p className='fs-5'>User Type : {currentUser.Type}</p>
            </div>
            <button className='btn btn-dark fs-5 pt-1 pb-1 fw-semibold text-light' onClick={editUser} style={{opacity:1}}>Edit <span><MdEditCalendar className='mb-1'/></span></button>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
      <div className='rightContent'>
        <h3 className='text-danger fs-5 fw-bold'><img src={profileImage} className='profile-image rounded displayImg' alt='Image Not Found'></img></h3>
        <button onClick={logOutUser} className='float-end btn btn-info text-light fw-bold logoutButton me-3 p-1 px-2'>LogOut<span><TbLogout className='mx-1 mb-1 fw-bold fs-5'/></span></button>
      </div>      
      {
        useUpdateUserForm && 
          <Modal 
            show={showUpdateUserModal} 
            onHide={()=>{closeModal(1)}} 
            backdrop="static"
            centered
          >
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
                <div className='mb-4 mt-4  form-floating'>
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
      }
      {
        useAddProductForm &&
          <Modal
            show={showAddProductModal}
            onHide={()=>{closeModal(2)}}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Product to Store <GiFruitBowl className='fs-3 mb-2 mx-1'/></Modal.Title>
            </Modal.Header>
            <Modal.Body className='pb-0'>
            <form onSubmit={handleSubmit(addProduct)}>
                <div className='form-floating mt-2'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Product Name'
                    id='name'
                    {...register("Name",{required:true})}
                  />
                  <label htmlFor='name'>Product Name</label>
                  {errors.Name?.type==='required' && <p className='text-danger fw-semibold errors'>* Product name required</p>}
                </div>
                <div className='mt-4 form-floating'>
                  <input
                    type='number'
                    className='form-control'
                    placeholder='Quantity'
                    id='qty'
                    {...register("Quantity",{required:true})}
                  />
                  <label htmlFor='qty'>Quantity</label>
                  {errors.Quantity?.type==='required' && <p className='text-danger fw-semibold errors'>* Enter quantity</p>}
                </div>
                <div>
                  <select
                      className='form-select mt-4'
                      {...register("Measurement",{required:'* Select measurement type'})}
                  >
                      <option value=''>---Select Measurement---</option>
                      <option value="grams">grams</option>
                      <option value="Kgs">kilograms</option>
                      <option value="dozens">dozens</option>
                      <option value="units">units</option>
                  </select>
                </div>
                {errors.Measurement?.type==='required' && <p className='text-danger fw-semibold errors mb-4'>{errors.Measurement.message}</p>}
                <div className='mt-4 form-floating'>
                  <input
                    type='number'
                    className='form-control'
                    placeholder='Price'
                    id='price'
                    {...register("Price",{required:true})}
                  />
                  <label htmlFor='price'>Price ₹</label>
                  {errors.Price?.type==='required' && <p className='text-danger fw-semibold errors'>* Enter product price</p>}
                </div>
                <div className='mt-4 form-floating'>
                  <input
                    type='number'
                    className='form-control'
                    placeholder='Stock'
                    id='Stock'
                    {...register("Stock",{required:true})}
                  />
                  <label htmlFor='Stock'>Items in Stock (Reserves)</label>
                  {errors.Stock?.type==='required' && <p className='text-danger fw-semibold errors'>* Enter no. of products in stock</p>}
                </div>
                <div className='mt-4 mb-4 form-floating'>
                  <input
                    type='file'
                    className='form-control'
                    id='img'
                    {...register("Images",{required:'* Upload product images'})}
                    onChange={onImagesSelect}
                    multiple={true}
                  />
                  <label htmlFor='img'>Upload Product Images (2-4 (jpeg/jpg/png))</label>
                  {errors.Images?.type==='required' && <p className='text-danger fw-semibold errors'>{errors.Images.message}</p>}
                </div>
                <Modal.Footer>
                  <Button variant="secondary" onClick={()=>closeModal(2)}>Close</Button>
                  <Button variant="primary" type='submit' disabled={isLoading}>
                    Add {isLoading && <RotatingLines height={25} width={25} strokeColor="white" strokeWidth="5"/>}
                  </Button>
                </Modal.Footer>
              </form>
            </Modal.Body>
          </Modal>
      }
      <div className='mt-5 mb-5 container-fluid float-center pt-5 pb-4' style={{position:'relative',top:'30px'}}>
        <Outlet context={[showProduct]}/>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default FarmerDashboard