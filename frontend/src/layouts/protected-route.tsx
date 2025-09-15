"use client"

import { useAccountStore } from "@/store/account"
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isLoggedIn = useAccountStore((state) => state.isLoggedIn)
  const isLoading = useAccountStore((state) => state.isLoading)
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      router.push('/')
    }
  }, [isLoggedIn, isLoading])

  return children
}