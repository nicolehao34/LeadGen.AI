import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event } from '@/types';
import { useWorkflow } from '@/context/WorkflowContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { 
    BuildingIcon, ArrowRightIcon, ArrowLeftIcon, UploadIcon, 
    RefreshCw, ExternalLink, Globe 
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Main component for selecting a target event
const TargetEventSelector: React.FC = () => {
    // Get workflow state and setters from context
    const { currentStep, setCurrentStep, selectedEvent, setSelectedEvent } = useWorkflow();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    
    // Local UI state for dialogs and selected event for source info
    const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
    const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
    const [selectedEventForSource, setSelectedEventForSource] = useState<Event | null>(null);
    
    // Only show this component if we're on the 'event' step of the workflow
    const isVisible = currentStep === 'event';
    
    // Fetch events from API when visible
    const { data: events = [], isLoading } = useQuery<Event[]>({
        queryKey: ['/api/events'],
        enabled: isVisible,
    });
    
    // Mutation for syncing events from web sources
    const syncEventsMutation = useMutation({
        mutationFn: () => apiRequest('POST', '/api/events/sync').then(res => res.json()),
        onSuccess: (data) => {
            // Invalidate cache and show success toast
            queryClient.invalidateQueries({ queryKey: ['/api/events'] });
            toast({
                title: 'Events synced successfully',
                description: `Found ${data.length} events from industry sources.`,
            });
            setIsSyncDialogOpen(false);
        },
        onError: (error) => {
            // Show error toast
            toast({
                title: 'Error syncing events',
                description: error instanceof Error ? error.message : 'Failed to sync events from web sources.',
                variant: 'destructive',
            });
        },
    });
    
    // Handler for selecting an event
    const handleSelectEvent = (event: Event) => {
        setSelectedEvent(event);
    };
    
    // Move to next workflow step
    const handleContinue = () => {
        setCurrentStep('filters');
    };
    
    // Move to previous workflow step
    const handleBack = () => {
        setCurrentStep('icp');
    };
    
    // Open sync dialog
    const handleSyncEvents = () => {
        setIsSyncDialogOpen(true);
    };
    
    // Confirm sync events (trigger mutation)
    const confirmSyncEvents = () => {
        syncEventsMutation.mutate();
    };
    
    // Show dialog with event source info
    const showEventSource = (event: Event) => {
        setSelectedEventForSource(event);
        setIsSourceDialogOpen(true);
    };
    
    // Placeholder for CSV upload
    const handleUploadCSV = () => {
        alert('CSV upload functionality would be implemented here');
    };
    
    // Placeholder for pasting URLs
    const handlePasteURLs = () => {
        alert('URL paste functionality would be implemented here');
    };
    
    // Hide component if not visible
    if (!isVisible) return null;
    
    return (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
            {/* Header with sync button */}
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h2 className="text-lg font-medium text-neutral-800">Target Event Selection</h2>
                    <p className="text-neutral-600 mt-1">Select from verified industry events or upload your own list.</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={handleSyncEvents}
                    disabled={syncEventsMutation.isPending}
                    className="flex items-center gap-2"
                >
                    <Globe className="h-4 w-4" />
                    {syncEventsMutation.isPending ? (
                        <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-1" /> Syncing...
                        </>
                    ) : 'Sync Web Events'}
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pre-loaded Events List */}
                <div>
                    <h3 className="text-sm font-medium text-neutral-700 mb-3">Upcoming Industry Events</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scroll-hidden">
                        {isLoading ? (
                            // Loading state
                            <div className="text-center py-4">
                                <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary-600" />
                                <p>Loading events...</p>
                            </div>
                        ) : events && events.length > 0 ? (
                            // Render each event
                            events.map((event) => (
                                <div 
                                    key={event.id}
                                    className={`border rounded-md p-4 cursor-pointer hover:border-primary-200 hover:bg-primary-50 transition-colors ${
                                        selectedEvent?.id === event.id 
                                            ? 'border-primary-300 bg-primary-50 shadow-sm' 
                                            : 'border-neutral-200 bg-neutral-50'
                                    }`}
                                    onClick={() => handleSelectEvent(event)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-neutral-800">{event.name}</h4>
                                            <p className="text-sm text-neutral-600 mt-1">{event.date} • {event.location}</p>
                                            <div className="flex items-center mt-2 text-xs text-neutral-500 space-x-3">
                                                <span>
                                                    <BuildingIcon className="inline-block mr-1 h-3 w-3" /> 
                                                    {event.exhibitorCount ? `${event.exhibitorCount}+ exhibitors` : 'Upcoming'}
                                                </span>
                                                {event.sourceUrl && (
                                                    <button
                                                        type="button"
                                                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            showEventSource(event);
                                                        }}
                                                    >
                                                        <ExternalLink className="h-3 w-3 mr-1" /> View Source
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                                            {/* Show last updated info */}
                                            {event.lastUpdated 
                                                ? new Date(event.lastUpdated).toLocaleDateString() !== new Date().toLocaleDateString()
                                                    ? `${Math.floor((new Date().getTime() - new Date(event.lastUpdated).getTime()) / (1000 * 60 * 60 * 24))} days ago`
                                                    : 'Today'
                                                : 'Recently'
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // No events state
                            <div className="text-center py-4 text-neutral-600">
                                <p className="mb-2">No events available</p>
                                <Button variant="outline" size="sm" onClick={handleSyncEvents}>
                                    <RefreshCw className="h-4 w-4 mr-2" /> Sync Events from Web
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Upload Your List Section */}
                <div>
                    <h3 className="text-sm font-medium text-neutral-700 mb-3">Upload Your Own List</h3>
                    <div className="border border-dashed border-neutral-300 rounded-md p-6 bg-white hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer h-full flex flex-col items-center justify-center text-center">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                            <UploadIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <h3 className="text-base font-medium text-neutral-800">Upload Company List</h3>
                        <p className="text-sm text-neutral-600 mt-2 max-w-xs">Upload a CSV with company names or paste website URLs</p>
                        <Button className="mt-4" onClick={handleUploadCSV}>
                            Upload CSV
                        </Button>
                        <p className="text-xs text-neutral-500 mt-2">or</p>
                        <Button variant="link" className="mt-2 p-0 h-auto text-primary-600" onClick={handlePasteURLs}>
                            Paste URLs
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-200">
                <Button variant="outline" onClick={handleBack}>
                    <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleContinue}>
                    Continue <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
            </div>
            
            {/* Sync Events Dialog */}
            <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Sync Events from Web Sources</DialogTitle>
                        <DialogDescription>
                            This will fetch the latest events from industry sources such as FESPA, ISA, and SGIA.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <p className="text-sm text-neutral-600 mb-4">
                            Events will be scraped from the following websites:
                        </p>
                        <ul className="space-y-2 text-sm">
                            {/* List of sources */}
                            <li className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">FESPA</span>
                                <span className="text-neutral-500">-</span>
                                <a 
                                    href="https://www.fespa.com/en/events" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    fespa.com/events
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">ISA</span>
                                <span className="text-neutral-500">-</span>
                                <a 
                                    href="https://www.signs.org/events" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    signs.org/events
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">SGIA</span>
                                <span className="text-neutral-500">-</span>
                                <a 
                                    href="https://www.printing.org/events" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    printing.org/events
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    <DialogFooter className="sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsSyncDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmSyncEvents}
                            disabled={syncEventsMutation.isPending}
                        >
                            {syncEventsMutation.isPending ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Syncing...
                                </>
                            ) : (
                                <>Sync Events</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Event Source Dialog */}
            <Dialog open={isSourceDialogOpen} onOpenChange={setIsSourceDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Event Source Information</DialogTitle>
                        <DialogDescription>
                            Details and source for {selectedEventForSource?.name}
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedEventForSource && (
                        <div className="py-4">
                            <div className="mb-4">
                                <p className="text-sm font-medium text-neutral-700">Event Details:</p>
                                <p className="text-sm mt-1"><span className="font-medium">Name:</span> {selectedEventForSource.name}</p>
                                <p className="text-sm mt-1"><span className="font-medium">Date:</span> {selectedEventForSource.date}</p>
                                <p className="text-sm mt-1"><span className="font-medium">Location:</span> {selectedEventForSource.location}</p>
                                {selectedEventForSource.exhibitorCount && (
                                    <p className="text-sm mt-1">
                                        <span className="font-medium">Expected Exhibitors:</span> {selectedEventForSource.exhibitorCount}+
                                    </p>
                                )}
                            </div>
                            
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium text-neutral-700 mb-2">Source:</p>
                                {selectedEventForSource.sourceUrl ? (
                                    <a 
                                        href={selectedEventForSource.sourceUrl} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        {selectedEventForSource.sourceUrl}
                                    </a>
                                ) : (
                                    <p className="text-sm text-neutral-500">No source URL available</p>
                                )}
                                <p className="text-xs text-neutral-500 mt-3">
                                    Last updated: {selectedEventForSource.lastUpdated 
                                        ? new Date(selectedEventForSource.lastUpdated).toLocaleString() 
                                        : 'Unknown'
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => setIsSourceDialogOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TargetEventSelector;