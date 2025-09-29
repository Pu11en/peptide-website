'use client';

import { useEffect, useRef } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const webhookUrl = 'https://drewp.app.n8n.cloud/webhook/d7c18d21-1aba-4915-b3ef-d75a994b0c46/chat';
  const chatInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Create a container div for the chat if it doesn't exist
    let chatContainer = document.getElementById('n8n-chat');
    if (!chatContainer) {
      chatContainer = document.createElement('div');
      chatContainer.id = 'n8n-chat';
      document.body.appendChild(chatContainer);
    }

    // Create the chat instance only once
    if (!chatInstanceRef.current) {
      chatInstanceRef.current = createChat({
        webhookUrl: webhookUrl,
        target: '#n8n-chat',
        mode: 'window', 
        loadPreviousSession: false,
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
        showInitialMessages: true
      });
    }

    // Open or close the chat based on isOpen state
    if (isOpen && chatInstanceRef.current) {
      chatInstanceRef.current.open();
    } else if (!isOpen && chatInstanceRef.current) {
      chatInstanceRef.current.close();
    }

    // Clean up function
    return () => {
      // We don't destroy the chat instance on unmount anymore
      // Just close it if it's open
      if (chatInstanceRef.current && isOpen) {
        chatInstanceRef.current.close();
      }
    };
  }, [isOpen, webhookUrl]);

  // If chat is not open, don't show the backdrop
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      {/* This is just a backdrop/overlay that closes the chat when clicked */}
    </div>
  );
}