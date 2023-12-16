import './Store.css'
import axios from 'axios'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useState,useEffect,useContext} from 'react'
import {loginContext} from '../contexts/LoginContext'
import {useOutletContext} from 'react-router-dom'
import {Carousel,Modal,Button} from 'react-bootstrap'
import {useForm} from 'react-hook-form'
import {RotatingLines} from 'react-loader-spinner'

function Store() {
  let [currentUser,,userLogInStatus]=useContext(loginContext)
  let [products,setProducts]=useState({})
  let [showProduct]=useOutletContext()
  let [err,setErr]=useState('')
  let [showImages,setShowImages]=useState(false)
  let [currentImages,setCurrentImages]=useState([])
  let {register,setError,formState:{errors},setValue,getValues}=useForm()
  let [showEditProductModal,setShowEditProductModal]=useState(false)
  let [executeGetProducts,setExecuteGetProducts]=useState(false)
  let [isLoading,setIsLoading]=useState(false)
  let [showProductName,setShowProductName]=useState('')
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
    if(userLogInStatus===true){
      axios.get(`http://localhost:3500/farmers-api/get-products/${currentUser.Username}`)
      .then(response=>{
        if(response.status===201){
          setProducts(response.data.message)
          setErr('')
        }
        else if(response.status===200)
          setErr(response.data.message)
      })
      .catch(err=>handleCatch(err))
    }
  },[showProduct,executeGetProducts])
  let closeEditProductModal=()=>{
    setError('Quantity')
    setError('Measurement')
    setError('Price')
    setError('Stock')
    setShowEditProductModal(false)
  }
  let deleteProduct=(productKey)=>{
    if(window.confirm("Are you sure about to delete this Product")){
      axios.delete(`http://localhost:3500/farmers-api/delete-product/resource?username=${currentUser.Username}&key=${productKey}`)
      .then(responseObj=>{
        setExecuteGetProducts(!executeGetProducts)
        if(responseObj.data.message==='Product deleted'){
          setProducts({})
          toast.info(responseObj.data.message, toastConfig)
          closeEditProductModal()
         }
        else if(responseObj.status===200)
          toast.error(responseObj.data.message, toastConfig)
      })
      .catch(err=>handleCatch(err))
    }
  }
  let editProduct=(productObj)=>{
    setShowProductName(productObj.Name)
    setShowEditProductModal(true)
    setValue('Name',productObj.Name)
    setValue('Quantity',productObj.Quantity)
    setValue('Measurement',productObj.Measurement)
    setValue('Price',productObj.Price)
    setValue('Stock',productObj.Stock)
    setValue('Images',productObj.Images)
    setValue('Key',productObj.Key)
  }
  let saveProduct=async()=>{
    setError('Quantity')
    setError('Measurement')
    setError('Price')
    setError('Stock')
    setIsLoading(true)
    let modifiedProductObj=getValues()
    let requiredFields = ['Quantity', 'Measurement', 'Price', 'Stock'], hasErrors=false
    requiredFields.forEach((field)=>{
      if(modifiedProductObj[field]===''){
        hasErrors=true
        setError(field,{type:'required'})
      }
      else
        setError(field)
    })
    if(hasErrors===true){
      setIsLoading(false)
      return
    }
    else if(userLogInStatus===true){
      await axios.put(`http://localhost:3500/farmers-api/edit-product/${currentUser.Username}`,modifiedProductObj)
      .then(responseObj=>{
        setIsLoading(false)
        setExecuteGetProducts(!executeGetProducts)
        if(responseObj.data.message==='Product details updated'){
          toast.info(responseObj.data.message, toastConfig)
          closeEditProductModal()
         }
        else if(responseObj.status===200)
          toast.error(responseObj.data.message, toastConfig)
        })
        .catch(err=>{
          setIsLoading(false)
          handleCatch(err)
        })
      }
  }
  return (
    <div  className='pt-1'>
      {err==='No products found' && <p className='text-center text-primary bg-dark p-2'>Your store is empty!!!</p>}
      <div className='row row-cols-md-2 row-cols-sm-2 row-cols-1 d-flex justify-content-around'>
      {
        Object.keys(products).map((productKey,index)=>
          <div className="card mb-5 storeCard" style={{maxWidth:'470px'}} key={index}>
            <div className="row no-gutters">
              <div className="col-md-5 px-0">
                <Carousel indicators={false}>      
                  {
                    products[productKey].Images?.map((Img,id)=><Carousel.Item key={id} onClick={()=>{setCurrentImages(products[productKey].Images);setShowImages(true)}} style={{cursor:'pointer'}}><img src={Img} alt='No image found' className='Img' style={{height:'250px',borderRadius:'2.75%'}}></img></Carousel.Item>)
                  }
                </Carousel>
              </div>
              <div className="col-md-7">
                <div className="card-body">
                  <p className="card-title pb-0 fs-4">{products[productKey].Name}<p className='float-end fw-bold fs-4 text-success'>x {products[productKey].Stock}</p></p>
                  <hr style={{height:'5px',background:'black'}}></hr>
                  <div>
                    <p className='card-text fs-5 cardBody fw-semibold text-danger mb-2'>Qty : {products[productKey].Quantity} {products[productKey].Measurement}</p>
                    <p className='card-text fs-5 fw-semibold pb-1'>Price : {products[productKey].Price} ₹</p>
                  </div> 
                  <hr></hr>   
                  <Button variant='warning' onClick={()=>editProduct(products[productKey])}>Edit</Button>  
                  <Button variant='danger float-end' onClick={()=>deleteProduct(productKey)}>Delete</Button> 
                </div>
              </div>
            </div>
          </div> 
      )}
      </div>
      <Modal show={showImages} onHide={()=>setShowImages(false)} centered>
          <Carousel>
            {
              currentImages.map((Img,id)=><Carousel.Item key={id}><img src={Img} alt='Image not found' className='displayImages'></img></Carousel.Item>)
            }
          </Carousel>
      </Modal>
      <Modal
        show={showEditProductModal}
        onHide={closeEditProductModal}
      >
        <Modal.Header className='text-light' style={{background:'#33691e'}}>
          <Modal.Title>
            Edit Product Details ({showProductName})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='pb-0' style={{background:'#689f38'}}>
          <form>
            <div className='form-floating mt-2'>
              <input
                type='number'
                className='form-control'
                placeholder='Quantity'
                id='qty'
                {...register("Quantity")}
              />
              <label htmlFor='qty'>Quantity</label>
              {errors.Quantity?.type==='required' && <p className='fw-semibold errors' style={{color:'red'}}>* Enter quantity</p>}
            </div>
            <div>
              <select
                className='form-select mt-4'
                {...register("Measurement")}
              >
                <option value=''>---Select Measurement---</option>
                <option value="grams">grams</option>
                <option value="Kgs">kilograms</option>
                <option value="dozens">dozens</option>
                <option value="units">units</option>
              </select>
            </div>
            {errors.Measurement?.type==='required' && <p className='fw-semibold mb-4 errors' style={{color:'red'}}>* Select measurement type</p>}
            <div className='mt-4 mb-4 form-floating'>
              <input
                type='number'
                className='form-control'
                placeholder='Price'
                id='price'
                {...register("Price")}
              />
              <label htmlFor='price'>Price ₹</label>
              {errors.Price?.type==='required' && <p className='fw-semibold errors' style={{color:'red'}}>* Enter product price</p>}
            </div>
            <div className='mt-4 mb-4 form-floating'>
              <input
                type='number'
                className='form-control'
                placeholder='Stock'
                id='stock'
                {...register("Stock")}
              />
              <label htmlFor='stock'>Stock</label>
              {errors.Stock?.type==='required' && <p className='fw-semibold errors' style={{color:'red'}}>* Enter no. of products in stock</p>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer style={{background:'#9ccc65'}}>
          <Button variant='dark' onClick={closeEditProductModal} className='opacity-75'>Close</Button>
          <Button variant='success' onClick={saveProduct} disabled={isLoading} className='opacity-75'>
            Save  {isLoading && <RotatingLines height={25} width={25} strokeColor="white" strokeWidth="5"/>}     
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer/>
    </div>
  )
}

export default Store