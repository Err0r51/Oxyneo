import React, { useState } from 'react'
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
import { useToast } from '@/components/ui/use-toast'
import type { IStock, IStockDictionary, StepComponentProps } from '@/app/ui/setup/types'

const stockList: IStockDictionary = {
  AAPL: { name: 'Apple', symbol: 'AAPL', description: 'Apple Inc.' },
  MSFT: { name: 'Microsoft', symbol: 'MSFT', description: 'Microsoft Corporation' },
  AMZN: { name: 'Amazon', symbol: 'AMZN', description: 'Amazon.com, Inc.' },
  GOOG: { name: 'Alphabet', symbol: 'GOOG', description: 'Alphabet Inc.' },
  FB: { name: 'Facebook', symbol: 'FB', description: 'Facebook, Inc.' },
  TSLA: { name: 'Tesla', symbol: 'TSLA', description: 'Tesla, Inc.' },
}

export const StockSelection: React.FC<StepComponentProps> = ({ onNext, onBack }) => {
  const [searchEntry, setSearchEntry] = useState('')
  const [selectedStocks, setSelectedStocks] = useState<IStock[]>([])
  const { toast } = useToast()

  function handleSelectStock(stock: IStock) {
    if (selectedStocks.includes(stock)) {
      setSearchEntry('')
    }
    else {
      selectedStocks.push(stock)
      // TODO: Handle more than 5 stocks
      setSearchEntry('')
    }
  }

  function handleRemoveStock(stock: IStock) {
    setSelectedStocks(selectedStocks.filter(selectedStock => selectedStock !== stock))
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchEntry(event.target.value)
  }

  const handleNextClick = () => {
    if (selectedStocks.length < 1)
      toast({ title: 'Error', description: 'You need to select at least one stock to continue' })
    else
      onNext({ stocks: selectedStocks })
  }

  const filteredStocks = Object.keys(stockList).filter(
    key =>
      stockList[key].name.toLowerCase().includes(searchEntry.toLowerCase())
      || stockList[key].symbol.toLowerCase().includes(searchEntry.toLowerCase()),
  )
  return (
    <Card className="w-[650px]">
      <CardHeader>
        <CardTitle>Stocks</CardTitle>
        <CardDescription>Please enter some stocks you find interesting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Stock Name or Symbol"
              value={searchEntry}
              onChange={handleSearch}
            />
            {searchEntry && (
              <div className="absolute mt-2 w-full rounded-md bg-background z-10">
                {/* TODO: Handle more than 5 stocks in array */}
                {filteredStocks.slice(0, 5).map(key => (
                  <div
                    key={key}
                    className="p-2  cursor-pointer"
                    onClick={() => handleSelectStock(stockList[key])}
                  >
                    {stockList[key].name}
                    {' '}
                    (
                    {stockList[key].symbol}
                    )
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap mt-4">
              {selectedStocks.map(stock => (
                <div
                  key={stock.symbol}
                  className="flex items-center m-1 border p-2 rounded cursor-pointer "
                  onClick={() => handleRemoveStock(stock)}
                >
                  {stock.name}
                  {' '}
                  (
                  {stock.symbol}
                  )
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleNextClick}>Calculate a Portfolio</Button>
      </CardFooter>
    </Card>
  )
}
