export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/profile/:path*",
        "/consultation/:path*", // Protect consultation as well
    ]
}
