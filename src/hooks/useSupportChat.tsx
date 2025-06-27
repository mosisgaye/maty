
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useSupportChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const { toast } = useToast();

  // Initialize session
  useEffect(() => {
    const createSession = async () => {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      
      try {
        // Create a new session in Supabase
        const { error } = await supabase
          .from('support_sessions')
          .insert([
            { id: newSessionId, status: 'active' }
          ]);
        
        if (error) {
          console.error('Error creating chat session:', error);
          // Continue without showing error toast - chat will work in local mode
        }
      } catch (err) {
        console.error('Failed to create session:', err);
        // Continue without error notification
      }
    };
    
    createSession();
  }, []);

  // Save message to Supabase
  const saveMessage = async (message: string, isBot: boolean) => {
    if (!sessionId) return;
    
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert([
          { 
            session_id: sessionId,
            is_bot: isBot,
            message: message
          }
        ]);
      
      if (error) {
        console.error('Error saving chat message:', error);
        // Continue without showing error
      }
    } catch (err) {
      console.error('Failed to save message:', err);
      // Continue without error notification
    }
  };

  // Demo responses for the chatbot
  const botResponses = [
    "Je suis là pour vous aider à trouver le forfait mobile idéal pour vos besoins.",
    "Vous pouvez comparer les offres de différents opérateurs sur notre site.",
    "Nous proposons également des comparatifs de box internet et de téléphones mobiles.",
    "Avez-vous des critères spécifiques pour votre forfait mobile (data, budget, engagement) ?",
    "N'hésitez pas à utiliser notre outil de comparaison pour trouver les meilleures offres.",
    "Je vous recommande de consulter notre section blog pour des conseils sur le choix de votre forfait."
  ];
  
  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    saveMessage(inputText, false).catch(console.error);
    setInputText('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      saveMessage(randomResponse, true).catch(console.error);
    }, 1000);
  };
  
  return {
    messages,
    inputText,
    setInputText,
    sendMessage
  };
};
