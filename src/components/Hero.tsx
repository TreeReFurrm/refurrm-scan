import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';

export default function Hero() {
  const { user } = useAuth();
  const router = useRouter();

  const scrollToImpact = () => {
    document.getElementById('impact-feed')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (user) {
      scrollToImpact();
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#315E47] to-[#1C2E25]">
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/690c55f62a1c1509e277d961_1762416177586_64be382f.webp"
          alt="Family reunion"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <Logo className="h-24 w-24 mb-8 animate-pulse" />
        <h1 className="font-['Poppins'] text-6xl font-semibold text-[#F6F4EE] mb-4">
          Not Junk. Not Lost.
        </h1>
        <h2 className="font-['Poppins'] text-5xl font-semibold text-[#50E3E3] mb-6">
          ReFURRM.
        </h2>
        <p className="font-['Open_Sans'] text-xl text-[#F6F4EE] max-w-2xl mb-8">
          Restoring Hope in a System Built on Loss
        </p>
        <div className="flex gap-4">
          <button onClick={() => router.push('/rescue')} className="bg-[#50E3E3] text-[#1C2E25] px-8 py-4 rounded-full font-['Poppins'] font-semibold text-lg hover:scale-105 transition-transform">
            Donate Now
          </button>
          <button onClick={handleGetStarted} className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-['Poppins'] font-semibold text-lg hover:scale-105 transition-transform">
            {user ? 'See Our Impact' : 'Get Started'}
          </button>
        </div>

      </div>
    </div>
  );
}
