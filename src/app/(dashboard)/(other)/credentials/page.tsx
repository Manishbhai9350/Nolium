import { requireAuth } from "@/lib/auth-utils"

const CredentialsPage = async () => {
  await requireAuth()
  return (
    <div>Credentials</div>
  )
}

export default CredentialsPage