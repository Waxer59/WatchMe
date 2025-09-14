import { Box } from '@chakra-ui/react'
import { Navbar } from '@/components/navbar/navbar'
import { Sidebar } from '@/components/sidebar/sidebar'
import '../../styles/globals.css'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <Box as="div" display="flex" width="full" height="full">
        <Sidebar />
        <Box
          as="div"
          display="flex"
          flexDirection="column"
          width="full"
          padding="4"
          className="bg-gray-900 p-6 overflow-auto">
          {children}
        </Box>
      </Box>
    </>
  )
}
