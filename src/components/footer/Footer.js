import './Footer.css'
import flag from './flag.svg'
import call from './call.svg'
import {GiCorn} from 'react-icons/gi'

function Footer(){
  return(
    <footer className='text-center text-light p-3 pt-4 fw-bold' style={{fontWeight:'bold'}}>
        <h5>Fresh'O Farm Products <GiCorn className='fs-3 mb-1'/></h5>
        <h5><img src={call} style={{maxWidth:'25px',height:'25px'}}></img>+1800-2330-4556</h5>
        <h5>Plot No : 57-23/30,</h5>
        <h4>500072, Hyderabad,</h4>
        <h3>Telangana, IND<img src={flag} style={{maxWidth:'50px',height:'40px'}} className='mb-1 pe-1'></img></h3>
    </footer>
  )
}

export default Footer