import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { StepComponentProps } from '@/app/ui/setup/types'

export const MoneyAmount: React.FC<StepComponentProps> = ({ onNext, onBack }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>()
  const handleNextClick = () => {
    onNext({ amount: selectedAmount })
  }

  // TODO: Verify for positive integer
  return (
    <Card className="w-[450px]">
      <CardHeader>

        <CardTitle>Amount</CardTitle>
        <CardDescription>Please select the amount you want to invest</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="number"
          placeholder="Enter the amount"
          value={selectedAmount}
          onChange={e => setSelectedAmount(Number(e.target.value))}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleNextClick}>Next</Button>
      </CardFooter>
    </Card>
  )
}
