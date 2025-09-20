'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import {
  ColorModeProvider,
  type ColorModeProviderProps
} from '../components/ui/color-mode'
import { Toaster } from '../components/ui/toaster'
import { NavigationEvents } from '@/layouts/navigation-events'
import { SocketProvider } from './socket-provider'
import { AuthProvder } from './auth-provider'

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <NavigationEvents>
        <SocketProvider>
          <AuthProvder>
            <ColorModeProvider {...props} />
            <Toaster />
          </AuthProvder>
        </SocketProvider>
      </NavigationEvents>
    </ChakraProvider>
  )
}
