'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, baseTheme, extendBaseTheme } from '@chakra-ui/react'
import React from 'react'

// const theme = extendBaseTheme(
//   {
//     colors: {
//       primary: baseTheme.colors.orange,
//     },
//   },
//   baseTheme,
// )

export function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CacheProvider>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}
