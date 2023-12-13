import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-hello-from-middleware1', 'hello')

    const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
    })

      // Set a new response header `x-hello-from-middleware2`
    response.headers.set('x-hello-from-middleware2', 'hello')

    return NextResponse.redirect('http://localhost:7080/')
    // return NextResponse.json({ data: 'http://localhost:7080/' })
}

