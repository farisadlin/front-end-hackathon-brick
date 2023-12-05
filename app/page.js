'use client'

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, {
        text: input
      });

      setMessage(response.data.response)

    } catch (error) {
      console.error('Error sending message:', error);
      // Handle the error appropriately - maybe show it in the UI
    }

    setInput('');
  };

  return (
    <div>
      <h1>Chat with ChatGPT</h1>
      <div>
          <p>
            {message}
          </p>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
