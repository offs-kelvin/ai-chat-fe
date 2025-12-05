import { MessageSquare } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-chat-sidebar flex items-center justify-center mb-6">
        <MessageSquare className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        How can I help you today?
      </h2>
      <p className="text-muted-foreground max-w-md">
        Start a new conversation or select an existing one from the sidebar.
      </p>
    </div>
  );
};

export default EmptyState;
