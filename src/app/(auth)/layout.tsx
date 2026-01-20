import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='layout w-screen min-h-screen py-6 flex gap-3 flex-col justify-center items-center'>
        <Link href='/' className="nolium flex justify-center items-center gap-2">
          <Image 
           width={30}
           height={30}
           src='/logos/logo.svg'
           alt='logo'
          />
          <h1 className='text-2xl font-semibold'>Nolium</h1>
        </Link>
        <div className="w-full max-w-sm flex justify-center items-center">
            {children}
        </div>
    </div>
  )
}

export default layout