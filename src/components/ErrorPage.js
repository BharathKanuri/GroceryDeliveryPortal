import React from 'react'
import {BiSolidError} from 'react-icons/bi'

function ErrorPage() {
  return (
    <div className='text-center mt-5'>
        <h2 className='text-danger'>Oops!!!</h2>
        <p className='text-warning fs-5'><BiSolidError className='me-2 fs-2 mb-2'/>Something went wrong...Invalid url</p>
    </div>
  )
}

export default ErrorPage