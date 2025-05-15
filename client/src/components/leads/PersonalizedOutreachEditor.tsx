import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Wand, 
  RefreshCw, 
  Copy, 
  CheckCheck, 
  Mail,
  Phone,
  LinkedinIcon
} from 'lucide-react';

interface DecisionMaker {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  email?: string;
  phone?: string;
  relevanceScore: number;
  qualifications: string[];
}

interface CompanyInfo {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
}

interface PersonalizedOutreachEditorProps {
  decisionMaker: DecisionMaker;
  companyInfo: CompanyInfo;
  productFit?: string;
  valueProposition?: string;
}

const PersonalizedOutreachEditor: React.FC<PersonalizedOutreachEditorProps> = ({
  decisionMaker,
  companyInfo,
  productFit,
  valueProposition
}) => {
  const [emailTemplate, setEmailTemplate] = useState<string>('');
  const [linkedinTemplate, setLinkedinTemplate] = useState<string>('');
  const [phoneTemplate, setPhoneTemplate] = useState<string>('');
  const [outreachChannel, setOutreachChannel] = useState<'email' | 'linkedin' | 'phone'>('email');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Generate initial templates based on decision maker and company info
    generateTemplates();
  }, [decisionMaker, companyInfo]);

  const generateTemplates = () => {
    setIsGenerating(true);
    
    // This would normally be an API call to OpenAI
    setTimeout(() => {
      // Email Template
      const newEmailTemplate = `Subject: Enhancing ${companyInfo.name}'s Graphics Solutions with DuPont Tedlar®

Dear ${decisionMaker.name},

I hope this email finds you well. Your leadership as ${decisionMaker.title} at ${companyInfo.name} has been impressive, particularly in your focus on durable materials for signage applications.

I'm reaching out because DuPont Tedlar® films offer unique protective properties that could enhance your graphics products with:

• Superior weatherability and UV resistance (15+ year outdoor durability)
• Chemical and anti-graffiti resistance
• Exceptional cleanability while maintaining appearance

${productFit ? productFit : 'Based on your current product offerings, Tedlar® could provide significant value for your weather-resistant graphics applications, potentially extending product lifespan while reducing warranty claims.'}

${valueProposition ? valueProposition : 'Many leading manufacturers have achieved premium positioning by incorporating Tedlar® protective films, resulting in extended product warranties and differentiated offerings.'}

Would you be available for a brief discussion to explore how Tedlar® might complement your materials portfolio? I'd be happy to share some relevant case studies and performance data specific to graphics applications.

Best regards,

John Smith
DuPont Tedlar®
Graphics & Signage Solutions
(555) 123-4567
john.smith@dupont.com`;

      // LinkedIn Template
      const newLinkedinTemplate = `Hi ${decisionMaker.name},

I noticed your impressive work as ${decisionMaker.title} at ${companyInfo.name} and your focus on innovative materials for graphics applications.

I lead business development for DuPont Tedlar® in the graphics sector and wanted to connect regarding our protective films that offer exceptional weatherability, chemical resistance, and UV protection for signage applications.

${productFit ? productFit : 'Your recent developments in durable outdoor solutions align perfectly with our material capabilities.'}

Would you be open to a brief conversation about how leading manufacturers are using Tedlar® to extend product lifespan and reduce warranty claims?

Thanks for considering,
John`;

      // Phone Template
      const newPhoneTemplate = `Hello ${decisionMaker.name},

My name is John Smith from DuPont Tedlar® Graphics & Signage Solutions.

I'm calling because I've been following ${companyInfo.name}'s work in the [specific area] and believe our Tedlar® protective films could complement your current offerings.

${productFit ? productFit : 'Many manufacturers in your space are using our films to enhance weather resistance and extend product lifespan.'}

I'd like to share some specific applications and case studies relevant to your business. Do you have a few minutes to discuss, or would you prefer I send some information via email first?

[If voicemail]: Please feel free to call me back at (555) 123-4567 or email john.smith@dupont.com if you'd like to learn more. Thank you for your time.`;

      setEmailTemplate(newEmailTemplate);
      setLinkedinTemplate(newLinkedinTemplate);
      setPhoneTemplate(newPhoneTemplate);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    let textToCopy = '';
    
    switch (outreachChannel) {
      case 'email':
        textToCopy = emailTemplate;
        break;
      case 'linkedin':
        textToCopy = linkedinTemplate;
        break;
      case 'phone':
        textToCopy = phoneTemplate;
        break;
    }
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personalized Outreach</CardTitle>
        <CardDescription>
          Create and customize outreach messages for {decisionMaker.name} at {companyInfo.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Decision Maker Info Card */}
          <Card className="w-full md:w-1/3 shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base">{decisionMaker.name}</CardTitle>
              <CardDescription>{decisionMaker.title}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="text-sm">{companyInfo.name}</div>
              
              <div className="space-y-2">
                {decisionMaker.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-3.5 w-3.5 mr-2 text-neutral-500" />
                    <span>{decisionMaker.email}</span>
                  </div>
                )}
                
                {decisionMaker.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-3.5 w-3.5 mr-2 text-neutral-500" />
                    <span>{decisionMaker.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <LinkedinIcon className="h-3.5 w-3.5 mr-2 text-neutral-500" />
                  <a 
                    href={decisionMaker.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>
              
              <div className="space-y-1 pt-2">
                <div className="text-xs font-medium">Why {decisionMaker.name} is qualified:</div>
                <ul className="text-xs space-y-1 text-neutral-700 list-disc pl-4">
                  {decisionMaker.qualifications.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Outreach Templates */}
          <div className="w-full md:w-2/3 space-y-4">
            <Tabs defaultValue="email" onValueChange={(val) => setOutreachChannel(val as 'email' | 'linkedin' | 'phone')}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="linkedin">
                  <LinkedinIcon className="h-4 w-4 mr-2" />
                  LinkedIn
                </TabsTrigger>
                <TabsTrigger value="phone">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Script
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="mt-4">
                <Textarea 
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  placeholder="Email template will appear here..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </TabsContent>
              
              <TabsContent value="linkedin" className="mt-4">
                <Textarea 
                  value={linkedinTemplate}
                  onChange={(e) => setLinkedinTemplate(e.target.value)}
                  placeholder="LinkedIn message will appear here..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </TabsContent>
              
              <TabsContent value="phone" className="mt-4">
                <Textarea 
                  value={phoneTemplate}
                  onChange={(e) => setPhoneTemplate(e.target.value)}
                  placeholder="Phone script will appear here..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={generateTemplates}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand className="h-4 w-4 mr-2" />
                    Regenerate
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleCopy}
                disabled={isGenerating}
              >
                {copied ? (
                  <>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Custom Outreach Parameters */}
        <Card className="shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-base">Customize Outreach Parameters</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Product Fit</Label>
              <Textarea 
                placeholder="How Tedlar® specifically fits their needs"
                className="h-28 resize-none"
                value={productFit || ''}
                onChange={(e) => console.log('Update product fit:', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Value Proposition</Label>
              <Textarea 
                placeholder="Specific value Tedlar® can provide to them"
                className="h-28 resize-none"
                value={valueProposition || ''}
                onChange={(e) => console.log('Update value proposition:', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PersonalizedOutreachEditor;