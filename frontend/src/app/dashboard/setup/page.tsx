'use client'

// TODO: add progress bar

import React, { useState } from 'react'
import { FirstInfo } from '@/app/ui/setup/first-info'
import { IndustryPreferences } from '@/app/ui/setup/industry-preferences'
import { MoneyAmount } from '@/app/ui/setup/money-amount'
import { RiskProfile } from '@/app/ui/setup/risk-profile'
import { StockSelection } from '@/app/ui/setup/stock-selection'

const steps = [
  FirstInfo,
  IndustryPreferences,
  MoneyAmount,
  RiskProfile,
  StockSelection,
]

const SetupWizard: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [setupData, setSetupData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onNext = (data: object) => {
    console.log(data)
    setSetupData(prevData => ({ ...prevData, ...data }))
    if (currentStepIndex === steps.length - 1) {
      setIsSubmitting(true)
      console.log('Submitting', setupData)
    }
    else {
      setCurrentStepIndex(index => Math.min(index + 1, steps.length - 1))
    }
  }

  const onBack = () => setCurrentStepIndex(index => Math.max(index - 1, 0))

  const CurrentStepComponent = steps[currentStepIndex]

  return (
    <div className="flex flex-col justify-center items-center flex-grow">
    <CurrentStepComponent onNext={onNext} onBack={onBack} />
    </div>
  )
}

export default SetupWizard
