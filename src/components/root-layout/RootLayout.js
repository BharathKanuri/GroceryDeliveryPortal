import {Outlet} from 'react-router-dom'
import NavBar from '../navbar/NavBar'
import Footer from '../footer/Footer'

function RootLayout() {
  return (
    <div>
        <NavBar/>
          <div style={{minHeight:'66vh'}}>
              <Outlet/>
          </div>
        <Footer/>
    </div>
  )
}

export default RootLayout