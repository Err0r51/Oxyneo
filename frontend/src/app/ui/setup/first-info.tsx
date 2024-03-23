import * as React from 'react'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import type { StepComponentProps } from '@/app/ui/setup/types'

export const FirstInfo: React.FC<StepComponentProps> = ({ onNext, onBack }) => {
  const router = useRouter()
  return (
    <Card className="w-full sm:w-[450px]">
      <CardHeader>

        <CardTitle>Create a Portfolio</CardTitle>
        <CardDescription>Lets setup an investment strategy together. For this I am going to ask you a few questions about your financial preferences</CardDescription>
      </CardHeader>
      <CardContent>
      </CardContent>
      <CardFooter className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger>Cancel</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will cancel the setup process and you will be taken back to the dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => router.push('/')}>Ok</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button onClick={onNext}>Start</Button>
      </CardFooter>
    </Card>
  )
}
