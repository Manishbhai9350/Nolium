import NeonClient from './neon-client'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers';

const page = async () => {

  await auth.api.getSession({
      headers: await headers(),
    });

  return (
    <div>
        Cold Starting Neon DB
        <NeonClient />
    </div>
  )
}

export default page