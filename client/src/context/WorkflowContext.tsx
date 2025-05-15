import React, { createContext, useState, useContext } from 'react';
import { Step, ICPProfile, Event, Persona } from '@/types';

interface WorkflowContextType {
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  selectedProfile: ICPProfile | null;
  setSelectedProfile: (profile: ICPProfile | null) => void;
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  personas: Persona[];
  addPersona: (persona: Persona) => void;
  removePersona: (index: number) => void;
  updatePersona: (index: number, persona: Persona) => void;
  leadCount: number;
  setLeadCount: (count: number) => void;
  generateMessages: boolean;
  setGenerateMessages: (generate: boolean) => void;
  includeEnrichment: boolean;
  setIncludeEnrichment: (include: boolean) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<Step>('icp');
  const [selectedProfile, setSelectedProfile] = useState<ICPProfile | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [leadCount, setLeadCount] = useState<number>(25);
  const [generateMessages, setGenerateMessages] = useState<boolean>(true);
  const [includeEnrichment, setIncludeEnrichment] = useState<boolean>(true);

  const addPersona = (persona: Persona) => {
    setPersonas([...personas, persona]);
  };

  const removePersona = (index: number) => {
    setPersonas(personas.filter((_, i) => i !== index));
  };

  const updatePersona = (index: number, persona: Persona) => {
    const updatedPersonas = [...personas];
    updatedPersonas[index] = persona;
    setPersonas(updatedPersonas);
  };

  const value = {
    currentStep,
    setCurrentStep,
    selectedProfile,
    setSelectedProfile,
    selectedEvent,
    setSelectedEvent,
    personas,
    addPersona,
    removePersona,
    updatePersona,
    leadCount,
    setLeadCount,
    generateMessages,
    setGenerateMessages,
    includeEnrichment,
    setIncludeEnrichment,
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};

export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};