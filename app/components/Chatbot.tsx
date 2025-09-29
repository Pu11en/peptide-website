'use client';

import { useEffect, useRef } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const webhookUrl = 'https://drewp.app.n8n.cloud/webhook/d7c18d21-1aba-4915-b3ef-d75a994b0c46/chat';
  const chatInstanceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Only create the chat instance if it doesn't exist yet
      if (!chatInstanceRef.current && containerRef.current) {
        // Create a div element for the chat
        const chatDiv = document.createElement('div');
        chatDiv.id = 'n8n-chat-container';
        containerRef.current.appendChild(chatDiv);

        // Create the chat instance
        chatInstanceRef.current = createChat({
          webhookUrl: webhookUrl,
          target: '#n8n-chat-container',
          mode: 'fullscreen', // Use fullscreen mode for our container
          loadPreviousSession: true,
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          initialMessages: [
            "Hello! I'm Dr. Incredible AI. How can I help you today with peptide information?"
          ],
          i18n: {
            en: {
              title: 'Dr. Incredible AI',
              subtitle: 'Your peptide information assistant',
              inputPlaceholder: 'Ask about peptides...',
              getStarted: 'New Conversation',
              footer: 'Incredible Peptides © 2023'
            }
          },
          metadata: {
            source: 'website'
          },
          enableStreaming: true,
          webhookConfig: {
            method: 'POST',
            headers: {}
          }
        });
      }
    }

    // Clean up function
    return () => {
      if (chatInstanceRef.current && !isOpen) {
        // Remove the chat instance when component unmounts or closes
        const chatContainer = document.querySelector('#n8n-chat-container');
        if (chatContainer) {
          chatContainer.remove();
        }
        chatInstanceRef.current = null;
      }
    };
  }, [isOpen, webhookUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md mx-auto h-[600px]">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white bg-gray-800 rounded-full p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Chat container */}
        <div ref={containerRef} className="w-full h-full"></div>
      </div>
    </div>
  );
}