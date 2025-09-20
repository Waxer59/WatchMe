'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import {
  ColorModeProvider,
  type ColorModeProviderProps
} from '../components/ui/color-mode'
import { useEffect } from 'react'
import { useAccountStore } from '@/store/account'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { Toaster } from '../components/ui/toaster'
import { useSocket } from '@/hooks/useSocket'

let isConnectedToSocket = false

export function Provider(props: ColorModeProviderProps) {
  const { connectSocket } = useSocket()
  const setUsername = useAccountStore((state) => state.setUsername)
  const setAvatar = useAccountStore((state) => state.setAvatar)
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn)
  const setStreamKeys = useAccountStore((state) => state.setStreamKeys)
  const setIsLoading = useAccountStore((state) => state.setIsLoading)
  const setId = useAccountStore((state) => state.setId)
  const setFollowing = useAccountStore((state) => state.setFollowing)
  const setDefaultStreamTitle = useAccountStore(
    (state) => state.setDefaultStreamTitle
  )
  const setDefaultStreamCategory = useAccountStore(
    (state) => state.setDefaultStreamCategory
  )
  const setPresenceColor = useAccountStore((state) => state.setPresenceColor)
  const clearAccount = useAccountStore((state) => state.clear)

  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(getPublicEnv().BACKEND_URL + '/users', {
          credentials: 'include'
        })
        const data = await response.json()

        if(response.status !== 200){
          clearAccount()
          return
        }

        setUsername(data.username)
        setAvatar(data.avatar)
        setStreamKeys(data.stream_keys)
        setId(data.id)
        setFollowing(data.following)
        setPresenceColor(data.presence_color)
        setDefaultStreamTitle(data.default_stream_title)
        setDefaultStreamCategory(data.default_stream_category)
        setIsLoggedIn(true)
        localStorage.setItem('isLoggedIn', 'true')
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
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

    if (isConnectedToSocket) {
      return
    }

    connectSocket()
    isConnectedToSocket = true
  }, [])

  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
      <Toaster />
    </ChakraProvider>
  )
}
