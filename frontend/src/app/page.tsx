'use client'
import {
  Box, Flex, Input,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'

const styles = {
  resultListWrapper: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    zIndex: 1,
    borderRadius: '4px',
    overflow: 'hidden',
  },
  resultList: {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '0.5rem',
  },
}

interface IStock {
  name: string
  symbol: string
  description: string
}

interface IStockDictionary {
  [id: string]: IStock
}

const stockList: IStockDictionary = {
  AAPL: { name: 'Apple', symbol: 'AAPL', description: 'Apple Inc.' },
  MSFT: { name: 'Microsoft', symbol: 'MSFT', description: 'Microsoft Corporation' },
  AMZN: { name: 'Amazon', symbol: 'AMZN', description: 'Amazon.com, Inc.' },
  GOOG: { name: 'Alphabet', symbol: 'GOOG', description: 'Alphabet Inc.' },
  FB: { name: 'Facebook', symbol: 'FB', description: 'Facebook, Inc.' },
  TSLA: { name: 'Tesla', symbol: 'TSLA', description: 'Tesla, Inc.' },
}

export default function Home() {
  const [searchEntry, setSearchEntry] = useState('')
  const [selectedStocks, setSelectedStocks] = useState<IStock[]>([])

  function handleSelectStock(stock: IStock) {
    if (selectedStocks.includes(stock)) {
      setSearchEntry('')
    }
    else {
      selectedStocks.push(stock)
      setSearchEntry('')
    }
  }

  function handleRemoveStock(stock: IStock) {
    setSelectedStocks(selectedStocks.filter(selectedStock => selectedStock !== stock))
  }

  // 👇️ type as React.ChangeEvent<HTMLInputElement>
  // or React.ChangeEvent<HTMLTextAreaElement> (for textarea elements)
  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchEntry(event.target.value)
  }

  const filteredStocks = Object.keys(stockList).filter(
    key =>
      stockList[key].name.toLowerCase().includes(searchEntry.toLowerCase())
      || stockList[key].symbol.toLowerCase().includes(searchEntry.toLowerCase()),
  )

  return (
    <main>
      <Box p="12">
        <Flex direction="column">
          <Flex justifyContent="flex-start" flexWrap="wrap">
            {selectedStocks.map(stock => (
              <Box
                key={stock.symbol}
                p="0.5rem"
                borderRadius="4px"
                mr="0.5rem"
                mb="0.5rem"
              >
                <Text fontWeight="bold">{stock.name}</Text>
                <SmallCloseIcon onClick={() => handleRemoveStock(stock)} />
              </Box>
            ))}
          </Flex>
          <Flex position="relative" direction="column">
            <Input
              placeholder="Enter the stock name or symbol"
              size="lg"
              onInput={handleSearch}
              value={searchEntry}
            />
            {searchEntry.length > 0 && (
              <Box
                position="absolute"
                top="100%"
                left="0"
                width="100%"
                zIndex="1"
                borderRadius="4px"
                boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                mt="0.5rem"
                p="0.5rem"
                bg="gray.800"
              >
                <UnorderedList listStyleType="none" m={0} p={0}>
                  {filteredStocks.slice(0, 6).map(key => (
                    <ListItem
                      key={key}
                      _hover={{ backgroundColor: 'gray.700', cursor: 'pointer', borderRadius: '4px' }}
                      onClick={() => handleSelectStock(stockList[key])}
                    >
                      <Flex align="center" justify="space-between">
                        <Box>
                          <Text fontWeight="bold">{stockList[key].name}</Text>
                          <Text>{stockList[key].symbol}</Text>
                        </Box>
                        <Box textAlign="right">
                          <Text>{stockList[key].description}</Text>
                        </Box>
                      </Flex>
                    </ListItem>
                  ))}
                </UnorderedList>
              </Box>
            )}
          </Flex>
        </Flex>
      </Box>
    </main>
  )
};
