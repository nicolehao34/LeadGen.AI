import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkflow } from '@/context/WorkflowContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeftIcon, ArrowRightIcon, Search, FileDownIcon, 
  MessagesSquare, Building, User, Link2, Info, RefreshCw, 
  Star, PencilIcon, CheckCircleIcon 
} from 'lucide-react';
import { Lead } from '../../types';
import LeadDetailsModal from './LeadDetailsModal';

const ReviewLeads: React.FC = () => {
  const { currentStep, setCurrentStep, selectedProfile, selectedEvent } = useWorkflow();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Only show this component when on the review step
  const isVisible = currentStep === 'review';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editableMessage, setEditableMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Get leads for the selected profile and event
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
    enabled: isVisible,
  });
  
  // Generate single outreach message
  const generateOutreachMutation = useMutation({
    mutationFn: (leadId: number) => 
      apiRequest('POST', '/api/generate-outreach', { leadId })
        .then(res => res.json()),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: 'Outreach message generated',
        description: 'The personalized message has been created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to generate outreach message: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Update lead status
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Lead> }) => 
      apiRequest('PATCH', `/api/leads/${id}`, data)
        .then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: 'Lead updated',
        description: 'The lead has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update lead: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Update outreach message
  const updateOutreachMutation = useMutation({
    mutationFn: ({ id, message }: { id: number, message: string }) => 
      apiRequest('PATCH', `/api/leads/${id}`, { outreachMessage: message })
        .then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setIsMessageDialogOpen(false);
      toast({
        title: 'Message updated',
        description: 'The outreach message has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update message: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const handleGenerateOutreach = (leadId: number) => {
    generateOutreachMutation.mutate(leadId);
  };
  
  const handleUpdateStatus = (leadId: number, status: string) => {
    updateLeadMutation.mutate({
      id: leadId,
      data: { status }
    });
  };
  
  const openMessageDialog = (lead: Lead) => {
    setSelectedLeadId(lead.id);
    setEditableMessage(lead.outreachMessage || '');
    setIsMessageDialogOpen(true);
  };
  
  // Open the lead details modal
  const openLeadDetailsModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsModalOpen(true);
  };

  // Close the lead details modal
  const closeLeadDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedLead(null);
  };
  
  const saveOutreachMessage = () => {
    if (selectedLeadId && editableMessage.trim()) {
      updateOutreachMutation.mutate({
        id: selectedLeadId,
        message: editableMessage
      });
    }
  };
  
  const handleBack = () => {
    setCurrentStep('generate');
  };
  
  const handleContinue = () => {
    setCurrentStep('export');
  };
  
  // Filter leads based on search term and selected tab
  const filteredLeads = leads
    .filter(lead => 
      (selectedTab === 'all' || lead.status === selectedTab) &&
      (lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       lead.stakeholderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (lead.companyIndustry && lead.companyIndustry.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary" className="bg-neutral-100 text-neutral-800">New</Badge>;
    }
  };
  
  const renderFitScore = (score?: number) => {
    if (!score) return '—';
    
    const stars = [];
    const fullStars = Math.floor(score / 20);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-neutral-300" />);
      }
    }
    
    return (
      <div className="flex items-center">
        <span className="mr-1 font-semibold">{score}%</span>
        <div className="flex">{stars}</div>
      </div>
    );
  };
  
  if (!isVisible) return null;
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-neutral-800 mb-4">Review Output</h2>
        <div className="py-8 text-center">
          <RefreshCw className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading leads...</p>
        </div>
      </div>
    );
  }
  
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-neutral-800 mb-4">Review Output</h2>
        <div className="py-8 text-center">
          <Info className="h-8 w-8 text-primary-600 mx-auto mb-4" />
          <p className="text-neutral-600">No leads generated yet. Go back to the Generate Leads step to create leads.</p>
          <Button className="mt-4" onClick={handleBack}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Generate Leads
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
      <h2 className="text-lg font-medium text-neutral-800 mb-4">Review Output</h2>
      <p className="text-neutral-600 mb-6">
        Review the generated leads and their personalized outreach messages. 
        Approve or reject leads, and edit messages as needed.
      </p>
      
      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search companies or stakeholders..."
            className="pl-10 pr-4 py-2 border border-neutral-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-neutral-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-white">New</TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-white">Approved</TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-white">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Leads Table */}
      <div className="rounded-md border mb-6 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Company & Stakeholder</TableHead>
              <TableHead>Match Reason</TableHead>
              <TableHead className="w-[100px] text-center">Fit Score</TableHead>
              <TableHead className="w-[120px] text-center">Status</TableHead>
              <TableHead className="w-[200px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-neutral-500" />
                        <button 
                          onClick={() => openLeadDetailsModal(lead)}
                          className="font-semibold text-primary-600 hover:text-primary-800 hover:underline text-left"
                        >
                          {lead.companyName}
                        </button>
                      </div>
                      <div className="mt-1 text-sm text-neutral-500">
                        {lead.companyIndustry && `${lead.companyIndustry}${lead.companyLocation ? ` • ${lead.companyLocation}` : ''}`}
                      </div>
                      <div className="flex items-center mt-3">
                        <User className="h-4 w-4 mr-2 text-neutral-500" />
                        <span>{lead.stakeholderName}</span>
                      </div>
                      <div className="text-sm text-neutral-500 ml-6">
                        {lead.stakeholderTitle}
                        {lead.stakeholderLinkedIn && (
                          <a 
                            href={lead.stakeholderLinkedIn} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-blue-600 hover:underline ml-2"
                          >
                            <Link2 className="h-3 w-3 mr-1" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-neutral-600">
                      {lead.matchReason || 'No match reason available'}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {renderFitScore(lead.fitScore)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(lead.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {lead.outreachMessage ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600"
                          onClick={() => openMessageDialog(lead)}
                        >
                          <MessagesSquare className="h-4 w-4 mr-1" /> View
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGenerateOutreach(lead.id)}
                          disabled={generateOutreachMutation.isPending}
                        >
                          <MessagesSquare className="h-4 w-4 mr-1" /> 
                          {generateOutreachMutation.isPending ? 'Generating...' : 'Generate'}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-green-600"
                        onClick={() => handleUpdateStatus(lead.id, 'approved')}
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                  No leads match your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Summary Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lead Generation Summary</CardTitle>
          <CardDescription>Overview of your lead generation campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4">
              <div className="text-sm text-neutral-500 mb-1">Total Leads</div>
              <div className="text-2xl font-semibold">{leads.length}</div>
            </div>
            <div className="border rounded-md p-4">
              <div className="text-sm text-neutral-500 mb-1">Approved Leads</div>
              <div className="text-2xl font-semibold">
                {leads.filter(lead => lead.status === 'approved').length}
              </div>
            </div>
            <div className="border rounded-md p-4">
              <div className="text-sm text-neutral-500 mb-1">Average Fit Score</div>
              <div className="text-2xl font-semibold">
                {Math.round(
                  leads.reduce((sum, lead) => sum + (lead.fitScore || 0), 0) / leads.length
                )}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-200">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleContinue} disabled={leads.length === 0}>
          Continue to Export <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {/* Edit Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Personalized Outreach Message</DialogTitle>
            <DialogDescription>
              Review and edit the AI-generated outreach message
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            className="min-h-[200px] font-medium"
            value={editableMessage}
            onChange={(e) => setEditableMessage(e.target.value)}
          />
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsMessageDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveOutreachMessage}
              disabled={updateOutreachMutation.isPending}
            >
              {updateOutreachMutation.isPending ? 'Saving...' : 'Save Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead Details Modal */}
      <LeadDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={closeLeadDetailsModal}
        lead={selectedLead}
      />
    </div>
  );
};

export default ReviewLeads;