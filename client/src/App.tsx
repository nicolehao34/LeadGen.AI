import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WorkflowProvider } from "./context/WorkflowContext";
import NotFound from "@/pages/not-found";
import LeadGeneration from "@/pages/LeadGeneration";
import Settings from "@/pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LeadGeneration} />
      <Route path="/lead-generation" component={LeadGeneration} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WorkflowProvider>
          <Toaster />
          <Router />
        </WorkflowProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;