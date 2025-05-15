import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkflow } from '@/context/WorkflowContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon, ArrowRightIcon, PencilIcon, BoltIcon, AlertCircle, Loader2 } from 'lucide-react';

const GenerateLeads: React.FC = () => {
  const { 
    currentStep, 
    setCurrentStep, 
    selectedProfile, 
    selectedEvent, 
    personas,
    leadCount,
    setLeadCount,
    generateMessages,
    setGenerateMessages,
    includeEnrichment,
    setIncludeEnrichment 
  } = useWorkflow();
  
  // Only show this component when on the generate step
  const isVisible = currentStep === 'generate';
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const generateLeadsMutation = useMutation({
    mutationFn: async (data: {
      icpProfileId: number;
      eventId: number;
      personaIds: number[];
      count: number;
      includeEnrichment: boolean;
      generateMessages: boolean;
      filters?: {
        technologies?: string[];
        fundingStatus?: string;
        growth?: string;
        recentEvents?: string[];
        keywords?: string[];
      };
    }) => {
      try {
        const response = await apiRequest('POST', '/api/generate-leads', data);
        
        // Handle non-OK responses with detailed error information
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to generate leads');
        }
        
        return response.json();
      } catch (error) {
        // Re-throw with more specific error if possible
        if (error instanceof Error) {
          if (error.message.includes('API key')) {
            throw new Error('Invalid OpenAI API key. Please update your API key in the environment variables.');
          }
          throw error;
        }
        throw new Error('An unknown error occurred');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: 'Lead generation complete',
        description: `Successfully generated ${data.length} leads.`,
      });
      setCurrentStep('review');
    },
    onError: (error) => {
      // Check for specific error types
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate leads';
      
      // Display appropriate error message based on the error
      if (errorMessage.includes('API key') || errorMessage.includes('invalid API key')) {
        toast({
          title: 'API Key Error',
          description: 'The OpenAI API key is invalid or missing. Please contact the administrator to update it.',
          variant: 'destructive',
        });
      } else if (errorMessage.includes('quota exceeded')) {
        toast({
          title: 'OpenAI API Quota Exceeded',
          description: 'Your OpenAI account has reached its quota limit. Please check your billing details.',
          variant: 'destructive',
        });
      } else if (errorMessage.includes('rate limit')) {
        toast({
          title: 'Rate Limit Exceeded',
          description: 'Too many requests to the OpenAI API. Please wait a few minutes and try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error generating leads',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
  });
  
  const handleContinue = () => {
    if (!selectedProfile?.id || !selectedEvent?.id) {
      toast({
        title: 'Missing information',
        description: 'Please select an ICP profile and event before generating leads.',
        variant: 'destructive',
      });
      return;
    }
    
    if (personas.length === 0) {
      toast({
        title: 'Missing information',
        description: 'Please add at least one persona before generating leads.',
        variant: 'destructive',
      });
      return;
    }
    
    const personaIds = personas
      .filter(p => p.id) // Only use personas that have IDs (saved to the database)
      .map(p => p.id as number);
    
    if (personaIds.length === 0) {
      toast({
        title: 'Personas not saved',
        description: 'Your personas need to be saved to the database first.',
        variant: 'destructive',
      });
      return;
    }
    
    generateLeadsMutation.mutate({
      icpProfileId: selectedProfile.id,
      eventId: selectedEvent.id,
      personaIds,
      count: leadCount,
      includeEnrichment,
      generateMessages
    });
  };
  
  const handleBack = () => {
    setCurrentStep('filters');
  };
  
  const handleEditSettings = () => {
    // Go back to ICP selection
    setCurrentStep('icp');
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
      <h2 className="text-lg font-medium text-neutral-800 mb-4">Generate Leads</h2>
      <p className="text-neutral-600 mb-6">Review your settings and trigger the AI-powered lead generation process.</p>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">OpenAI API Required</h4>
            <p className="text-blue-700">
              This feature requires a valid OpenAI API key to generate leads.
              If you encounter API key errors, please ensure you have:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-700">
              <li>Added your OpenAI API key to the environment variables</li>
              <li>Confirmed your API key has sufficient quota available</li>
              <li>Checked for any rate limiting issues if you're making multiple requests</li>
            </ul>
          </div>
        </div>
      </div>
        
      <Card className="border border-neutral-200 rounded-md p-5 bg-neutral-50 mb-6">
        <h3 className="text-sm font-semibold text-neutral-800 mb-4">Campaign Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-xs font-medium text-neutral-500 uppercase">Ideal Customer Profile</h4>
            <p className="text-sm font-medium text-neutral-800 mt-1">{selectedProfile?.name || 'No profile selected'}</p>
            <p className="text-xs text-neutral-600 mt-1">
              {selectedProfile ? `${selectedProfile.minRevenue}-${selectedProfile.maxRevenue} revenue, ${selectedProfile.geography}` : ''}
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-neutral-500 uppercase">Target Event</h4>
            <p className="text-sm font-medium text-neutral-800 mt-1">{selectedEvent?.name || 'No event selected'}</p>
            <p className="text-xs text-neutral-600 mt-1">
              {selectedEvent ? `${selectedEvent.date} • ${selectedEvent.location}` : ''}
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-neutral-500 uppercase">Target Personas</h4>
            <p className="text-sm font-medium text-neutral-800 mt-1">
              {personas.length > 0 
                ? personas.map(p => p.type).join(', ')
                : 'No personas selected'
              }
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              {personas.length > 0
                ? personas.flatMap(p => p.titles.split(', ')).slice(0, 3).join(', ') + (personas.flatMap(p => p.titles.split(', ')).length > 3 ? ', etc.' : '')
                : ''
              }
            </p>
          </div>
        </div>
        
        <Button 
          variant="link" 
          className="mt-4 p-0 h-auto text-primary-600"
          onClick={handleEditSettings}
        >
          <PencilIcon className="mr-1 h-3 w-3" /> Edit Settings
        </Button>
      </Card>
      
      <Card className="border border-neutral-200 rounded-md p-5">
        <h3 className="text-sm font-semibold text-neutral-800 mb-4">Generation Options</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-neutral-800">Number of Leads to Generate</h4>
              <p className="text-xs text-neutral-600 mt-1">How many qualified leads would you like to receive</p>
            </div>
            <Select 
              value={leadCount.toString()} 
              onValueChange={(value) => setLeadCount(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select lead count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 leads</SelectItem>
                <SelectItem value="50">50 leads</SelectItem>
                <SelectItem value="100">100 leads</SelectItem>
                <SelectItem value="200">200 leads</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <div>
              <h4 className="text-sm font-medium text-neutral-800">Generate Custom Outreach Messages</h4>
              <p className="text-xs text-neutral-600 mt-1">AI will draft personalized outreach messages for each lead</p>
            </div>
            <Switch
              checked={generateMessages}
              onCheckedChange={setGenerateMessages}
            />
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <div>
              <h4 className="text-sm font-medium text-neutral-800">Include Company Enrichment Data</h4>
              <p className="text-xs text-neutral-600 mt-1">Additional data about technology stack, recent news, etc.</p>
            </div>
            <Switch
              checked={includeEnrichment}
              onCheckedChange={setIncludeEnrichment}
            />
          </div>
        </div>
      </Card>
      
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-200">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={generateLeadsMutation.isPending}
        >
          {generateLeadsMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Leads...
            </>
          ) : (
            <>
              Generate Leads <BoltIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GenerateLeads;
