import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ICPProfile } from '@/types';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { BuildingIcon, ClockIcon, PencilIcon, CopyIcon, MessageCircleQuestion, ArrowRightIcon, PlusIcon } from 'lucide-react';

interface ICPSelectionProps {
  openCreateModal: () => void;
}

const ICPSelection: React.FC<ICPSelectionProps> = ({ openCreateModal }) => {
  const { setCurrentStep, setSelectedProfile } = useWorkflow();
  
  const { data: profiles, isLoading } = useQuery<ICPProfile[]>({
    queryKey: ['/api/icp-profiles'],
  });
  
  const handleSelectProfile = (profile: ICPProfile) => {
    setSelectedProfile(profile);
  };
  
  const handleContinue = () => {
    setCurrentStep('event');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
      <h2 className="text-lg font-medium text-neutral-800 mb-4">Ideal Customer Profile Selection</h2>
      <p className="text-neutral-600 mb-6">Select an existing ICP or create a new one to target specific companies that match your criteria.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saved Profiles */}
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-3">Saved Profiles</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scroll-hidden">
            {isLoading ? (
              <div className="text-center py-4">Loading profiles...</div>
            ) : profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <div 
                  key={profile.id}
                  className="border border-neutral-200 bg-neutral-50 rounded-md p-4 cursor-pointer hover:border-primary-200 hover:bg-primary-50 transition-colors"
                  onClick={() => handleSelectProfile(profile)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-neutral-800">{profile.name}</h4>
                      <p className="text-sm text-neutral-600 mt-1">
                        {profile.minRevenue}-{profile.maxRevenue} revenue, {profile.geography}
                      </p>
                      <div className="flex mt-2 text-xs text-neutral-500">
                        <span className="mr-2">
                          <BuildingIcon className="inline-block mr-1 h-3 w-3" /> {profile.matchCount} matches
                        </span>
                        <span>
                          <ClockIcon className="inline-block mr-1 h-3 w-3" /> Last used: {
                            profile.lastUsed 
                              ? new Date(profile.lastUsed).toLocaleDateString() !== new Date().toLocaleDateString()
                                ? `${Math.floor((new Date().getTime() - new Date(profile.lastUsed).getTime()) / (1000 * 60 * 60 * 24))} days ago`
                                : 'Today'
                              : 'Never'
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="text-neutral-400 hover:text-neutral-600 p-1" title="Edit profile">
                        <PencilIcon className="h-3 w-3" />
                      </button>
                      <button className="text-neutral-400 hover:text-neutral-600 p-1" title="Clone profile">
                        <CopyIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-neutral-600">No saved profiles yet</div>
            )}
          </div>
        </div>
        
        {/* Create New Profile */}
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-3">Create New Profile</h3>
          <div 
            className="border border-dashed border-neutral-300 rounded-md p-6 bg-white hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer h-full flex flex-col items-center justify-center text-center"
            onClick={openCreateModal}
          >
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <PlusIcon className="h-5 w-5 text-primary-600" />
            </div>
            <h3 className="text-base font-medium text-neutral-800">Create a New ICP</h3>
            <p className="text-sm text-neutral-600 mt-2 max-w-xs">Define your ideal customer profile with industry, revenue, location, and more criteria</p>
            <Button className="mt-4" onClick={openCreateModal}>
              Create New Profile
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-200">
        <Button variant="ghost" className="text-neutral-500 hover:text-neutral-700">
          <MessageCircleQuestion className="mr-1 h-4 w-4" /> Need help defining your ICP?
        </Button>
        <Button onClick={handleContinue}>
          Continue <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ICPSelection;
