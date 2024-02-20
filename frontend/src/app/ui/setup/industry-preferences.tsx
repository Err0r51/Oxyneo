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
import clsx from 'clsx';
import { Car } from "lucide-react"
import { useState } from "react"
import { StepComponentProps } from '@/app/ui/setup/types';


export const IndustryPreferences: React.FC<StepComponentProps> = ({ onNext, onBack }) => {
    // TODO: Add validation for at least one industry selected
    // TODO: Add correct industries - ideally from the backend
    const industries = [
        { id: 1, name: "Automotive" },
        { id: 2, name: "Technology" },
        { id: 3, name: "Finance" },
        { id: 4, name: "Healthcare" },
        { id: 5, name: "Real Estate" },
        { id: 6, name: "Retail" },
        { id: 7, name: "Energy" },
        { id: 8, name: "Entertainment" },
        { id: 9, name: "Agriculture" },
    ];

    const [selectedIndustries, setSelectedIndustries] = useState<number[]>([]);

    const handleNextClick = () => {
        onNext({ industries: selectedIndustries });
    };


    const handleIndustrySelection = (industryId: number) => {
        if (selectedIndustries.includes(industryId)) {
            setSelectedIndustries(selectedIndustries.filter(id => id !== industryId));
        } else {
            setSelectedIndustries([...selectedIndustries, industryId]);

        }
    }

    return (
        <Card className="w-[650px]">
            <CardHeader>
                <CardTitle>Personal preferences</CardTitle>
                <CardDescription>Please select some industries you find interesting</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    {industries.map((industry) => (
                        <Card key={industry.id}
                        className={clsx('border', {
                            'border-orange-500': selectedIndustries.includes(industry.id),
                            'border-gray-300': !selectedIndustries.includes(industry.id),
                        })} onClick={() => handleIndustrySelection(industry.id)}>
                            <CardContent>
                                {/* {todo: fix design and validate at least one input is given} */}
                                <Car />
                                <Label>{industry.name}</Label>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={handleNextClick}>Next</Button>
            </CardFooter>
        </Card>
    );
    
}
