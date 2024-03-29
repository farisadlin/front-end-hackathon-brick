'use client'

import { useState } from 'react';
import axios from 'axios';

function linkify(inputText) {
  const urlRegex = /wa\.me\/\d+/g;
  return inputText.replace(urlRegex, (url) => {
    const fullUrl = `https://${url}`;
    // Use the custom CSS class
    return `<a href="${fullUrl}" class="custom-link" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

function breakDownText(text) {
  // Split the text by newline characters
  const parts = text.split('\n').map(part => part.trim()).filter(part => part !== '');
  return parts;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    setIsSending(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, {
        text: input
      });

      const formattedResponse = breakDownText(response.data.response);

      setMessages(prevMessages => [...prevMessages, { type: 'user', text: input }]);
      // Adding each part as a separate message
      formattedResponse.forEach(msg => {
        setMessages(prevMessages => [...prevMessages, { type: 'bot', text: msg }]);
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { type: 'error', text: 'Error sending message.' }]);
    }

    setInput('');
    setIsSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSending) {
      sendMessage();
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-primary">Chat with Brick</h1>
    
      {/* Chat window for displaying messages */}
      <div className="chat-window bg-neutral p-4 shadow rounded-lg h-[80vh] overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type === 'user' ? 'text-right' : ''}`}>
            <span
              className={`inline-block px-3 py-2 rounded-lg max-w-xs m-1 text-white ${msg.type === 'user' ? 'bg-primary' : 'bg-neutral border border-gray-500'}`}
              dangerouslySetInnerHTML={{ __html: linkify(msg.text) }}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          autoFocus
          className="input input-bordered w-full"
          disabled={isSending}
        />
        <button onClick={sendMessage} className={`btn btn-primary ml-2 ${isSending && "cursor-wait"} text-white`} disabled={isSending}>
          {isSending ? <Spinner /> : 'Send'}
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
      <span class="loading loading-spinner loading-lg cursor-wait text-primary"></span>
  );
}
