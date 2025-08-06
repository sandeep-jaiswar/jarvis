import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`message-bubble ${isUser ? "user-message" : "bot-message"}`}
    >
      <div className="markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;
