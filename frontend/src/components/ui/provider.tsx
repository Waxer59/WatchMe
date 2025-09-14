'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode'
import { useEffect } from 'react'
import { useAccountStore } from '@/store/account'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { Toaster } from './toaster'

export function Provider(props: ColorModeProviderProps) {
  const setUsername = useAccountStore((state) => state.setUsername)
  const setAvatar = useAccountStore((state) => state.setAvatar)
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn)
  const setStreamKeys = useAccountStore((state) => state.setStreamKeys)
  const clearAccount = useAccountStore((state) => state.clear)

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(getPublicEnv().BACKEND_URL + '/users', {
        credentials: 'include'
      })
      const data = await response.json()
      setUsername(data.username)
      setAvatar(data.avatar)
      setStreamKeys(data.stream_keys)
      setIsLoggedIn(true)
      localStorage.setItem('isLoggedIn', 'true')
    }

    window.addEventListener('storage', (event) => {
      if (event.key === 'isLoggedIn') {
        if (event.newValue === 'true') {
          window.location.reload()
        } else {
          clearAccount()
        }
      }
    })

    getUserData()
  }, [])

  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
      <Toaster />
    </ChakraProvider>
  )
}
