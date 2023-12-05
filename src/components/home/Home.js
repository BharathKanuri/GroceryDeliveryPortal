import React from 'react'
import './Home.css'
import Carousel from 'react-bootstrap/Carousel';
import Marquee from 'react-fast-marquee'
import {BiSolidMegaphone} from 'react-icons/bi'

function Home() {
  return (
    <div>
      <h1 className='text-danger text-center mt-5 container'>Welcome to Fresh'O Farm Portal</h1>
      <p className='text-center mb-2'>Eat Fresh Live Healthy...</p>
      <Marquee className='mb-3' speed={75} pauseOnClick style={{fontWeight:'bolder',fontSize:'18px'}}>
        <BiSolidMegaphone className='fs-3 me-2 text-success opacity-75 announcement'/>Our Website doesn't include in any mis-communications between Customer and Farmer
      </Marquee>
      <Carousel className='container myCarousel mb-5'>
      <Carousel.Item>
        <img
          className='d-block m-auto rounded'
          src='https://housing.com/news/wp-content/uploads/2022/10/SOWING-FEATURE-compressed.jpg'
          alt="Image Not Found"
        />
        <Carousel.Caption>
          <h3>Sowing</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className='d-block m-auto rounded'
          src="https://i.ytimg.com/vi/gzVy9NEaXlU/maxresdefault.jpg"
          alt="Image Not Found"
        />
        <Carousel.Caption>
          <h3>Cultivation</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className='d-block m-auto rounded'
          src="https://www.chefsbest.com/wp-content/uploads/2016/08/Pesticides-Pros-Cons-2.jpg"
          alt="Image Not Found"
        />
        <Carousel.Caption>
          <h3>Organic Pesticide Spray</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
        className='d-block m-auto rounded'
          src="https://stmaaprodfwsite.blob.core.windows.net/assets/sites/1/2021/10/05102021-maize-for-feed-harvest-c-tim-scrivener.jpg"
          alt="Image Not Found"
        />
        <Carousel.Caption>
          <h3>Harvesting</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className='d-block m-auto rounded'
          src="https://img.freepik.com/premium-photo/young-bearded-courier-red-t-shirt-cap-is-holding-two-heavy-bags-food-home-delivery-food_497171-362.jpg"
          alt="Image Not Found"
        />
        <Carousel.Caption>
          <h3>To Customer's Basket</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </div>
  )
}

export default Home