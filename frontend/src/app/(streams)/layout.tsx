import { Box } from '@chakra-ui/react'
import { Navbar } from '@/components/navbar/navbar'
import { Sidebar } from '@/components/sidebar/sidebar'
import { getPublicEnv } from '@/helpers/getPublicEnv'

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await fetch(
    `${getPublicEnv().BACKEND_URL}/streams/categories/viewers`,
    {
      method: 'GET',
      credentials: 'include'
    }
  )
    .then((response) => response.json())
    .catch((error) => console.log(error))

  return (
    <>
      <Navbar />
      <Box as="div" display="flex" width="full" height="full">
        <Sidebar categories={categories} />
        <Box
          as="div"
          display="flex"
          flexDirection="column"
          width="full"
          padding="4"
          className="bg-gray-900 p-6">
          {children}
        </Box>
      </Box>
    </>
  )
}
