import LoginForm from '@/features/auth/login-form'
import { requireUnAuth } from '@/lib/auth-utils'

const page = async () => {

  await requireUnAuth()
  

  return (
    <main className='w-full h-fit'>
     <LoginForm />
    </main>
  )
}

export default page