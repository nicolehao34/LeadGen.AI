import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

interface APISettingsProps {
  onClose?: () => void;
}

const APISettings: React.FC<APISettingsProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  // Check if we already have an API key stored
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await apiRequest('GET', '/api/settings/openai-key-status');
        if (response.ok) {
          const data = await response.json();
          setHasKey(data.hasKey);
          setIsKeyValid(data.isValid);
        }
      } catch (error) {
        console.error('Failed to check API key status:', error);
      }
    };

    checkApiKey();
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiRequest('POST', '/api/settings/openai-key', {
        apiKey,
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'OpenAI API key saved successfully',
        });
        setApiKey('');
        setHasKey(true);
        setIsKeyValid(true);
        
        if (onClose) {
          onClose();
        }
      } else {
        const error = await response.json();
        toast({
          title: 'Error saving API key',
          description: error.message || 'Failed to save API key',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save API key',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const checkApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key to check',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    try {
      const response = await apiRequest('POST', '/api/settings/check-openai-key', {
        apiKey,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isValid) {
          toast({
            title: 'Valid API Key',
            description: 'The OpenAI API key is valid',
          });
          setIsKeyValid(true);
        } else {
          toast({
            title: 'Invalid API Key',
            description: data.message || 'The OpenAI API key is invalid',
            variant: 'destructive',
          });
          setIsKeyValid(false);
        }
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to check API key',
          variant: 'destructive',
        });
        setIsKeyValid(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify API key',
        variant: 'destructive',
      });
      setIsKeyValid(false);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="p-6 border border-neutral-200">
      <h2 className="text-lg font-medium text-neutral-800 mb-4">OpenAI API Settings</h2>
      
      {hasKey && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-800">
          <Check className="h-5 w-5 mr-2" />
          <span>
            OpenAI API key is {isKeyValid ? 'valid and' : 'currently'} configured. 
            {isKeyValid === false && ' However, the key appears to be invalid.'}
          </span>
        </div>
      )}

      <div className="mb-6">
        <p className="text-neutral-600 mb-4">
          Enter your OpenAI API key to enable AI-powered lead generation. Your API key will be securely stored as an environment variable.
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600" />
            <div>
              <p>To get an OpenAI API key:</p>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Visit <a href="https://platform.openai.com/signup" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a> and create an account</li>
                <li>Navigate to API Keys section</li>
                <li>Create a new secret key</li>
                <li>Copy the key (it starts with "sk-")</li>
                <li>Paste it below</li>
              </ol>
              <p className="mt-2">Note: Your OpenAI account must have available credits for API usage.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">OpenAI API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="font-mono"
          />
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={checkApiKey} 
            variant="outline" 
            disabled={isSaving || isChecking}
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Verify Key'
            )}
          </Button>
          
          <Button 
            onClick={handleSaveApiKey} 
            disabled={isSaving || isChecking}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save API Key'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default APISettings;