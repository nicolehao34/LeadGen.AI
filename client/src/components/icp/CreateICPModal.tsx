import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface CreateICPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  userId: z.number(),
  name: z.string().min(2, { message: 'Profile name must be at least 2 characters' }),
  industry: z.string().min(1, { message: 'Please select an industry' }),
  subIndustry: z.string().optional(),
  minRevenue: z.string().min(1, { message: 'Please select minimum revenue' }),
  maxRevenue: z.string().min(1, { message: 'Please select maximum revenue' }),
  geography: z.string().min(1, { message: 'Please select a geography' }),
  minEmployees: z.string().min(1, { message: 'Please select minimum employees' }),
  maxEmployees: z.string().min(1, { message: 'Please select maximum employees' }),
  additionalCriteria: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreateICPModal: React.FC<CreateICPModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: 1, // Default user ID
      name: '',
      industry: 'Software & Technology',
      subIndustry: '',
      minRevenue: '$0',
      maxRevenue: '$1M',
      geography: 'Global',
      minEmployees: '1',
      maxEmployees: '10',
      additionalCriteria: '',
    },
  });
  
  const createProfile = useMutation({
    mutationFn: (data: FormData) => 
      apiRequest('POST', '/api/icp-profiles', data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/icp-profiles'] });
      toast({
        title: 'Profile Created',
        description: 'Your ICP profile has been created successfully',
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create profile: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const handleSubmit = (data: FormData) => {
    createProfile.mutate(data);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Ideal Customer Profile</DialogTitle>
          <DialogDescription>
            Define your ideal customer profile to target specific companies
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Enterprise SaaS Companies" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Software & Technology">Software & Technology</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Financial Services">Financial Services</SelectItem>
                        <SelectItem value="Retail & E-commerce">Retail & E-commerce</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subIndustry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Industry (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., CRM Software" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-1">Annual Revenue Range</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Minimum Revenue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="$0">$0</SelectItem>
                          <SelectItem value="$1M">$1M</SelectItem>
                          <SelectItem value="$5M">$5M</SelectItem>
                          <SelectItem value="$10M">$10M</SelectItem>
                          <SelectItem value="$50M">$50M</SelectItem>
                          <SelectItem value="$100M">$100M</SelectItem>
                          <SelectItem value="$500M">$500M</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Maximum Revenue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="$1M">$1M</SelectItem>
                          <SelectItem value="$5M">$5M</SelectItem>
                          <SelectItem value="$10M">$10M</SelectItem>
                          <SelectItem value="$50M">$50M</SelectItem>
                          <SelectItem value="$100M">$100M</SelectItem>
                          <SelectItem value="$500M">$500M</SelectItem>
                          <SelectItem value="$1B+">$1B+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="geography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geography</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select geography" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Global">Global</SelectItem>
                      <SelectItem value="North America">North America</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <Label className="block text-sm font-medium mb-1">Company Size (Employees)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minEmployees"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Minimum Employees" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                          <SelectItem value="1,000">1,000</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxEmployees"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Maximum Employees" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                          <SelectItem value="1,000">1,000</SelectItem>
                          <SelectItem value="10,000+">10,000+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="additionalCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Criteria (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="E.g., Using specific technologies, recent funding, growth rate"
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex justify-between items-center pt-4 border-t border-neutral-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <div>
                <Button type="button" variant="outline" className="mr-3">
                  Save as Draft
                </Button>
                <Button type="submit" disabled={createProfile.isPending}>
                  {createProfile.isPending ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateICPModal;
