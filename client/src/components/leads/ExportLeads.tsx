import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWorkflow } from '@/context/WorkflowContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeftIcon, ArrowRightIcon, FileDownIcon, 
  Check, FileText, Database, ExternalLink
} from 'lucide-react';

interface Lead {
  id: number;
  companyName: string;
  companyWebsite?: string;
  companyIndustry?: string;
  companySize?: string;
  companyRevenue?: string;
  companyLocation?: string;
  stakeholderName: string;
  stakeholderTitle: string;
  stakeholderLinkedIn?: string;
  stakeholderEmail?: string;
  stakeholderPhone?: string;
  matchReason?: string;
  fitScore?: number;
  outreachMessage?: string;
  status: string;
}

const ExportLeads: React.FC = () => {
  const { currentStep, setCurrentStep } = useWorkflow();
  const { toast } = useToast();
  
  // Only show this component when on the export step
  const isVisible = currentStep === 'export';
  
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportOption, setExportOption] = useState('approved');
  const [includeColumns, setIncludeColumns] = useState({
    companyInfo: true,
    stakeholderInfo: true,
    matchReason: true,
    fitScore: true,
    outreachMessage: true,
    enrichmentData: false,
  });
  
  // Get leads for export
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
    enabled: isVisible,
  });
  
  const filteredLeads = leads.filter(lead => {
    if (exportOption === 'approved') return lead.status === 'approved';
    if (exportOption === 'all') return true;
    return false;
  });
  
  const generateCSV = () => {
    // Define CSV headers based on selected columns
    const headers = ['Company Name'];
    if (includeColumns.companyInfo) {
      headers.push('Website', 'Industry', 'Size', 'Revenue', 'Location');
    }
    
    headers.push('Stakeholder Name', 'Title');
    if (includeColumns.stakeholderInfo) {
      headers.push('LinkedIn', 'Email', 'Phone');
    }
    
    if (includeColumns.matchReason) {
      headers.push('Match Reason');
    }
    
    if (includeColumns.fitScore) {
      headers.push('Fit Score');
    }
    
    if (includeColumns.outreachMessage) {
      headers.push('Outreach Message');
    }
    
    // Generate CSV rows
    const csvRows = [headers.join(',')];
    
    filteredLeads.forEach(lead => {
      const row = [
        `"${lead.companyName.replace(/"/g, '""')}"`
      ];
      
      if (includeColumns.companyInfo) {
        row.push(
          lead.companyWebsite ? `"${lead.companyWebsite.replace(/"/g, '""')}"` : '',
          lead.companyIndustry ? `"${lead.companyIndustry.replace(/"/g, '""')}"` : '',
          lead.companySize ? `"${lead.companySize.replace(/"/g, '""')}"` : '',
          lead.companyRevenue ? `"${lead.companyRevenue.replace(/"/g, '""')}"` : '',
          lead.companyLocation ? `"${lead.companyLocation.replace(/"/g, '""')}"` : ''
        );
      }
      
      row.push(
        `"${lead.stakeholderName.replace(/"/g, '""')}"`,
        `"${lead.stakeholderTitle.replace(/"/g, '""')}"`
      );
      
      if (includeColumns.stakeholderInfo) {
        row.push(
          lead.stakeholderLinkedIn ? `"${lead.stakeholderLinkedIn.replace(/"/g, '""')}"` : '',
          lead.stakeholderEmail ? `"${lead.stakeholderEmail.replace(/"/g, '""')}"` : '',
          lead.stakeholderPhone ? `"${lead.stakeholderPhone.replace(/"/g, '""')}"` : ''
        );
      }
      
      if (includeColumns.matchReason) {
        row.push(lead.matchReason ? `"${lead.matchReason.replace(/"/g, '""')}"` : '');
      }
      
      if (includeColumns.fitScore) {
        row.push(lead.fitScore ? `${lead.fitScore}` : '');
      }
      
      if (includeColumns.outreachMessage) {
        row.push(lead.outreachMessage ? `"${lead.outreachMessage.replace(/"/g, '""')}"` : '');
      }
      
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  };
  
  const handleExport = () => {
    try {
      // Generate file content based on format
      let fileContent = '';
      let fileName = '';
      let mimeType = '';
      
      if (exportFormat === 'csv') {
        fileContent = generateCSV();
        fileName = `dupont-tedlar-leads-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else if (exportFormat === 'json') {
        // Create a JSON export by selecting relevant fields
        const jsonData = filteredLeads.map(lead => {
          const result: Record<string, any> = { companyName: lead.companyName };
          
          if (includeColumns.companyInfo) {
            result.companyWebsite = lead.companyWebsite;
            result.companyIndustry = lead.companyIndustry;
            result.companySize = lead.companySize;
            result.companyRevenue = lead.companyRevenue;
            result.companyLocation = lead.companyLocation;
          }
          
          result.stakeholderName = lead.stakeholderName;
          result.stakeholderTitle = lead.stakeholderTitle;
          
          if (includeColumns.stakeholderInfo) {
            result.stakeholderLinkedIn = lead.stakeholderLinkedIn;
            result.stakeholderEmail = lead.stakeholderEmail;
            result.stakeholderPhone = lead.stakeholderPhone;
          }
          
          if (includeColumns.matchReason) {
            result.matchReason = lead.matchReason;
          }
          
          if (includeColumns.fitScore) {
            result.fitScore = lead.fitScore;
          }
          
          if (includeColumns.outreachMessage) {
            result.outreachMessage = lead.outreachMessage;
          }
          
          return result;
        });
        
        fileContent = JSON.stringify(jsonData, null, 2);
        fileName = `dupont-tedlar-leads-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }
      
      // Create and download the file
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export successful',
        description: `${filteredLeads.length} leads exported to ${fileName}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: `Error exporting leads: ${error instanceof Error ? error.message : String(error)}`,
        variant: 'destructive',
      });
    }
  };
  
  const handleBack = () => {
    setCurrentStep('review');
  };
  
  const handleNewCampaign = () => {
    // Reset to the start of the workflow
    setCurrentStep('icp');
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
      <h2 className="text-lg font-medium text-neutral-800 mb-4">Export Leads</h2>
      <p className="text-neutral-600 mb-6">
        Export your qualified leads for use in your CRM system or outreach campaigns.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export Options */}
        <div className="col-span-2">
          <Card className="p-5 border-neutral-200">
            <h3 className="text-base font-medium text-neutral-800 mb-4">Export Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Export Format
                </label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="json">JSON (.json)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Which leads to export?
                </label>
                <Select value={exportOption} onValueChange={setExportOption}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select leads to export" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved leads only</SelectItem>
                    <SelectItem value="all">All leads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Include Columns
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="company-info" 
                      checked={includeColumns.companyInfo}
                      onCheckedChange={(checked) => 
                        setIncludeColumns({...includeColumns, companyInfo: !!checked})
                      }
                    />
                    <label htmlFor="company-info" className="ml-2">
                      Company Details (Website, Industry, Size, etc.)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox 
                      id="stakeholder-info" 
                      checked={includeColumns.stakeholderInfo}
                      onCheckedChange={(checked) => 
                        setIncludeColumns({...includeColumns, stakeholderInfo: !!checked})
                      }
                    />
                    <label htmlFor="stakeholder-info" className="ml-2">
                      Stakeholder Contact Info (LinkedIn, Email, Phone)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox 
                      id="match-reason" 
                      checked={includeColumns.matchReason}
                      onCheckedChange={(checked) => 
                        setIncludeColumns({...includeColumns, matchReason: !!checked})
                      }
                    />
                    <label htmlFor="match-reason" className="ml-2">
                      Match Reason
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox 
                      id="fit-score" 
                      checked={includeColumns.fitScore}
                      onCheckedChange={(checked) => 
                        setIncludeColumns({...includeColumns, fitScore: !!checked})
                      }
                    />
                    <label htmlFor="fit-score" className="ml-2">
                      Fit Score
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox 
                      id="outreach-message" 
                      checked={includeColumns.outreachMessage}
                      onCheckedChange={(checked) => 
                        setIncludeColumns({...includeColumns, outreachMessage: !!checked})
                      }
                    />
                    <label htmlFor="outreach-message" className="ml-2">
                      Personalized Outreach Messages
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox 
                      id="enrichment-data" 
                      checked={includeColumns.enrichmentData}
                      onCheckedChange={(checked) => 
                        setIncludeColumns({...includeColumns, enrichmentData: !!checked})
                      }
                    />
                    <label htmlFor="enrichment-data" className="ml-2">
                      Enrichment Data (Technologies, Funding, News)
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              className="mt-6 w-full" 
              onClick={handleExport} 
              disabled={filteredLeads.length === 0}
            >
              <FileDownIcon className="mr-2 h-4 w-4" /> 
              Export {filteredLeads.length} {exportOption === 'approved' ? 'Approved ' : ''}
              Leads
            </Button>
          </Card>
        </div>
        
        {/* CRM Integration */}
        <div>
          <Card className="p-5 border-neutral-200 h-full">
            <h3 className="text-base font-medium text-neutral-800 mb-4">CRM Integration</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Push your leads directly to your CRM system for seamless sales outreach.
            </p>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" /> Salesforce
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" /> HubSpot
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" /> Pipedrive
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" /> Other CRM
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-neutral-500 border-t pt-4">
              <p className="mb-2">CRM integration will be available soon.</p>
              <p>For now, export your leads and import them manually into your CRM system.</p>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-200">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Review
        </Button>
        <Button onClick={handleNewCampaign}>
          <Check className="mr-2 h-4 w-4" /> Complete & Start New Campaign
        </Button>
      </div>
    </div>
  );
};

export default ExportLeads;