import './App.css';
import './components/root-layout/RootLayout'
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import RootLayout from './components/root-layout/RootLayout';
import ErrorPage from './components/ErrorPage'
import Home from './components/home/Home'
import SignUp from './components/signup/SignUp'
import LogIn from './components/login/LogIn'
import AboutUs from './components/about-us/AboutUs'
import FarmerDashboard from './components/farmer-dashboard/FarmerDashboard'
import CustomerDashboard from './components/customer-dashboard/CustomerDashboard'
import Store from './components/store/Store'
import Shop from './components/shop/Shop'

function App() {
  let router=createBrowserRouter([
    {
      path:'/',
      element:<RootLayout/>,
      errorElement:<ErrorPage/>,
      children:[
        {
          path:'/',
          element:<Home/>
        },
        {
          path:'/home',
          element:<Home/>
        },
        {
          path:'/sign-up',
          element:<SignUp/>
        },
        {
          path:'/login',
          element:<LogIn/>,
        },
        {
          path:'/about-us',
          element:<AboutUs/>
        },
        {
          path:'/farmer-dashboard',
          element:<FarmerDashboard/>,
          children:[
            {
              path:'store',
              element:<Store/>
            }
          ]
        },
        {
          path:'/customer-dashboard',
          element:<CustomerDashboard/>,
          children:[
            {
              path:'shop',
              element:<Shop/>
            }
          ]
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
