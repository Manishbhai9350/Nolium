import SignupForm from '@/features/auth/signup-form'
import { requireUnAuth } from '@/lib/auth-utils'
import React from 'react'

const page = async () => {

  await requireUnAuth()
  

  return (
    <main className='w-full h-screen'>
      <SignupForm />
   </main>
  )
}

export default page