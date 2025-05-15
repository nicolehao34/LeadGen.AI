import React from 'react';
import { cn } from '@/lib/utils';
import { useWorkflow } from '@/context/WorkflowContext';
import { type Step } from '@/types';

interface WorkflowStepProps {
  step: Step;
  number: number;
  label: string;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, number, label }) => {
  const { currentStep, setCurrentStep } = useWorkflow();
  const isActive = currentStep === step;

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentStep(step);
      }}
      className={cn(
        isActive ? 'step-active border-b-2 border-primary-600 text-primary-600 font-semibold' : 'text-neutral-500 hover:text-neutral-700 border-b-2 border-transparent',
        'whitespace-nowrap py-4 px-1 text-sm font-medium flex items-center'
      )}
    >
      <span
        className={cn(
          isActive ? 'bg-primary-600 text-white shadow-sm' : 'bg-neutral-200 text-neutral-600',
          'h-6 w-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold transition-colors duration-200'
        )}
      >
        {number}
      </span>
      {label}
    </a>
  );
};

const WorkflowSteps: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8" aria-label="Workflow Steps">
          <WorkflowStep step="icp" number={1} label="Login & ICP Selection" />
          <WorkflowStep step="event" number={2} label="Target Event" />
          <WorkflowStep step="filters" number={3} label="Configure Filters" />
          <WorkflowStep step="generate" number={4} label="Generate Leads" />
          <WorkflowStep step="review" number={5} label="Review Output" />
          <WorkflowStep step="export" number={6} label="Export" />
        </nav>
      </div>
    </div>
  );
};

export default WorkflowSteps;
