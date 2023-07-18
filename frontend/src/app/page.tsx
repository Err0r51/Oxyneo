'use client'
import {
  Box, Flex, Input,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
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

  // 👇️ type as React.ChangeEvent<HTMLInputElement>
  // or React.ChangeEvent<HTMLTextAreaElement> (for textarea elements)
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchEntry(event.target.value)
    console.log(event.target.value)
  }

  // Filter the stockList based on the searchEntry
  const filteredStocks = Object.keys(stockList).filter(
    key =>
      stockList[key].name.toLowerCase().includes(searchEntry.toLowerCase())
      || stockList[key].symbol.toLowerCase().includes(searchEntry.toLowerCase()),
  )

  return (
    <main>
      <Box p="12">
        <Flex position="relative">
          <Input
            placeholder="Enter the stock name or symbol"
            size="lg"
            onInput={handleChange}
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
      </Box>
    </main>
  )
};
