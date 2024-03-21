import React from 'react'
import { MailCheck } from 'lucide-react'

const SignupSuccessPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <MailCheck size={100} color="hsl(var(--primary))" className="mb-4" />
      <h1 className="text-2xl font-bold mb-2">Signup Successful!</h1>
      <p>Please check your email to verify your account.</p>
    </div>
  )
}

export default SignupSuccessPage
