import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Persona } from "@/types";

interface ManagePersonasProps {
  personas: Persona[];
  updatePersonas: (personas: Persona[]) => void;
}

const defaultPersona: Omit<Persona, 'id'> = {
  type: 'decision_maker',
  titles: '',
  department: 'product_development'
};

const ManagePersonas: React.FC<ManagePersonasProps> = ({ personas, updatePersonas }) => {
  const [editingPersonas, setEditingPersonas] = useState<(Persona | Omit<Persona, 'id'>)[]>(
    personas.length > 0 ? [...personas] : [{ ...defaultPersona }]
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation for saving personas
  const savePersonasMutation = useMutation({
    mutationFn: async (newPersonas: (Persona | Omit<Persona, 'id'>)[]) => {
      const promises = newPersonas.map(persona => {
        // Ensure userId is set
        const personaWithUserId = {
          ...persona,
          userId: persona.userId || 1 // Default to user ID 1 if not set
        };
        
        if ('id' in persona && persona.id) {
          // Update existing persona
          return fetch(`/api/personas/${persona.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personaWithUserId)
          }).then(res => {
            if (!res.ok) {
              throw new Error(`Error updating persona: ${res.statusText}`);
            }
            return res.json();
          });
        } else {
          // Create new persona
          return fetch('/api/personas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personaWithUserId)
          }).then(res => {
            if (!res.ok) {
              throw new Error(`Error creating persona: ${res.statusText}`);
            }
            return res.json();
          });
        }
      });

      return Promise.all(promises);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/personas'] });
      toast({
        title: "Personas saved",
        description: "Your personas have been saved successfully.",
      });
      // Update parent component with saved personas
      updatePersonas(data);
    },
    onError: (error) => {
      toast({
        title: "Error saving personas",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  const handleAddPersona = () => {
    setEditingPersonas([...editingPersonas, { ...defaultPersona }]);
  };

  const handleRemovePersona = (index: number) => {
    const newPersonas = [...editingPersonas];
    newPersonas.splice(index, 1);
    setEditingPersonas(newPersonas);
  };

  const handlePersonaChange = (index: number, field: keyof Omit<Persona, 'id'>, value: string) => {
    const newPersonas = [...editingPersonas];
    newPersonas[index] = {
      ...newPersonas[index],
      [field]: value
    };
    setEditingPersonas(newPersonas);
  };

  const handleSavePersonas = () => {
    // Validate personas
    const invalidIndex = editingPersonas.findIndex(p => !p.titles || p.titles.trim() === '');
    if (invalidIndex !== -1) {
      toast({
        title: "Validation Error",
        description: "Please provide titles for all personas",
        variant: "destructive"
      });
      return;
    }

    savePersonasMutation.mutate(editingPersonas);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Target Stakeholder Personas</CardTitle>
        <CardDescription>
          Define the key stakeholders you want to target at each company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {editingPersonas.map((persona, index) => (
          <div 
            key={index} 
            className="p-4 border rounded-md relative"
          >
            {editingPersonas.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => handleRemovePersona(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`persona-type-${index}`}>Persona Type</Label>
                <Select
                  value={persona.type}
                  onValueChange={(value) => handlePersonaChange(index, 'type', value)}
                >
                  <SelectTrigger id={`persona-type-${index}`}>
                    <SelectValue placeholder="Select persona type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="decision_maker">Decision Maker</SelectItem>
                    <SelectItem value="influencer">Influencer</SelectItem>
                    <SelectItem value="user">End User</SelectItem>
                    <SelectItem value="technical">Technical Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`persona-department-${index}`}>Department</Label>
                <Select
                  value={persona.department}
                  onValueChange={(value) => handlePersonaChange(index, 'department', value)}
                >
                  <SelectTrigger id={`persona-department-${index}`}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product_development">Product Development</SelectItem>
                    <SelectItem value="research_development">Research & Development</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="procurement">Procurement</SelectItem>
                    <SelectItem value="executive">Executive Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`persona-titles-${index}`} className="flex items-center">
                  Job Titles <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id={`persona-titles-${index}`}
                  placeholder="Enter job titles separated by commas (e.g. VP of Product, Director of Innovation)"
                  value={persona.titles}
                  onChange={(e) => handlePersonaChange(index, 'titles', e.target.value)}
                  className="resize-none h-20"
                />
                <p className="text-xs text-neutral-500">
                  Enter specific job titles that you want to target, separated by commas
                </p>
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleAddPersona}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Another Persona
        </Button>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSavePersonas}
          disabled={savePersonasMutation.isPending}
        >
          {savePersonasMutation.isPending ? (
            <>Saving Personas...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Save Personas
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManagePersonas;