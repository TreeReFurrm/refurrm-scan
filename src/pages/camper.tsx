import { CamperHero } from '@/components/camper/CamperHero';
import { CamperSchedule } from '@/components/camper/CamperSchedule';
import { PopUpGallery } from '@/components/camper/PopUpGallery';
import { CamperMap } from '@/components/camper/CamperMap';
import { RequestVisitForm } from '@/components/camper/RequestVisitForm';

export default function MobileCamper() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CamperHero />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <CamperSchedule />
          </div>
          <div>
            <CamperMap />
          </div>
        </div>

        <div className="mb-12">
          <PopUpGallery />
        </div>


        <div className="max-w-2xl mx-auto">
          <RequestVisitForm />
        </div>
      </div>
    </div>
  );
}
