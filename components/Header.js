'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Header() {

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist')
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo on the left */}
          <Link href="/" className="flex items-center">
            <img
              src="/logos/TACO (1).svg"
              alt="Tacoempleos"
              className="h-32 w-auto object-contain"
              style={{ height: '150px' }}
            />
          </Link>

          {/* Navigation and actions on the right */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links - Removed Empleos, Empresas, Recursos */}
            <nav className="hidden lg:flex items-center space-x-6">
              {/* Navigation items removed */}
            </nav>

            {/* CTA Buttons and User Menu */}
            <div className="flex items-center space-x-3">
              {/* Show UserButton when signed in */}
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                      userButtonTrigger: "focus:ring-2 focus:ring-blue-500 rounded-full",
                      userButtonPopoverCard: "shadow-lg",
                      userButtonPopoverFooter: "hidden"
                    }
                  }}
                />
              </SignedIn>
              
              {/* Show buttons when signed out */}
              <SignedOut>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                  >
                    Registrarse
                  </Button>
                </Link>
              </SignedOut>

              {/* Always show Publicar Empleo button */}
              <Button
                size="sm"
                onClick={scrollToWaitlist}
                className="hidden sm:inline-flex"
              >
                Publicar Empleo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}