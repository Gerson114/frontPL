import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const url = request.nextUrl.clone()
    url.href = `http://localhost:8080${request.nextUrl.pathname.replace('/api', '')}`
    
    const headers = new Headers(request.headers)
    
    return NextResponse.rewrite(url, {
      request: {
        headers: headers,
      },
    })
  }
}

export const config = {
  matcher: '/api/:path*',
}
