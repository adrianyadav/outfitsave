"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/80 backdrop-blur-xl border-b border-white/5 py-5 text-white px-6 md:px-12">
      <nav className="flex justify-between items-center font-[var(--font-f-lausanne-400)] text-[var(--font-s-p-small)] max-w-[2000px] mx-auto">
        <Logo variant="header" className="text-white" />

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-12 tracking-wide">
          <Link href="/outfits" className="hover:opacity-70 transition-opacity">
            Browse
          </Link>
          {session ? (
            <>
              <Link href="/my-outfits" className="hover:opacity-70 transition-opacity">
                My Outfits
              </Link>
              <Link href="/settings" className="hover:opacity-70 transition-opacity">
                Settings
              </Link>
              <button
                data-testid="logout-button"
                onClick={() => signOut()}
                className="hover:opacity-70 transition-opacity cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:opacity-70 transition-opacity">
              Sign In
            </Link>
          )}

          {isDevelopment ? (
            <Link href="/docs" className="hover:opacity-70 transition-opacity text-white/50">
              Docs
            </Link>
          ) : null}
        </div>

        {/* Mobile Menu Button - Visible only on mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 -mr-2 rounded-md hover:opacity-70 transition-opacity"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen ? (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 h-screen">
          <div className="px-6 py-8 flex flex-col space-y-6 text-white text-lg font-[var(--font-f-lausanne-400)]">
            <Link href="/outfits" onClick={closeMobileMenu} className="hover:opacity-70 transition-opacity">
              Browse
            </Link>

            {session ? (
              <>
                <Link href="/my-outfits" onClick={closeMobileMenu} className="hover:opacity-70 transition-opacity">
                  My Outfits
                </Link>
                <Link href="/settings" onClick={closeMobileMenu} className="hover:opacity-70 transition-opacity">
                  Settings
                </Link>
                <button
                  data-testid="logout-button-mobile"
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="text-left hover:opacity-70 transition-opacity"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={closeMobileMenu} className="hover:opacity-70 transition-opacity">
                Sign In
              </Link>
            )}

            {isDevelopment && (
              <Link href="/docs" onClick={closeMobileMenu} className="opacity-50 hover:opacity-100 transition-opacity mt-4 border-t border-white/20 pt-4">
                Docs
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
