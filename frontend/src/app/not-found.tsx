import { Button } from '@chakra-ui/react'
import { HouseIcon } from 'lucide-react'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border px-8 py-10 shadow-sm bg-gray-800 border-gray-700 overflow-hidden group w-[90%] max-w-md">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-gray-400 text-md">
          The page you are looking for doesn&apos;t exist
        </p>
        <Button
          variant="subtle"
          colorPalette="blue"
          rounded="lg"
          size="lg"
          asChild>
          <Link href="/">
            <HouseIcon size={18} />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
export default NotFound
