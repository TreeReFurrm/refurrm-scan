import { DonationCard } from './DonationCard';
import { Heart, Users, Package } from 'lucide-react';

export function DonationHero() {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-primary-600 to-pink-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Help Rescue Storage Units & Reunite Families
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Every donation helps us discover, sort, and return sentimental items to families who lost everything in storage auctions.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-4 mb-2">
                  <Package className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-3xl font-bold">1,247</div>
                <div className="text-sm text-blue-100">Units Rescued</div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-4 mb-2">
                  <Users className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-3xl font-bold">892</div>
                <div className="text-sm text-blue-100">Families Helped</div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-4 mb-2">
                  <Heart className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-3xl font-bold">$127K</div>
                <div className="text-sm text-blue-100">Donated</div>
              </div>
            </div>
          </div>

          <div>
            <DonationCard 
              title="Make an Impact Today"
              description="Your donation directly funds rescue operations, AI sorting technology, and family reunification efforts."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
