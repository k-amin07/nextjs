import { NextResponse } from "next/server";

const allowedOrigins = process.env.NODE_ENV === "production" ? ["https://www.yoursite.com"] : ["http://localhost:3000", "https://www.google.com"]

export function middleware(request: Request) {
    // console.log("Middleware")
    // console.log(request.method)
    // console.log(request.url)
    // console.log(request.headers)
    const origin = request.headers.get("origin")
    console.log(origin)
    // if ((origin && !allowedOrigins.includes(origin) )|| !origin) {
    if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request",
            headers: {
                "Content-Type": 'text/plain'
            }
        })
    }
    return NextResponse.next()
}

export const config = {
    matcher: `/api/:path*`
}