"use client"

import { useAccountStore } from "@/store/account"
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isLoggedIn = useAccountStore((state) => state.isLoggedIn)
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn])

  return children
}