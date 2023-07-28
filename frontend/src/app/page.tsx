'use client'
import {
  Box,
  Button,
  Flex,
  Input,
  ListItem,
  Text,
  UnorderedList,
  useToast,
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'

// const styles = {
//   resultListWrapper: {
//     position: 'absolute',
//     top: '100%',
//     left: 0,
//     width: '100%',
//     zIndex: 1,
//     borderRadius: '4px',
//     overflow: 'hidden',
//   },
//   resultList: {
//     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//     padding: '0.5rem',
//   },
// }

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
  const toast = useToast()

  function handleSelectStock(stock: IStock) {
    if (selectedStocks.includes(stock)) {
      setSearchEntry('')
    }
    else {
      selectedStocks.push(stock)
      setSearchEntry('')
      if (selectedStocks.length > 3) {
        toast({
          title: 'Maximum number of stocks reached',
          // eslint-disable-next-line @typescript-eslint/quotes
          description: "We don't recommend using more than 3 stocks at once.",
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })
      }
    }
  }

  function handleRemoveStock(stock: IStock) {
    setSelectedStocks(selectedStocks.filter(selectedStock => selectedStock !== stock))
  }

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
              <Box onClick={() => handleRemoveStock(stock)}
                display="flex"
                flexDirection="row"
                alignItems='center'
                key={stock.symbol}
                p="0.5rem"
                borderRadius="md"
                borderWidth={2}
                borderColor={'orange.500'}
                _hover={{ background: 'orange.800' }}

                mr="0.5rem"
                mb="0.5rem"
              >
                <Text fontWeight="bold">{stock.name}</Text>
                <SmallCloseIcon />
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
        <Flex direction="row" mt="1rem" justifyContent={'space-between'}>
          <Button variant={'outline'} color={'white'} mt="1rem"> Back </Button>
          <Button variant={'outline'} colorScheme="orange" mt="1rem"> Next </Button>
        </Flex>
      </Box>
    </main>
  )
};
