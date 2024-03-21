'use client'

// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import cover from '/public/cover.jpg'

import { useState } from 'react'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const LoginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password is missing or too short.'),
})

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [formError, setFormError] = useState('')

  const { ...form } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSignIn = async (data: z.infer<typeof LoginSchema>) => {
    const { email, password } = data
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) 
      setFormError(`Error: ${error.message}`)
    
    else 
      router.push('/')
    
  }

  const handleSignUp = async (data: z.infer<typeof LoginSchema>) => {
    const { email, password } = data
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      console.error(error.message)
      setFormError(`Error: ${error.message}`)
    }
    else {
      router.push('/login/signup-success')
    }
  }

  return (

    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="student@berkeleyfans.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => form.handleSubmit(handleSignUp)()}>Sign up</Button>
              <Button type="submit">Login</Button>
            </div>
            {formError && (
              <div className="text-red-500">{formError}</div>
            )}
          </form>
        </Form>
      </div>
      <div className="hidden md:block md:w-2/3">
        <Image src={cover} priority={true} alt="Cover image" className="h-full w-full object-cover" />
      </div>
    </div>
  )
}
