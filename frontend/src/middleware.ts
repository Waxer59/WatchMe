import { NextResponse } from 'next/server'
import { getPublicEnv } from './helpers/getPublicEnv'

export async function middleware(request: Request) {
  const cookies = request.headers.get('Cookie')

  try {
    const response = await fetch(`${getPublicEnv().BACKEND_URL}/users`, {
      method: 'GET',
      headers: {
        Cookie: cookies ?? ''
      }
    })

    if (response.status === 401) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    console.log(error)
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/settings', '/following']
}
