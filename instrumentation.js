// This file is loaded by Next.js only on the server-side
// It's the proper place to initialize Aikido Security Firewall
// See: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation

export async function register() {
  // Only run on server-side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamic import to ensure it only loads on server
    await import('@aikidosec/firewall')
    console.log('Aikido Security Firewall initialized')
  }
}