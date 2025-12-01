import { useEffect, useState, useRef } from "react";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  onStreamComplete?: () => void;
}

const ChatMessage = ({ role, content, isStreaming = false, onStreamComplete }: ChatMessageProps) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const streamingRef = useRef(false);

  useEffect(() => {
    // Only stream if this is a new streaming message
    if (isStreaming && !streamingRef.current) {
      streamingRef.current = true;
      setDisplayedContent("");
      setCurrentIndex(0);
    } else if (!isStreaming) {
      // For existing messages or user messages, show full content immediately
      setDisplayedContent(content);
      streamingRef.current = false;
    }
  }, [isStreaming, content]);

  useEffect(() => {
    if (isStreaming && currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20); // Adjust speed here (lower = faster)

      return () => clearTimeout(timeout);
    } else if (isStreaming && currentIndex >= content.length) {
      // Streaming complete, notify parent
      onStreamComplete?.();
    }
  }, [currentIndex, content, isStreaming, onStreamComplete]);

  const isUser = role === "user";

  return (
    <div
      className={`flex gap-4 p-6 ${
        isUser ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <Bot className="h-5 w-5 text-accent-foreground" />
        </div>
      )}
      
      <div
        className={`max-w-3xl rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-chat-bubble-user text-chat-bubble-user-text"
            : "bg-chat-bubble-assistant text-foreground"
        } shadow-sm`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {displayedContent}
          {isStreaming && currentIndex < content.length && (
            <span className="inline-block w-1 h-4 ml-0.5 bg-current animate-pulse" />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
