import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { nextUrl, cookies, url } = request

    const onAdmin = nextUrl.pathname.startsWith('/admin')
    const onAdminLogin = nextUrl.pathname == '/admin/login'
    const adminCookie = cookies.get('admin')
    const isAdminLogined = !!adminCookie?.value

    if (onAdmin) {
        if (onAdminLogin) {
            if (isAdminLogined) return NextResponse.redirect(new URL('/admin', nextUrl))
        } else {
            if (!isAdminLogined) return NextResponse.redirect(new URL('/admin/login', url))
        }
    }

    const response = NextResponse.next()
    return response
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }