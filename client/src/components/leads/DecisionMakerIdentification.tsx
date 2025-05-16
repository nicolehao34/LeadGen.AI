import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, LinkedinIcon, Search, ExternalLink, Users, Filter } from 'lucide-react';

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
  selected: boolean;
}

interface DecisionMakerIdentificationProps {
  onSelectDecisionMakers: (decisionMakers: DecisionMaker[]) => void;
}

const mockDecisionMakers: DecisionMaker[] = [
  {
    id: '1',
    name: 'Laura Noll',
    title: 'Vice President, Materials Science',
    company: 'Avery Dennison',
    linkedinUrl: 'https://www.linkedin.com/in/laura-noll-6388a55/',
    email: 'laura.noll@example.com',
    phone: '(555) 123-4567',
    relevanceScore: 92,
    qualifications: [
      'Leads R&D for protective films',
      'Background in materials science',
      'Decision-maker for coatings solutions',
      'Previous experience with DuPont products',
    ],
    selected: false
  },
  {
    id: '2',
    name: 'James Wilson',
    title: 'Director of Innovation',
    company: '3M Graphics',
    linkedinUrl: 'https://www.linkedin.com/in/james-wilson-example/',
    email: 'jwilson@example.com',
    relevanceScore: 88,
    qualifications: [
      'Leads product innovation team',
      'Focus on weather-resistant solutions',
      'Oversees material selection',
      'Research in sustainable materials',
    ],
    selected: false
  },
  {
    id: '3',
    name: 'Sarah Chen',
    title: 'Director of Product Development',
    company: 'ORAFOL Americas',
    linkedinUrl: 'https://www.linkedin.com/in/sarah-chen-example/',
    phone: '(555) 987-6543',
    relevanceScore: 85,
    qualifications: [
      'Leads graphic film development',
      'Focus on durability testing',
      'Authority on material selection',
      'Active in industry associations',
    ],
    selected: false
  }
];

const DecisionMakerIdentification: React.FC<DecisionMakerIdentificationProps> = ({ 
  onSelectDecisionMakers 
}) => {
  const [decisionMakers, setDecisionMakers] = useState<DecisionMaker[]>(mockDecisionMakers);
  const [dataSource, setDataSource] = useState<'linkedin' | 'clay'>('linkedin');
  const [searchCriteria, setSearchCriteria] = useState({
    titles: "VP of Product Development, Director of Innovation, R&D Leader, Materials Science",
    companies: "",
    minimumRelevance: 80,
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSelectAll = (selected: boolean) => {
    setDecisionMakers(decisionMakers.map(dm => ({ ...dm, selected })));
  };

  const handleSelect = (id: string, selected: boolean) => {
    setDecisionMakers(decisionMakers.map(dm => 
      dm.id === id ? { ...dm, selected } : dm
    ));
  };

  const handleConfirmSelection = () => {
    const selectedDMs = decisionMakers.filter(dm => dm.selected);
    onSelectDecisionMakers(selectedDMs);
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    // In a real implementation, this would make an API call to LinkedIn or Clay
    setTimeout(() => {
      setIsSearching(false);
      // Data would be returned from the API and set here
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Decision-Maker Identification</CardTitle>
            <CardDescription>
              Identify and qualify decision makers from target companies
            </CardDescription>
          </div>
          <Tabs defaultValue="linkedin" onValueChange={(val) => setDataSource(val as 'linkedin' | 'clay')}>
            <TabsList>
              <TabsTrigger value="linkedin">
                <LinkedinIcon className="h-4 w-4 mr-2" /> LinkedIn Sales Navigator
              </TabsTrigger>
              <TabsTrigger value="clay">
                <Users className="h-4 w-4 mr-2" /> Clay API
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Search Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titles">Target Job Titles</Label>
              <Input
                id="titles"
                placeholder="Enter job titles separated by commas"
                value={searchCriteria.titles}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, titles: e.target.value })}
              />
              <p className="text-xs text-neutral-500">
                Focus on roles like VPs of Product Development, Directors of Innovation, and R&D leaders
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companies">Target Companies (Optional)</Label>
              <Input
                id="companies"
                placeholder="Enter specific companies"
                value={searchCriteria.companies}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, companies: e.target.value })}
              />
              <p className="text-xs text-neutral-500">
                Leave blank to search across all event-related companies
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="relevance-threshold">Minimum Relevance Score</Label>
              <span className="text-sm font-medium">{searchCriteria.minimumRelevance}%</span>
            </div>
            <Slider
              id="relevance-threshold"
              min={50}
              max={100}
              step={5}
              value={[searchCriteria.minimumRelevance]}
              onValueChange={(values) => 
                setSearchCriteria({ ...searchCriteria, minimumRelevance: values[0] })
              }
            />
            <p className="text-xs text-neutral-500">
              Higher threshold returns fewer but more relevant decision makers
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <>Searching...</>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find Decision Makers
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Results Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Qualified Decision Makers</h3>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="select-all" 
                checked={decisionMakers.every(dm => dm.selected)}
                onCheckedChange={(checked) => handleSelectAll(checked === true)}
              />
              <Label htmlFor="select-all" className="text-xs">Select All</Label>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name & Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-center">Relevance</TableHead>
                  <TableHead>Qualifications</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decisionMakers.map((dm) => (
                  <TableRow key={dm.id}>
                    <TableCell>
                      <Checkbox 
                        checked={dm.selected}
                        onCheckedChange={(checked) => handleSelect(dm.id, checked === true)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{dm.name}</div>
                        <div className="text-sm text-neutral-500">{dm.title}</div>
                        <a 
                          href={dm.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                        >
                          <LinkedinIcon className="h-3 w-3 mr-1" /> LinkedIn Profile
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{dm.company}</TableCell>
                    <TableCell>
                      {dm.email && <div className="text-sm">{dm.email}</div>}
                      {dm.phone && <div className="text-sm">{dm.phone}</div>}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={dm.relevanceScore > 90 ? "default" : "outline"}
                        className={dm.relevanceScore > 90 ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {dm.relevanceScore}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ul className="text-xs space-y-1">
                        {dm.qualifications.map((q, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Refine Search
            </Button>
            <Button onClick={handleConfirmSelection}>
              Confirm Selected Decision Makers
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecisionMakerIdentification;