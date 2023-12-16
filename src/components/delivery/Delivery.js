import './Delivery.css'
import axios from 'axios'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useState,useEffect,useContext} from 'react'
import {useForm} from 'react-hook-form'
import {loginContext} from '../contexts/LoginContext'
import {FcAddressBook} from "react-icons/fc"
import {FaAddressCard} from "react-icons/fa6"
import {IoCall,IoSave} from "react-icons/io5"
import {GoDotFill} from "react-icons/go"
import {FaCheck} from "react-icons/fa"
import {ImCross} from "react-icons/im"
import {Modal,Button} from 'react-bootstrap'

function Delivery(){
  let [currentUser]=useContext(loginContext)
  let [curDeliveries,setCurDeliveries]=useState({})
  let [err,setErr]=useState('')
  let {register,formState:{errors},setError,setValue,getValues}=useForm()
  let [validateDelivery,setValidateDelivery]=useState(false)
  let [curDeliveryStatusObj,setCurDeliveryStatusObj]=useState({})
  let [isDelivery,setIsDelivery]=useState(true)
  let [executeDelivery,setExecuteDelivery]=useState(false)
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
    axios.get(`http://localhost:3500/farmers-api/get-deliveries/${currentUser.Username}`)
    .then(response=>{
        if(response.status===201)
          setCurDeliveries(response.data.message)  
        else if(response.data.message==="No orders to be delivered")
          setErr(response.data.message)
    })
    .catch(err=>handleCatch(err))
  },[executeDelivery])
  let validateOrderId=()=>{
    let orderId=getValues("OrderId")
    if(orderId!==curDeliveryStatusObj.deliveryKey){
      setError("OrderId",{type:"required",message:"* Please enter a valid 13 digit Order Id"})
      setIsDelivery(false)
    }
    else{
      setIsDelivery(true)
      setValidateDelivery(false)
      saveDeliveryStatus(curDeliveryStatusObj)
    }
  }
  let saveDeliveryStatus=(deliveryStatusObj)=>{  
    if(isDelivery)
      axios.put(`http://localhost:3500/farmers-api/update-delivery-status/${currentUser.Username}`,deliveryStatusObj)
      .then(response=>{
          if(response.status===201){
            toast.info(response.data.message,toastConfig)
            setExecuteDelivery(!executeDelivery)
          }
          else if(response.data.message==="Delivery status updation unsuccessful")
            toast.error(response.data.message,toastConfig)
      })
      .catch(err=>handleCatch(err))
  }
  return (
    <div className='pt-1'>
      {err==='No orders to be delivered' && <p className='text-center text-primary bg-dark p-2'>{err}</p>}
      <div className='row row-cols-md-3 row-cols-sm-2 row-cols-1 d-flex justify-content-between'>
      {
        Object.keys(curDeliveries)?.map((deliveryKey,key)=>Object.keys(curDeliveries[deliveryKey]).map((deliveryObj,id)=>{
          let delivery=curDeliveries[deliveryKey][deliveryObj]
          let address=curDeliveries[deliveryKey].Address
          setValue(`DeliveryStatus-${delivery.DeliveryKey}`,delivery.DeliveryStatus)
          if(deliveryObj!=='Address'){
            return(
              <div className="card mb-5 mx-3" style={{width: '300px'}} key={key}>
                <div className="card-header bg-dark bg-opacity-25" style={{width:'300px',marginLeft:'-13px'}}>
                  <h6 className="card-title fs-5 fw-bold" style={{color:'darkgreen'}}>{delivery.Name} ({delivery.Quantity}{delivery.Measurement})<h6 className='float-end fs-5 fw-bold'>{delivery.Price}/-</h6></h6>
                  <h6>Ref-Id : {delivery.Key}</h6>
                </div>
                <div className='card-body bg-dark bg-opacity-10' style={{width:'300px',marginLeft:'-13px'}}>
                  <h5 className='mb-3 text-danger'>Address <FaAddressCard className='fs-4 mb-1'/></h5>
                  {delivery.Status==="Ordered" && delivery.DeliveryStatus!=="Delivered" && <h6 className='text-success float-end'><GoDotFill style={{marginBottom:'2.5px'}}/>{delivery.Status}</h6>}
                  {delivery.Status==="Cancelled" && delivery.DeliveryStatus!=="Delivered" && <h6 className='text-danger float-end'><GoDotFill style={{marginBottom:'2.5px'}}/>{delivery.Status}</h6>}
                  <h6 style={{color:'darkblue'}}><FcAddressBook className='fs-5'/> {address.Name}</h6>
                  <h6><IoCall className='fs-5'/>+91 {address.PhoneNo}</h6>
                  <h6>{address.HouseNo}, {address.Street}, {address.Locality},</h6>
                  <h6>{address.State}, INDIA</h6>
                </div>
                <div className='card-footer' style={{width:'300px',marginLeft:'-13px'}}> 
                  <form onSubmit={e=>{
                    e.preventDefault()
                    let status=getValues(`DeliveryStatus-${delivery.DeliveryKey}`)
                    let deliveryStatusObj={}
                    deliveryStatusObj.addressKey=address.Key
                    deliveryStatusObj.deliveryKey=delivery.DeliveryKey
                    deliveryStatusObj.status=status
                    deliveryStatusObj.customer=address.Username
                    setCurDeliveryStatusObj(deliveryStatusObj)
                    if(deliveryStatusObj.status==='Delivered')
                      setValidateDelivery(true) 
                    else
                      saveDeliveryStatus(deliveryStatusObj)
                  }}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <select 
                        className='form-select' 
                        style={{border:'0.5px solid black'}}
                        disabled={delivery.DeliveryStatus==='Delivered' || delivery.Status==='Cancelled'}
                        {...register(`DeliveryStatus-${delivery.DeliveryKey}`)}
                      >
                        <option value='' disabled={true}>--Update Delivery Status--</option>
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Grocery Packed">Grocery Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <button type='submit' style={{background:'none',border:'none'}} disabled={delivery.DeliveryStatus==='Delivered'}>
                        {delivery.Status==='Ordered' && delivery.DeliveryStatus==='Delivered' && <FaCheck className='fs-4 me-0 text-success'/>}
                        {delivery.Status==='Ordered' && delivery.DeliveryStatus!=='Delivered' && <IoSave className='fs-4 me-0 addressSaveIcon'/>}
                        {delivery.Status==='Cancelled' && <ImCross className='fs-5 me-0 text-danger'/>}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )
          }}
          ))
        }
        </div>
        <Modal
          show={validateDelivery}
          onHide={()=>{setError('OrderId');setValue('OrderId');setValidateDelivery(false)}}
        >
          <Modal.Header className='bg-primary' style={{height:'50px'}}>
            <Modal.Title className='fs-5'>
              Delivery Conformation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className='bg-primary bg-opacity-75'>
            <div className='form-floating'>
              <input
                type='text'
                className='form-control'
                placeholder='Order Id'
                id='order_id'
                {...register(`OrderId`)}
              />
              <label htmlFor='order_id'>Enter Order Id given by customer</label>
            </div>
            {errors.OrderId?.type==='required' && <p className='text-danger fw-semibold errors mb-0'>{errors.OrderId.message}</p>}
          </Modal.Body>
          <Modal.Footer className='bg-primary bg-opacity-50' style={{height:'50px'}}>
            <Button variant='primary' style={{border:'none',marginTop:'-5.25px'}} onClick={validateOrderId}>Confirm</Button>
          </Modal.Footer>
        </Modal>
        <ToastContainer/>
    </div>
  )
}

export default Delivery