import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StrategicFiltersProps {
  strategicRelevance: {
    enabled: boolean;
    value: string;
  };
  setStrategicRelevance: (value: { enabled: boolean; value: string }) => void;
  industryEngagement: {
    enabled: boolean;
    value: string;
  };
  setIndustryEngagement: (value: { enabled: boolean; value: string }) => void;
  marketActivity: {
    enabled: boolean;
    value: string;
  };
  setMarketActivity: (value: { enabled: boolean; value: string }) => void;
  relevanceScore: number;
  setRelevanceScore: (value: number) => void;
  companySize: {
    min: string;
    max: string;
  };
  setCompanySize: (value: { min: string; max: string }) => void;
  revenue: {
    min: string;
    max: string;
  };
  setRevenue: (value: { min: string; max: string }) => void;
}

const StrategicFilters: React.FC<StrategicFiltersProps> = ({
  strategicRelevance,
  setStrategicRelevance,
  industryEngagement,
  setIndustryEngagement,
  marketActivity,
  setMarketActivity,
  relevanceScore,
  setRelevanceScore,
  companySize,
  setCompanySize,
  revenue,
  setRevenue
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Strategic Qualification Criteria</CardTitle>
        <CardDescription>
          Define advanced criteria to identify the most strategically relevant leads
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Size Filter */}
        <div className="space-y-3">
          <Label htmlFor="company-size" className="text-sm font-medium">
            Company Size (Employees)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="min-employees" className="text-xs">
                Minimum
              </Label>
              <Select 
                value={companySize.min}
                onValueChange={(value) => setCompanySize({ ...companySize, min: value })}
              >
                <SelectTrigger id="min-employees">
                  <SelectValue placeholder="Min employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+ employees</SelectItem>
                  <SelectItem value="10">10+ employees</SelectItem>
                  <SelectItem value="50">50+ employees</SelectItem>
                  <SelectItem value="100">100+ employees</SelectItem>
                  <SelectItem value="250">250+ employees</SelectItem>
                  <SelectItem value="500">500+ employees</SelectItem>
                  <SelectItem value="1000">1,000+ employees</SelectItem>
                  <SelectItem value="5000">5,000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max-employees" className="text-xs">
                Maximum
              </Label>
              <Select 
                value={companySize.max}
                onValueChange={(value) => setCompanySize({ ...companySize, max: value })}
              >
                <SelectTrigger id="max-employees">
                  <SelectValue placeholder="Max employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">Up to 50 employees</SelectItem>
                  <SelectItem value="100">Up to 100 employees</SelectItem>
                  <SelectItem value="250">Up to 250 employees</SelectItem>
                  <SelectItem value="500">Up to 500 employees</SelectItem>
                  <SelectItem value="1000">Up to 1,000 employees</SelectItem>
                  <SelectItem value="5000">Up to 5,000 employees</SelectItem>
                  <SelectItem value="10000">Up to 10,000 employees</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Revenue Filter */}
        <div className="space-y-3">
          <Label htmlFor="revenue" className="text-sm font-medium">
            Annual Revenue
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="min-revenue" className="text-xs">
                Minimum
              </Label>
              <Select 
                value={revenue.min}
                onValueChange={(value) => setRevenue({ ...revenue, min: value })}
              >
                <SelectTrigger id="min-revenue">
                  <SelectValue placeholder="Min revenue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">$0+</SelectItem>
                  <SelectItem value="1000000">$1M+</SelectItem>
                  <SelectItem value="5000000">$5M+</SelectItem>
                  <SelectItem value="10000000">$10M+</SelectItem>
                  <SelectItem value="50000000">$50M+</SelectItem>
                  <SelectItem value="100000000">$100M+</SelectItem>
                  <SelectItem value="500000000">$500M+</SelectItem>
                  <SelectItem value="1000000000">$1B+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max-revenue" className="text-xs">
                Maximum
              </Label>
              <Select 
                value={revenue.max}
                onValueChange={(value) => setRevenue({ ...revenue, max: value })}
              >
                <SelectTrigger id="max-revenue">
                  <SelectValue placeholder="Max revenue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000000">Up to $1M</SelectItem>
                  <SelectItem value="5000000">Up to $5M</SelectItem>
                  <SelectItem value="10000000">Up to $10M</SelectItem>
                  <SelectItem value="50000000">Up to $50M</SelectItem>
                  <SelectItem value="100000000">Up to $100M</SelectItem>
                  <SelectItem value="500000000">Up to $500M</SelectItem>
                  <SelectItem value="1000000000">Up to $1B</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Strategic Relevance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="strategic-relevance" 
              checked={strategicRelevance.enabled}
              onCheckedChange={(checked) => 
                setStrategicRelevance({ 
                  ...strategicRelevance, 
                  enabled: checked === true 
                })
              }
            />
            <Label htmlFor="strategic-relevance" className="text-sm font-medium">
              Strategic Relevance
            </Label>
          </div>
          <Select 
            disabled={!strategicRelevance.enabled}
            value={strategicRelevance.value}
            onValueChange={(value) => setStrategicRelevance({ ...strategicRelevance, value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select strategic relevance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="major_player">Major player in signage/graphics industry</SelectItem>
              <SelectItem value="innovative">Known for material innovation</SelectItem>
              <SelectItem value="growth">Expanding in areas aligned with Tedlar</SelectItem>
              <SelectItem value="partner">Potential strategic partnership</SelectItem>
              <SelectItem value="competitor">Competitor using alternative solutions</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-500">
            Identifies companies that are significant players in the signage and graphics industry with overlap in 
            applications for Tedlar's protective films.
          </p>
        </div>

        {/* Industry Engagement */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="industry-engagement" 
              checked={industryEngagement.enabled}
              onCheckedChange={(checked) => 
                setIndustryEngagement({ 
                  ...industryEngagement, 
                  enabled: checked === true 
                })
              }
            />
            <Label htmlFor="industry-engagement" className="text-sm font-medium">
              Industry Engagement
            </Label>
          </div>
          <Select 
            disabled={!industryEngagement.enabled}
            value={industryEngagement.value}
            onValueChange={(value) => setIndustryEngagement({ ...industryEngagement, value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry engagement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trade_shows">Exhibits at key trade shows</SelectItem>
              <SelectItem value="association">Active in industry associations</SelectItem>
              <SelectItem value="speaking">Presents at industry conferences</SelectItem>
              <SelectItem value="research">Participates in industry research</SelectItem>
              <SelectItem value="leadership">Industry thought leadership</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-500">
            Targets companies that exhibit at key trade shows like ISA Sign Expo and are active in relevant industry associations.
          </p>
        </div>

        {/* Market Activity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="market-activity" 
              checked={marketActivity.enabled}
              onCheckedChange={(checked) => 
                setMarketActivity({ 
                  ...marketActivity, 
                  enabled: checked === true 
                })
              }
            />
            <Label htmlFor="market-activity" className="text-sm font-medium">
              Market Activity
            </Label>
          </div>
          <Select 
            disabled={!marketActivity.enabled}
            value={marketActivity.value}
            onValueChange={(value) => setMarketActivity({ ...marketActivity, value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select market activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expansion">Expanding into durable materials</SelectItem>
              <SelectItem value="innovation">Launching weather-resistant products</SelectItem>
              <SelectItem value="sustainability">Focusing on sustainability</SelectItem>
              <SelectItem value="acquisition">Recent acquisitions in related areas</SelectItem>
              <SelectItem value="research">R&D in protective solutions</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-500">
            Identifies companies expanding into durable, weather-resistant graphic films, which aligns with Tedlar's value proposition.
          </p>
        </div>

        {/* Minimum Relevance Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="relevance-score" className="text-sm font-medium">
              Minimum Strategic Relevance Score
            </Label>
            <span className="text-sm font-medium">{relevanceScore}%</span>
          </div>
          <Slider
            id="relevance-score"
            min={0}
            max={100}
            step={5}
            value={[relevanceScore]}
            onValueChange={(values) => setRelevanceScore(values[0])}
            className="w-full"
          />
          <p className="text-xs text-neutral-500">
            Set minimum match score required for strategic qualification. Higher scores indicate better alignment with DuPont Tedlar's target profile.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategicFilters;