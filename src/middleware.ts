import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(req) {
        // Custom logic can go here
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    matcher: [
        "/profile/:path*",
        "/consultation/:path*", // Protect consultation as well
    ]
}
