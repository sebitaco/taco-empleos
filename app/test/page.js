export default function TestPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Test Page for PR
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          This is a placeholder page to test PR and deployment functionality.
        </p>
        <div className="mt-8 p-6 bg-secondary rounded-lg max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <ul className="space-y-2">
            <li>✓ Next.js App Router</li>
            <li>✓ Tailwind CSS</li>
            <li>✓ JavaScript (no TypeScript)</li>
            <li>✓ Ready for Vercel deployment</li>
          </ul>
        </div>
      </div>
    </main>
  )
}