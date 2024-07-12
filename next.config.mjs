/** @type {import('next').NextConfig} */

const nextConfig = {
    // ...otras configuraciones
    async rewrites() {
        return [
        {
            source: '/uploads/:path*',
            destination: '/api/upload/:path*',  
        },
        ];
    }, 
};



export default nextConfig;
