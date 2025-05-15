import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWorkflow } from '@/context/WorkflowContext';
import ManagePersonas from '../personas/ManagePersonas';
import StrategicFilters from './StrategicFilters';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Persona } from '@/types';

const ConfigureFilters: React.FC = () => {
  const { 
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
    currentStep,
    setCurrentStep
  } = useWorkflow();
  
  const { toast } = useToast();
  
  // Strategic filters state
  const [strategicRelevance, setStrategicRelevance] = useState({
    enabled: true,
    value: 'major_player'
  });
  
  const [industryEngagement, setIndustryEngagement] = useState({
    enabled: true,
    value: 'trade_shows'
  });
  
  const [marketActivity, setMarketActivity] = useState({
    enabled: true,
    value: 'expansion'
  });
  
  const [relevanceScore, setRelevanceScore] = useState(75);
  
  const [companySize, setCompanySize] = useState({
    min: '50',
    max: '5000'
  });
  
  const [revenue, setRevenue] = useState({
    min: '10000000', // $10M
    max: '500000000' // $500M
  });
  
  // Custom keywords
  const [keywords, setKeywords] = useState('');
  
  // Fetch personas from API
  const { data: fetchedPersonas } = useQuery({
    queryKey: ['/api/personas'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/personas');
        if (!response.ok) throw new Error('Failed to fetch personas');
        return response.json();
      } catch (error) {
        console.error('Error fetching personas:', error);
        return [];
      }
    }
  });
  
  // Update local personas when fetched
  useEffect(() => {
    if (fetchedPersonas && fetchedPersonas.length > 0 && personas.length === 0) {
      fetchedPersonas.forEach((persona: Persona) => addPersona(persona));
    }
  }, [fetchedPersonas, addPersona, personas.length]);
  
  const handleUpdatePersonas = (updatedPersonas: Persona[]) => {
    // Clear existing personas
    personas.forEach((_, index) => removePersona(index));
    
    // Add updated personas
    updatedPersonas.forEach(persona => addPersona(persona));
  };
  
  const handleContinue = () => {
    if (personas.length === 0 || personas.some(p => !p.titles || p.titles.trim() === '')) {
      toast({
        title: "Missing Personas",
        description: "Please define at least one persona with job titles before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep('generate');
  };
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Configure Filters & Lead Generation</h1>
      
      {/* Personas Section */}
      <ManagePersonas 
        personas={personas} 
        updatePersonas={handleUpdatePersonas} 
      />
      
      {/* Strategic Filters Section */}
      <StrategicFilters
        strategicRelevance={strategicRelevance}
        setStrategicRelevance={setStrategicRelevance}
        industryEngagement={industryEngagement}
        setIndustryEngagement={setIndustryEngagement}
        marketActivity={marketActivity}
        setMarketActivity={setMarketActivity}
        relevanceScore={relevanceScore}
        setRelevanceScore={setRelevanceScore}
        companySize={companySize}
        setCompanySize={setCompanySize}
        revenue={revenue}
        setRevenue={setRevenue}
      />
      
      {/* Additional Filters */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Additional Filters</CardTitle>
          <CardDescription>
            Further refine your lead search with these optional filters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              placeholder="Enter keywords separated by commas"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <p className="text-xs text-neutral-500">
              Specific terms to look for in company descriptions or news (e.g., "protective films, UV resistance")
            </p>
          </div>
          
          <Separator />
          
          {/* Lead Generation Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Lead Generation Options</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lead-count">Number of Leads to Generate</Label>
                <span className="text-sm font-medium">{leadCount}</span>
              </div>
              <Slider
                id="lead-count"
                min={25}
                max={200}
                step={25}
                value={[leadCount]}
                onValueChange={(values) => setLeadCount(values[0])}
              />
              <p className="text-xs text-neutral-500">
                Adjust the number of leads you want to generate
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enrichment"
                checked={includeEnrichment}
                onCheckedChange={setIncludeEnrichment}
              />
              <Label htmlFor="enrichment">Include Enrichment Data</Label>
            </div>
            <p className="text-xs text-neutral-500 ml-6">
              Adds company technologies, funding info, and recent news
            </p>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="messages"
                checked={generateMessages}
                onCheckedChange={setGenerateMessages}
              />
              <Label htmlFor="messages">Generate Personalized Messages</Label>
            </div>
            <p className="text-xs text-neutral-500 ml-6">
              Creates customized outreach templates for each lead
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          className="mr-2"
          variant="outline"
          onClick={() => setCurrentStep('event')}
        >
          Back
        </Button>
        <Button onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ConfigureFilters;