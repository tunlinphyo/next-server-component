import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAdmin, isUser } from './auth'
import { COOKIE_USER } from './app/(user)/user.const'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { nextUrl, cookies, url } = request

    const onAdmin = nextUrl.pathname.startsWith('/admin')
    
    if (onAdmin) {
        const onAdminLogin = nextUrl.pathname == '/admin/login'
        const adminCookie = cookies.get('admin')
        const isAdminLogined = isAdmin(adminCookie?.value)

        if (onAdminLogin) {
            if (isAdminLogined) return NextResponse.redirect(new URL('/admin', nextUrl))
        } else {
            if (!isAdminLogined) return NextResponse.redirect(new URL('/admin/login', url))
        }
    } else {
        // const onUserLogin = nextUrl.pathname == '/login'
        // const userCookie = cookies.get(COOKIE_USER)
        // const isUserLogin = isUser(userCookie?.value)
        // if (onUserLogin) {
        //     if (isUserLogin) return NextResponse.redirect(new URL('/', nextUrl))
        // } else {
        //     if (!isUserLogin) return NextResponse.redirect(new URL('/login', nextUrl))
        // }
    }

    const response = NextResponse.next()
    return response
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }