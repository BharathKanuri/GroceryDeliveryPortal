import axios from 'axios'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useState,useEffect,useContext} from 'react'
import {loginContext} from '../contexts/LoginContext'
import {Button} from 'react-bootstrap'
import {ImCross} from "react-icons/im"

function Order(){
  let [currentUser]=useContext(loginContext)
  let [curOrders,setCurOrders]=useState({})
  let [err,setErr]=useState('')
  let [executeOrder,setExecuteOrder]=useState(false)
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
    axios.get(`http://localhost:3500/customers-api/get-orders/${currentUser.Username}`)
    .then(response=>{
        if(response.status===201)
          setCurOrders(response.data.message)  
        else if(response.data.message==="Your order history is empty!!!")
          setErr(response.data.message)
    })
    .catch(err=>handleCatch(err))
  },[executeOrder])
  let cancelOrder=(orderKey,orderOwner,addressKey)=>{
    if(window.confirm("Are you sure about to cancel your order")){
      axios.put(`http://localhost:3500/customers-api/cancel-order/${currentUser.Username}`,{orderKey,orderOwner,addressKey})
      .then(response=>{
        if(response.status===201){
          toast.success(response.data.message,toastConfig)
          setExecuteOrder(!executeOrder)
        }
        else if(response.data.message==="Order cancellation failed")
          toast.error(response.data.message,toastConfig)
      })
      .catch(err=>handleCatch(err))
    }
  }
  return (
    <div className='pt-1'>
        {err==='Your order history is empty!!!' && <p className='text-center text-primary bg-dark p-2'>{err}</p>}
        <div className='row row-cols-md-2 row-cols-sm-2 row-cols-1 d-flex justify-content-around'>
          {
            Object.keys(curOrders).map((orderKey,index)=>
              <div className="card mb-5 mx-3" style={{width: '300px'}} key={index}>
                <div className="card-header bg-danger text-light rounded" style={{width:'300px',marginLeft:'-13px'}}>
                  <h5 className='fw-bold'>{curOrders[orderKey].Name} ({curOrders[orderKey].Quantity} {curOrders[orderKey].Measurement})<h5 className='float-end fw-bold'>{curOrders[orderKey].Price}/-</h5></h5>
                  <h6 className='pb-3'>({curOrders[orderKey].Status}) {curOrders[orderKey].Status==="Cancelled" && <ImCross style={{fontSize:'11px'}} className='mx-1'/>}</h6>
                  <h6 style={{color:'silver'}} className='fw-bold'>Ref Id : {curOrders[orderKey].Key}</h6>
                  <h6 style={{color:'limegreen'}} className='fw-bold'>Order Id : {curOrders[orderKey].OrderKey}</h6>
                  <h6 style={{color:'gold'}} className='fw-bold'>Delivery Status : {curOrders[orderKey].DeliveryStatus}</h6>
                    <Button onClick={()=>cancelOrder(curOrders[orderKey].OrderKey,curOrders[orderKey].Owner,curOrders[orderKey].AddressKey)} disabled={curOrders[orderKey].Status==="Cancelled" || curOrders[orderKey].DeliveryStatus==="Delivered"} style={{border:'none'}} className='mt-2 float-end bg-dark bg-opacity-75'>Cancel</Button>
                </div>
              </div>
            )
          }
        </div>
        <ToastContainer/>
    </div>
  )
}

export default Order