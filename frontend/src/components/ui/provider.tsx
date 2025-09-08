'use client'

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig
} from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode'
import { useEffect } from 'react'
import { useAccountStore } from '@/store/account'
import { getPublicEnv } from '@/helpers/getPublicEnv'

const config = defineConfig({
  preflight: false
})

const system = createSystem(defaultConfig, config)

export function Provider(props: ColorModeProviderProps) {
  const setUsername = useAccountStore((state) => state.setUsername)
  const setAvatar = useAccountStore((state) => state.setAvatar)
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn)
  const clearAccount = useAccountStore((state) => state.clear)

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(getPublicEnv().BACKEND_URL + '/user', {
        credentials: 'include'
      })
      const data = await response.json()
      setUsername(data.username)
      setAvatar(data.avatar)
      setIsLoggedIn(true)
      localStorage.setItem('isLoggedIn', 'true')
    }

    window.addEventListener('storage', (event) => {
      if (event.key === 'isLoggedIn') {
        if (event.newValue === 'true') {
          window.location.reload()
        }else{
          clearAccount()
        }
      }
    })

    getUserData()
  }, [])

  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
