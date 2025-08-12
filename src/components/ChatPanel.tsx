
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { HealthData } from "@/pages/Index";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatPanelProps {
  healthData: HealthData;
  reportId: string;
  aiProvider: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const ChatPanel = ({ healthData, reportId, aiProvider }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, [reportId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('messages')
        .eq('report_id', reportId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error is OK
        console.error('Error loading chat history:', error);
        return;
      }

      if (data?.messages) {
        setMessages(data.messages as Message[]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages: Message[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('chat_sessions')
        .upsert({
          user_id: user.id,
          report_id: reportId,
          messages: newMessages,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving chat history:', error);
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual AI API call)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(userMessage.content, healthData),
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (question: string, data: HealthData): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('steps') || lowerQuestion.includes('walking')) {
      return `Based on your ${data.steps || 0} daily steps, you're doing great! This translates to approximately ${data.distance_km || 0} km of walking. To optimize your cardiovascular health, aim for 10,000+ steps daily.`;
    }
    
    if (lowerQuestion.includes('sleep')) {
      return `Your ${data.sleep_hours || 0} hours of sleep ${(data.sleep_hours || 0) >= 7 ? 'is within the recommended range' : 'could be improved'}. Adults should aim for 7-9 hours nightly for optimal recovery and cognitive function.`;
    }
    
    if (lowerQuestion.includes('heart') || lowerQuestion.includes('blood pressure')) {
      return `Your heart rate of ${data.heart_rate_bpm || 0} BPM and blood pressure of ${data.blood_pressure?.systolic || 0}/${data.blood_pressure?.diastolic || 0} mmHg are important indicators. Regular cardio exercise can help maintain healthy cardiovascular metrics.`;
    }
    
    if (lowerQuestion.includes('diet') || lowerQuestion.includes('nutrition')) {
      return `Based on your ${data.calories_kcal || 0} calorie burn and health metrics, focus on a balanced diet rich in vegetables, lean proteins, and whole grains. Your cholesterol level of ${data.lab_results?.cholesterol || 0} mg/dL ${(data.lab_results?.cholesterol || 0) < 200 ? 'is excellent' : 'could benefit from dietary adjustments'}.`;
    }
    
    if (lowerQuestion.includes('water') || lowerQuestion.includes('hydration')) {
      return `Your ${data.water_liters || 0}L daily water intake ${(data.water_liters || 0) >= 2 ? 'is good' : 'should be increased'}. Aim for 2-3 liters daily, adjusting for exercise and climate.`;
    }
    
    return `Thank you for your question about "${question}". Based on your health data, I recommend maintaining your current positive habits while focusing on areas that could use improvement. Would you like specific recommendations for any particular aspect of your health?`;
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-96">
      <Card className="w-full h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold">Health Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{aiProvider}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm">
                Ask me anything about your health report!
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your health..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
