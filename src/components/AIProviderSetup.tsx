
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Key, Shield, Sparkles, Zap, Star } from "lucide-react";
import { toast } from "sonner";
import { AIConfig } from "@/pages/Index";

interface AIProviderSetupProps {
  onConfigured: (config: AIConfig) => void;
}

const AI_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    description: 'GPT-4 powered analysis with excellent health insights',
    keyFormat: 'sk-...',
    popular: true
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '🧠',
    description: 'Advanced reasoning for comprehensive health reports',
    keyFormat: 'AI...',
    popular: true
  },
  {
    id: 'grok',
    name: 'Grok (X AI)',
    icon: '⚡',
    description: 'Witty and insightful health analysis',
    keyFormat: 'xai-...',
    popular: false
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🔍',
    description: 'Deep analytical capabilities for health data',
    keyFormat: 'sk-...',
    popular: false
  },
  {
    id: 'qwen',
    name: 'Qwen (Alibaba)',
    icon: '🌟',
    description: 'Multilingual AI with health expertise',
    keyFormat: 'sk-...',
    popular: false
  }
];

export const AIProviderSetup = ({ onConfigured }: AIProviderSetupProps) => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleConfigure = () => {
    if (!selectedProvider || !apiKey.trim()) {
      toast.error("Please select a provider and enter your API key");
      return;
    }

    // Store in localStorage for privacy
    const config: AIConfig = {
      provider: selectedProvider,
      apiKey: apiKey.trim()
    };

    localStorage.setItem('healthviz_ai_config', JSON.stringify(config));
    toast.success("AI provider configured successfully!");
    onConfigured(config);
  };

  const selectedProviderInfo = AI_PROVIDERS.find(p => p.id === selectedProvider);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="health-card">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 gradient-wellness rounded-2xl flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connect Your AI Provider</h2>
            <p className="text-muted-foreground">
              Choose an AI service to generate your personalized health insights
            </p>
          </div>

          {/* Provider selection */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">Select AI Provider</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AI_PROVIDERS.map((provider) => (
                <Card
                  key={provider.id}
                  className={`cursor-pointer transition-all duration-200 p-4 hover:shadow-lg ${
                    selectedProvider === provider.id 
                      ? 'ring-2 ring-primary border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Key format: {provider.keyFormat}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {provider.popular && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {provider.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* API key input */}
          {selectedProvider && (
            <div className="space-y-4 animate-fade-up">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  API Key for {selectedProviderInfo?.name}
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showKey ? 'text' : 'password'}
                    placeholder={`Enter your ${selectedProviderInfo?.name} API key`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pr-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>

              {/* Privacy notice */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">Privacy First</h4>
                    <p className="text-sm text-muted-foreground">
                      Your API key is stored locally in your browser only. We never send it to our servers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Configure button */}
              <Button 
                onClick={handleConfigure}
                disabled={!apiKey.trim()}
                className="w-full gap-2"
                size="lg"
              >
                <Sparkles className="w-5 h-5" />
                Generate My Health Report
              </Button>
            </div>
          )}

          {/* Help section */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Don't have an API key?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                  Get OpenAI Key
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                  Get Gemini Key
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
