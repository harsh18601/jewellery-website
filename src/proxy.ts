import { withAuth } from "next-auth/middleware"

export default withAuth(
    function proxy() {
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
        "/consultation/:path*",
    ]
}
