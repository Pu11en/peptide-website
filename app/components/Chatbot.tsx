'use client';

import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const webhookUrl = 'https://drewp.app.n8n.cloud/webhook/d7c18d21-1aba-4915-b3ef-d75a994b0c46/chat';

  useEffect(() => {
    // Only create the chat when component mounts and is open
    if (isOpen) {
      // Create a container div for the chat if it doesn't exist
      let chatContainer = document.getElementById('n8n-chat');
      if (!chatContainer) {
        chatContainer = document.createElement('div');
        chatContainer.id = 'n8n-chat';
        document.body.appendChild(chatContainer);
      }

      // Create the chat instance
      const chatInstance = createChat({
        webhookUrl: webhookUrl,
        // Use default target which is '#n8n-chat'
        mode: 'window', // Use window mode as per documentation default
        loadPreviousSession: false, // Disable loading previous session to avoid fetch errors
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
        enableStreaming: true
      });

      // Clean up function
      return () => {
        // Only remove the chat container when closing
        const chatElement = document.getElementById('n8n-chat');
        if (chatElement) {
          chatElement.remove();
        }
      };
    }
  }, [isOpen, webhookUrl]);

  // If chat is not open, don't show the backdrop
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      {/* This is just a backdrop/overlay that closes the chat when clicked */}
    </div>
  );
}