import './Shop.css'
import axios from 'axios'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useForm} from 'react-hook-form'
import {Carousel,Modal,Button} from 'react-bootstrap'
import {FaAddressCard} from "react-icons/fa6";
import {useState,useEffect,useContext} from 'react'
import {loginContext} from '../contexts/LoginContext'
import {IoReceipt} from "react-icons/io5"
import {loadStripe} from '@stripe/stripe-js'

function Shop() {
  let [currentUser,,userLogInStatus]=useContext(loginContext)
  let {register,setError,formState:{errors},setValue,getValues}=useForm()
  let [allProducts,setAllProducts]=useState([])
  let [err,setErr]=useState('')
  let [showImages,setShowImages]=useState(false)
  let [currentImages,setCurrentImages]=useState([])
  let [openAddressModal,setOpenAddressModal]=useState(false)
  let [stockCount,setStockCount]=useState(1)
  let [curAddress,setCurAddress]=useState(currentUser.Address)
  let [showBillPayment,setShowBillPayment]=useState(false)
  let [curProduct,setCurProduct]=useState({})
  let openSetAddressModal=()=>{
    setError('Name')
    setError('PhoneNo')
    setError('HouseNo')
    setError('Street')
    setError('Locality')
    setError('State')
    setValue('Name',curAddress.Name)
    setValue('PhoneNo',curAddress.PhoneNo)
    setValue('HouseNo',curAddress.HouseNo)
    setValue('Street',curAddress.Street)
    setValue('Locality',curAddress.Locality)
    setValue('State',curAddress.State)
    setOpenAddressModal(true)
  }
  let incStockCount=()=>{
    if(stockCount<curProduct.Stock)
      setStockCount(stockCount+1)
  }
  let decStockCount=(curProd)=>{
    if(stockCount>1)
      setStockCount(stockCount-1)
  }

  useEffect(()=>{
    if(userLogInStatus===true){
      axios.get(`http://localhost:3500/farmers-api/get-all-products`)
        .then(response=>{
            if(response.status===201){
                setAllProducts(response.data.message)
                setErr('')
            }
            else if(response.status===200){
                setErr(response.data.message)
            }
          })
          .catch(err=>{
            if(err.response){
              toast.error('Invalid URL Request', 
              {
                position: "top-center",
                autoClose: 7500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style:{width:'325px'}
              })
            }
            else if(err.request){
              toast.warning('Check your network connection', 
              {
                position: "top-center",
                autoClose: 7500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style:{width:'325px'}
              })
            }
            else{
              toast.error('Oops!!! Something Went Wrong', 
              {
                position: "top-center",
                autoClose: 7500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style:{width:'325px'}
              })
            }
          })
        }
      },[])
    let saveAddress=()=>{
      let address=getValues()
      let requiredFields = ['Name', 'PhoneNo', 'HouseNo', 'Street', 'Locality', 'State'], hasErrors=false
      requiredFields.forEach((field)=>{
        if(address[field]===''){
          hasErrors=true
          setError(field,{type:'required'})
        }
        else if(field==='PhoneNo' && address[field].length!=10){
          hasErrors=true
          setError(field,{type:'required',message:'* Enter valid mobile no.'})
        }
        else
          setError(field,{type:''})
      })
      if(hasErrors===true){
        return
      }
      else if(userLogInStatus===true){
        axios.put(`http://localhost:3500/customers-api/modify-address/${currentUser.Username}`,address)
        .then(responseObj=>{
          if(responseObj.data.message==='Address updation successfull'){
            toast.info(responseObj.data.message, 
            {
              position: "top-center",
              autoClose: 7500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              style:{width:'325px'}
            })
            setCurAddress(address)
            setShowBillPayment(true)
           }
          else if(responseObj.status===200){
            toast.error(responseObj.data.message, 
              {
                position: "top-center",
                autoClose: 7500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style:{width:'325px'}
              })
            }
          })
          .catch(err=>{
            if(err.response){
              toast.error('Invalid URL Request', 
              {
                position: "top-center",
                autoClose: 7500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style:{width:'325px'}
              })
            }
            else if(err.request){
              toast.warning('Check your network connection', 
              {
                position: "top-center",
                autoClose: 7500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style:{width:'325px'}
              })
            }
            else{
              toast.error('Oops!!! Something went wrong', 
              {
                position: "top-center",
                autoClose: 7500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style:{width:'325px'}
              })
            }
          })
        }
    }
  return (
    <div className='pt-1'>
        {err==='Products are unavailable currently' && <p className='text-center text-primary bg-dark p-2'>{err}</p>}
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-6" style={{marginLeft:'-7.5px',marginRight:'-80px'}}>
          {
            allProducts?.map((farmer,id)=>
                Object.values(farmer.Products).map((product,key)=>  
                <div className="col" key={id} >
                  <div className="card mb-5 shopCard" style={{maxWidth:'300px'}} key={key} onMouseEnter={()=>{setCurProduct(product);setStockCount(1)}}>
                    <Carousel indicators={false}>      
                    {
                        product.Images?.map((Img,idx)=><Carousel.Item key={idx} onClick={()=>{setCurrentImages(product.Images);setShowImages(true)}} style={{cursor:'pointer'}}><img src={Img} alt='Image not found' className='p-3' style={{height:'200px',width:'300px',borderRadius:'2.75%'}}></img></Carousel.Item>)
                    }
                    </Carousel>
                    <div className="card-body" style={{maxHeight:'170px'}}>
                      <h5 className="card-header fs-5 bg-dark text-light rounded">{product.Name}<span className='float-end pe-2 px-2 rounded mt-1' style={{background:'darkorange',fontSize:'15px'}}>In Stock - {product.Stock}</span></h5>  
                      <h5 className='text-danger card-body'>Quantity : {product.Quantity} {product.Measurement}</h5>
                      {
                        product.Key===curProduct.Key ? <Button className='card-footer rounded text-light float-end' style={{background:'#82954B',border:'none'}} onClick={openSetAddressModal}>Buy<span className='pe-2 px-2 mx-1 rounded text-dark' style={{background:'#EFD345'}}>{product.Price * stockCount}₹</span></Button>
                        : <Button className='card-footer rounded text-light float-end' style={{background:'#82954B',border:'none'}} onClick={openSetAddressModal}>Buy<span className='pe-2 px-2 mx-1 rounded text-dark' style={{background:'#EFD345'}}>{product.Price}₹</span></Button>
                      }
                      <div className='d-flex m-auto'>
                        <button className='float-end mt-1 text-danger fw-bold fs-4' style={{border:'none',background:'none'}} onClick={decStockCount}>-</button>
                        {
                          product.Key===curProduct.Key && <h5 className='float-end mt-3 p-1 pe-2 px-2 text-light' style={{borderRadius:'50%',fontSize:'15px',background:'darkgoldenrod'}}>{stockCount}</h5>
                        }
                        <button className='float-end mt-1 text-success fw-bold fs-4' style={{border:'none',background:'none'}} onClick={incStockCount}>+</button>
                      </div>     
                    </div>
                  </div>
                </div>
            ))
          }
        </div>
        <Modal show={showImages} onHide={()=>setShowImages(false)} centered>
          <Carousel>
            {
              currentImages.map((Img,id)=><Carousel.Item key={id}><img src={Img} alt='Image not found' className='displayImages'></img></Carousel.Item>)
            }
          </Carousel>
        </Modal>
      <Modal
        show={openAddressModal}
        onHide={()=>{setOpenAddressModal(false);setShowBillPayment(false)}}
      >
        <Modal.Header className='text-white opacity-75' style={{background:'black'}}>
          {
            showBillPayment===false ?
              <Modal.Title>
                Address <FaAddressCard className='fs-3 mb-1 mx-1'/>
              </Modal.Title> :
              <Modal.Title>
                Bill Summary <IoReceipt className='fs-3 mb-1 mx-1'/>
              </Modal.Title>
          }
        </Modal.Header>
        <Modal.Body className='pb-0 pt-4 bg-dark bg-opacity-50'>
          {
            showBillPayment===false ?
              <form>
                <div className='form-floating'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Full name'
                    id='name'
                    {...register("Name")}
                  />
                  <label htmlFor='name'>Full Name</label>
                  {errors.Name?.type==='required' && <p className='fw-semibold errors' style={{color:'red'}}>* Enter full name</p>}
                </div>
                <div className='mt-4 mb-4 form-floating'>
                  <input
                    type='tel'
                    className='form-control'
                    placeholder='Phno'
                    id='phno'
                    {...register("PhoneNo",{required:'* Enter mobile no.'})}
                  />
                  <label htmlFor='phno'>Mobile Number</label>
                  {errors.PhoneNo?.type==='required' && <p className='fw-semibold errors' style={{color:'red'}}>{errors.PhoneNo.message}</p>}
                </div>
                <div className='mt-4 mb-4 form-floating'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Hno'
                    id='hno'
                    {...register("HouseNo")}
                  />
                  <label htmlFor='hno'>Flat / Door / House no.</label>
                  {errors.HouseNo?.type==='required' && <p className='fw-semibold errors' style={{color:'red'}}>* Enter house / door no.</p>}
                </div>
                <div className='mt-4 mb-4 form-floating'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Street'
                    id='street'
                    {...register("Street")}
                  />
                  <label htmlFor='street'>Street / Sub-Locality</label>
                  {errors.Street?.type==='required' && <p className='fw-semibold errors' style={{color:'red'}}>* Enter sub-locality</p>}
                </div>
                <div className='mt-4 mb-4 form-floating'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Locality'
                    id='locality'
                    {...register("Locality")}
                  />
                  <label htmlFor='street'>Village / Town / City</label>
                  {errors.Locality?.type==='required' && <p className='fw-semibold errors' style={{color:'red'}}>* Enter locality</p>}
                </div>
                <div>
                  <select
                    className='form-select'
                    {...register("State")}
                  >
                    <option value=''>---Select State--- (INDIA)</option>
                    <option value="ANDHRA PRADESH">Andhra Pradesh</option>
                    <option value="KARNATAKA">Karnataka</option>
                    <option value="KERALA">Kerala</option>
                    <option value="TAMIL NADU">Tamil Nadu</option>
                    <option value="TELANGANA">Telangana</option>
                  </select>
                  {errors.State?.type==='required' && <p className='fw-semibold errors' style={{color:'red'}}>* Select state</p>}
                </div>
                <div className='mb-4'></div>
              </form>  :
              <div className='d-flex m-auto mb-4'>
                <div className="card billCard me-2" style={{width: '15rem'}}>
                  <div className="card-body">
                    <h5 className="card-title">Grocery Details</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{curProduct.Name}</h6>
                    <h6 className="card-text mt-3 mb-0" style={{fontSize:'15px',color:'darkorange'}}>Quantity : {curProduct.Quantity * stockCount} {curProduct.Measurement}</h6>
                    <h6 className="card-text" style={{fontSize:'15px',color:'darkorange'}}>Total Price : {curProduct.Price * stockCount} ₹</h6>
                  </div>
                </div>
                <div className="card addressCard" style={{width: '15rem'}}>
                  <div className="card-body">
                    <h5 className="card-title">Delivery Address</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{curAddress.Name}</h6>
                    <h6 className="card-text mt-3 mb-0" style={{fontSize:'15px'}}>Contact : {curAddress.PhoneNo}</h6>
                    <h6 className="card-text text-danger" style={{fontSize:'15px'}}>{curAddress.HouseNo}, {curAddress.Street}, {curAddress.Locality}, {curAddress.State}, INDIA</h6>
                  </div>
                </div>
              </div> 
            }
        </Modal.Body>
        <Modal.Footer className='bg-dark bg-opacity-25'>
          {
            showBillPayment===false ? 
            <div>
              <Button variant="warning me-2" onClick={saveAddress}>
                Change & Proceed
              </Button>
              <Button variant='success' onClick={()=>setShowBillPayment(true)}>
                Continue
              </Button>
            </div> :
            <div>
              <Button variant="danger me-2" onClick={()=>{setShowBillPayment(false);setOpenAddressModal(false)}}>
                Cancel
              </Button>
              <Button variant='success'>
                Pay ₹{curProduct.Price * stockCount}
              </Button>
            </div>  
          }
        </Modal.Footer>
      </Modal>
      <ToastContainer/>
    </div>
)}

export default Shop;