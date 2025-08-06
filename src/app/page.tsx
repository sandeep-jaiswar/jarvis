"use client"; // This component needs to be a Client Component for interactivity

import { useState, useRef, useEffect } from "react";
import ChatMessage from "../components/ChatMessage"; // Adjust path as necessary
import { RiSendPlaneFill } from "react-icons/ri"; // Example icon, need to install react-icons
import { LuMenu, LuPlus, LuCompass, LuSearch, LuUserCircle } from "react-icons/lu"; // Feather icons for sidebar

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: "Hello! How can I help you today?" },
    { id: 2, sender: "user", text: "Tell me about the latest AI advancements." },
    {
      id: 3,
      sender: "bot",
      text: "The field of AI is rapidly evolving! Recent advancements include large language models like **GPT-4**, **image generation models** such as DALL-E 3, and progress in **reinforcement learning** for robotics and complex problem-solving.

```python
# Example of a simple AI-related code snippet
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
```

Is there a specific area you'd like to know more about?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const messageDisplayRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages on new message
  useEffect(() => {
    if (messageDisplayRef.current) {
      messageDisplayRef.current.scrollTop = messageDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage.trim(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");

    try {
      // Simulate typing indicator
      const typingIndicatorId = messages.length + 2;
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: typingIndicatorId, sender: "bot", text: "Typing..." },
      ]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage.trim() }),
      });

      const data = await response.json();

      // Remove typing indicator and add actual bot response
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === typingIndicatorId ? { ...msg, text: data.response, sender: "bot" } : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messages.length + 2 // Assuming typing indicator was the last message added
            ? { ...msg, text: "Error: Could not get a response.", sender: "bot" }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">Perplexity AI Clone</div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <a href="#">
                  <LuPlus size={20} /> New Chat
                </a>
              </li>
              <li>
                <a href="#">
                  <LuCompass size={20} /> Discover
                </a>
              </li>
              <li>
                <a href="#">
                  <LuSearch size={20} /> Search History
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-footer">
          <a href="#">
            <LuUserCircle size={20} /> My Profile
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="message-display" ref={messageDisplayRef}>
          <div className="message-wrapper">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <textarea
              className="message-input"
              placeholder="Ask anything..."
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="send-button" onClick={handleSendMessage}>
              <RiSendPlaneFill size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}