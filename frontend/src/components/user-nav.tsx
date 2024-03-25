'use client'
import { useRouter } from 'next/navigation'
import { createClient } from "@/utils/supabase/client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// TODO: integrate Supabase Profile Picture + Name


export function UserNav() {
  const supabase = createClient()
  const router = useRouter()

  const usermail = async () => {
    const { data: session, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting user:', error.message)
      return "User"
    }
    
    return session?.session?.user?.email as string
  }


  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://avatars.githubusercontent.com/u/19636769?v=4"/>
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Frede</p>
            <p className="text-xs leading-none text-muted-foreground">
            {usermail()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘Y</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSignOut()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}