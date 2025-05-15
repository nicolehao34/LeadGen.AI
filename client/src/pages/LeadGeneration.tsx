import React, { useState } from 'react';
import Header from '@/components/Header';
import WorkflowSteps from '@/components/workflow/WorkflowSteps';
import ICPSelection from '@/components/icp/ICPSelection';
import CreateICPModal from '@/components/icp/CreateICPModal';
import TargetEventSelector from '@/components/events/TargetEventSelector';
import ConfigureFilters from '@/components/filters/ConfigureFilters';
import GenerateLeads from '@/components/leads/GenerateLeads';
import ReviewLeads from '@/components/leads/ReviewLeads';
import ExportLeads from '@/components/leads/ExportLeads';
import { useWorkflow } from '@/context/WorkflowContext';

const LeadGeneration: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { currentStep } = useWorkflow();
  
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Function to render the current step component
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'icp':
        return <ICPSelection openCreateModal={openCreateModal} />;
      case 'event':
        return <TargetEventSelector />;
      case 'filters':
        return <ConfigureFilters />;
      case 'generate':
        return <GenerateLeads />;
      case 'review':
        return <ReviewLeads />;
      case 'export':
        return <ExportLeads />;
      default:
        return <ICPSelection openCreateModal={openCreateModal} />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-800">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">Lead Generation</h1>
          <p className="text-neutral-600 mt-1">Generate targeted B2B leads based on your ideal customer profile</p>
        </div>
        
        {/* Workflow Steps */}
        <WorkflowSteps />
        
        {/* Current Step Component */}
        {renderCurrentStep()}
        
        {/* Create ICP Modal */}
        <CreateICPModal 
          isOpen={isCreateModalOpen} 
          onClose={closeCreateModal} 
        />
      </main>
    </div>
  );
};

export default LeadGeneration;