import { useState } from 'react';
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StepComponentProps } from '@/app/ui/setup/types';

export const RiskProfile: React.FC<StepComponentProps> = ({ onNext, onBack }) => {
    const [selectedOption, setSelectedOption] = useState('low-risk');

    const handleNextClick = () => {
        onNext({ riskProfile: selectedOption });
    };

    const handleOptionChange = (value: string) => {
        setSelectedOption(value);
    };
      
    return (
        <Card className="w-[450px]">
            <CardHeader>
                <CardTitle>Amount</CardTitle>
                <CardDescription>Please select your risk financial profile. This helps to define the right invest strategy for you</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup defaultValue="low-risk" onValueChange={handleOptionChange}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low-risk" id="low-risk" />
                        <Label htmlFor="low-risk">Keep it safe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium-risk" id="medium-risk" />
                        <Label htmlFor="medium-risk">Some risk is okay for me</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high-risk" id="high-risk" />
                        <Label htmlFor="high-risk">High risk, high reward</Label>
                    </div>
                </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={handleNextClick}>Next</Button>
            </CardFooter>
        </Card>
    )
}

