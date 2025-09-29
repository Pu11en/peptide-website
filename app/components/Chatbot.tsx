'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm Dr. Incredible AI. How can I help you today with peptide information?", isUser: false, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const webhookUrl = 'https://drewp.app.n8n.cloud/webhook/d7c18d21-1aba-4915-b3ef-d75a994b0c46/chat';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Reset error state
    setError(null);
    
    // Add user message
    const userMessage = { text: input, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Add bot response
      setMessages(prev => [
        ...prev, 
        { text: data.response || data.output || "I'm sorry, I couldn't process that request.", isUser: false, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setError('Connection error. Please try again.');
      setMessages(prev => [
        ...prev, 
        { text: "Sorry, I'm having trouble connecting to our peptide database. Please try again in a moment.", isUser: false, timestamp: new Date() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-900 to-blue-900 rounded-lg shadow-xl w-full max-w-md mx-auto h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Dr. Incredible AI</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg ${
                  message.isUser 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-800 text-white rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-lg bg-gray-800 text-white rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          {error && (
            <div className="mb-2 text-red-400 text-xs text-center">
              {error}
            </div>
          )}
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about peptides..."
              className="flex-1 bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg px-4 py-2 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-400 text-center">
            Ask about peptide benefits, usage, or research
          </div>
        </form>
      </div>
    </div>
  );
}