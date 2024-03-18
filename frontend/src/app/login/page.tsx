
"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from 'next/image'
import cover from '/public/cover.jpg'
import { login, signup } from './actions'


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


import { Input } from "@/components/ui/input"

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
})

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(FormSchema),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error)  
      redirect('/error')
    
    router.refresh()
  }


return (
  <div className="flex flex-col md:flex-row h-screen">
    <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
      <div>
        <h2 className="text-3xl font-bold mb-4">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="**********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button variant="outline" formAction={signup}>Sign up</Button>
              <Button type="submit" formAction={login}>Login</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
    <div className="hidden md:block md:w-2/3">
      <Image
        src={cover}
        alt="Photo by Verne Ho on Unsplash"
        className="h-full w-full object-cover"
      />
    </div>
  </div>
)
}
