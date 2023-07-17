'use client'
import {
  Box, Flex, Input,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'

// absolut an searchbar
// wenn results > 0 dann visible

const styles = {
  listReset: {
    listStyleType: 'none',
    padding: 0,
  },

}

export default function Home() {
  return (
    <main>
      <Box p="12">
        <Input placeholder='Basic usage' size='lg' />
        <UnorderedList style={styles.listReset}>
          <ListItem>Lorem ipsum dolor sit amet</ListItem>
          <ListItem>Consectetur adipiscing elit</ListItem>
          <ListItem>Integer molestie lorem at massa</ListItem>
          <ListItem>Facilisis in pretium nisl aliquet</ListItem>
        </UnorderedList>
      </Box>

    </main>
  )
}
