import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useRouter } from 'next/router';

interface PaymentSuccessProps {
  type: 'donation' | 'subscription';
  onClose?: () => void;
}

export function PaymentSuccess({ type, onClose }: PaymentSuccessProps) {
  const router = useRouter();

  useEffect(() => {
    // Simple confetti effect
    const duration = 3000;
    const end = Date.now() + duration;
    
    const frame = () => {
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {type === 'donation' ? 'Thank You!' : 'Welcome to Pro!'}
        </h2>
        <p className="text-gray-600 mb-6">
          {type === 'donation' 
            ? 'Your donation has been processed successfully. You\'re helping reunite families with their belongings!'
            : 'Your Pro subscription is now active. Enjoy full access to AI scanning, analytics, and priority support!'}
        </p>
        <div className="flex gap-3">
          <Button 
            onClick={() => router.push('/profile')}
            className="flex-1 bg-[#315E47] hover:bg-[#1C2E25]"
          >
            View Profile
          </Button>
          <Button 
            onClick={onClose || (() => router.push('/'))}
            variant="outline"
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}
