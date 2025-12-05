import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import EmptyState from "@/components/EmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  messages: Message[];
}

// Mock conversations
const initialConversations: Conversation[] = [];

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  // Scroll to bottom when messages change or component mounts
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Small delay to ensure DOM is updated
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [activeConversation?.messages]);

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: "New Conversation",
      preview: "Start a new conversation",
      messages: [
        {
          id: `m-${Date.now()}`,
          role: "assistant",
          content: "Hello! How can I help you today?",
        },
      ],
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newId);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleSendMessage = (content: string) => {
    if (!activeConversation) return;

    const userMessage: Message = {
      id: `m-${Date.now()}`,
      role: "user",
      content,
    };

    // Add user message
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          title: conv.messages.length === 1 ? content.slice(0, 50) : conv.title,
          preview: content.slice(0, 60),
        };
      }
      return conv;
    });

    setConversations(updatedConversations);

    // Simulate AI response with streaming after a short delay
    setTimeout(() => {
      const aiMessageId = `m-${Date.now()}-ai`;
      const aiMessage: Message = {
        id: aiMessageId,
        role: "assistant",
        content: generateMockResponse(content),
        isStreaming: true,
      };

      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, aiMessage],
            };
          }
          return conv;
        })
      );
    }, 500);
  };

  const handleStreamComplete = (messageId: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => ({
        ...conv,
        messages: conv.messages.map((msg) =>
          msg.id === messageId ? { ...msg, isStreaming: false } : msg
        ),
      }))
    );
  };

  const generateMockResponse = (userMessage: string): string => {
    const responses = [
      "That's a great question! Let me help you with that. Based on what you've asked, I can provide you with detailed information and insights that should be helpful for your needs.",
      "I understand what you're looking for. Here's what I can tell you: This is a complex topic with several important aspects to consider. Let me break it down for you in a clear and organized way.",
      "Thanks for sharing that with me. From my understanding, there are a few key points we should discuss. This will help you get a comprehensive view of the situation and make informed decisions.",
      `Regarding "${userMessage}" - that's an interesting point. Let me provide you with a thoughtful response that addresses your question directly and offers some additional context that might be useful.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex h-screen bg-chat-bg overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {!activeConversation || activeConversation.messages.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="max-w-4xl mx-auto py-8">
              {activeConversation.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  isStreaming={message.isStreaming}
                  onStreamComplete={() => handleStreamComplete(message.id)}
                />
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>
        )}

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Index;
