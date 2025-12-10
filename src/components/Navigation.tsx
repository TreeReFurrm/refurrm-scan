import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { User, LogOut, Settings, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F6F4EE] border-b-2 border-[#C8BFAE] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span className="font-['Poppins'] font-semibold text-2xl text-[#1C2E25]">ReFURRM</span>
        </Link>
        
        <div className="hidden md:flex gap-8 font-['Open_Sans']">
          <Link href="/rescue" className="text-[#1C2E25] hover:text-[#50E3E3] transition font-semibold">
            Donate
          </Link>
          <Link href="/stories" className="text-[#1C2E25] hover:text-[#50E3E3] transition">
            Stories
          </Link>
          <Link href="/marketplace" className="text-[#1C2E25] hover:text-[#50E3E3] transition">
            Marketplace
          </Link>
          <Link href="/shop" className="text-[#1C2E25] hover:text-[#50E3E3] transition">
            Shop
          </Link>
          <Link href="/community" className="text-[#1C2E25] hover:text-[#50E3E3] transition">
            Community
          </Link>
          <Link href="/resources" className="text-[#1C2E25] hover:text-[#50E3E3] transition">
            Resources
          </Link>
          {user && profile?.subscription === 'pro' && (
            <Link href="/scanner" className="text-[#1C2E25] hover:text-[#50E3E3] transition font-semibold">
              Scanner
            </Link>
          )}
          {user && profile?.role === 'admin' && (
            <Link href="/admin" className="text-[#1C2E25] hover:text-[#50E3E3] transition">
              Admin
            </Link>
          )}
        </div>




        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {profile?.full_name || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push('/login')} className="bg-[#315E47] text-[#F6F4EE] hover:bg-[#50E3E3] hover:text-[#1C2E25]">
              Sign In
            </Button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1C2E25]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F4EE] border-t border-[#C8BFAE] py-4">
          <div className="flex flex-col gap-4 px-6">
            <Link href="/rescue" onClick={() => setMobileMenuOpen(false)} className="text-[#1C2E25] hover:text-[#50E3E3] font-semibold">
              Donate
            </Link>
            <Link href="/stories" onClick={() => setMobileMenuOpen(false)} className="text-[#1C2E25] hover:text-[#50E3E3]">
              Stories
            </Link>
            <Link href="/marketplace" onClick={() => setMobileMenuOpen(false)} className="text-[#1C2E25] hover:text-[#50E3E3]">
              Marketplace
            </Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-[#1C2E25] hover:text-[#50E3E3]">
              Shop
            </Link>
            <Link href="/community" onClick={() => setMobileMenuOpen(false)} className="text-[#1C2E25] hover:text-[#50E3E3]">
              Community
            </Link>
            <Link href="/resources" onClick={() => setMobileMenuOpen(false)} className="text-[#1C2E25] hover:text-[#50E3E3]">
              Resources
            </Link>
            {user && profile?.subscription === 'pro' && (
              <Link href="/scanner" onClick={() => setMobileMenuOpen(false)} className="text-[#1C2E25] hover:text-[#50E3E3] font-semibold">
                Scanner
              </Link>
            )}
            {user && profile?.role === 'admin' && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[#1C2E25] hover:text-[#50E3E3]">
                Admin
              </Link>
            )}
          </div>
        </div>
      )}


    </nav>
  );
}
