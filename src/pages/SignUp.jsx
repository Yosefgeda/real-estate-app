import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='p-3 max-w-lg mx-auto' >
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type='text' placeholder='Username' id='username' className='bg-slate-200 rounded-lg p-3' />
        <input type='email' placeholder='Email' id='email' className='bg-slate-200 rounded-lg p-3' />
        <input type='password' placeholder='Password' id='password' className='bg-slate-200 rounded-lg p-3' />
        <button className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-80 disabled:opacity-70'>Sign Up</button>
      </form>
      <div className='flex gap-2 mt-2'>
        <p>Have an account?</p>
        <Link to='/signin'>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
    </div>
  )
}

export default SignUp