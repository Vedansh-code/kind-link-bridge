import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Mic, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { sendTextChat, sendVoiceChat, ChatMessage } from "../services/chatbotApi";

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [recordTimer, setRecordTimer] = useState<number>(0);

  const { toast } = useToast();
  
  // Refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAreaViewportRef = useRef<HTMLDivElement | null>(null);

  // User Info state
  const [user, setUser] = useState<{ id: string | number; name: string } | null>(null);

  // Load User Info and Chat History from sessionStorage
  useEffect(() => {
    // Authenticated user check
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          id: parsed.id,
          name: parsed.username || parsed.name || "Authenticated User",
        });
      } catch (err) {
        console.error("Failed to parse user", err);
      }
    }

    // Load history
    const storedHistory = sessionStorage.getItem("chatbot_history");
    if (storedHistory) {
      try {
        setMessages(JSON.parse(storedHistory));
      } catch (err) {
        console.error("Failed to parse chat history", err);
      }
    } else {
      // Default welcome message
      const defaultWelcome: ChatMessage = {
        role: "assistant",
        content: "Hello! I am your HopeConnect AI assistant. Feel free to ask me anything about volunteering, donation pledges, or scheduling a visit to our NGOs.",
      };
      setMessages([defaultWelcome]);
      sessionStorage.setItem("chatbot_history", JSON.stringify([defaultWelcome]));
    }
  }, []);

  // Save history to sessionStorage when messages update
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chatbot_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages list updates or chat opens
  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      const scrollContainer = scrollAreaViewportRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  // Handle Text Submission
  const handleSendText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading || isUploading || isRecording) return;

    const userMessage: ChatMessage = { role: "user", content: inputText.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);

    // Get current user, default to Guest only if genuinely unauthenticated
    const currentUserId = user?.id ?? "Guest";
    const currentUserName = user?.name ?? "Guest";

    try {
      const response = await sendTextChat({
        user_id: currentUserId,
        user_name: currentUserName,
        message: userMessage.content,
        chat_history: updatedMessages,
      });
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error("Chatbot text API error:", err);
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: "Failed to connect to the chatbot. Please try again.",
      });
      // Append a fallback assistant message to guide the user
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble connecting to my service right now. Please check if the recommendation and chatbot backend is online.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Start Voice Recording
  const startRecording = async () => {
    if (loading || isUploading || isRecording) return;
    
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await uploadAudio(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
      setRecordTimer(0);
      
      // Start recording timer
      timerIntervalRef.current = setInterval(() => {
        setRecordTimer((prev) => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Failed to access microphone:", err);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please check your microphone permissions and try again.",
      });
    }
  };

  // Stop Voice Recording
  const stopRecording = () => {
    if (!isRecording) return;

    // Stop timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Stop all media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
  };

  // Upload Audio Recording
  const uploadAudio = async (audioBlob: Blob) => {
    setIsUploading(true);
    
    // Add user placeholder message for speech bubble
    const userVoicePlaceholder: ChatMessage = {
      role: "user",
      content: "🎤 Sent voice message",
    };
    
    const updatedMessages = [...messages, userVoicePlaceholder];
    setMessages(updatedMessages);

    const currentUserId = user?.id ?? "Guest";
    const currentUserName = user?.name ?? "Guest";

    try {
      const response = await sendVoiceChat(
        currentUserId,
        currentUserName,
        audioBlob,
        updatedMessages
      );
      // Replace the placeholder or append the reply
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error("Chatbot voice API error:", err);
      toast({
        variant: "destructive",
        title: "Audio Upload Failed",
        description: "Could not send the voice recording. Please try again.",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your voice message. The chatbot server returned an error.",
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  // Format recording duration (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-background/95 backdrop-blur border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">HopeConnect AI</h3>
                <span className="text-[10px] text-white/80 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-white/10 rounded-full h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Messages */}
          <ScrollArea ref={scrollAreaViewportRef} className="flex-1 p-4 bg-accent/10">
            <div className="space-y-4">
              {messages.map((msg, index) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div
                    key={index}
                    className={`flex items-start ${isAssistant ? "justify-start" : "justify-end"}`}
                  >
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold mr-2 mt-0.5 shadow-sm">
                        AI
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                        isAssistant
                          ? "bg-card text-foreground rounded-tl-none border border-border/60"
                          : "bg-primary text-primary-foreground rounded-tr-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              
              {/* Typing/Loader state */}
              {loading && (
                <div className="flex items-start">
                  <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold mr-2 mt-0.5 shadow-sm">
                    AI
                  </div>
                  <div className="bg-card text-muted-foreground border border-border/60 rounded-2xl rounded-tl-none p-3 text-sm flex items-center space-x-2 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>AI is typing...</span>
                  </div>
                </div>
              )}

              {/* Uploading indicator */}
              {isUploading && (
                <div className="flex items-start justify-end">
                  <div className="bg-primary/80 text-primary-foreground rounded-2xl rounded-tr-none p-3 text-sm flex items-center space-x-2 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Uploading audio...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Recording overlay */}
          {isRecording && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20 animate-in fade-in duration-200">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center animate-ping absolute inset-0" />
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg relative">
                  <Mic className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground">Recording Audio...</p>
                <p className="text-2xl font-mono text-red-500 mt-1">{formatTime(recordTimer)}</p>
                <p className="text-xs text-muted-foreground mt-3">Release microphone button to stop and send</p>
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendText} className="p-3 border-t bg-card flex items-center space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isUploading ? "Uploading..." : "Ask HopeConnect AI..."}
              disabled={loading || isUploading || isRecording}
              className="flex-1 h-10 bg-accent/20 border-border/80 focus-visible:ring-primary rounded-xl"
            />
            
            {/* Microphone Button (Press & Hold) */}
            <Button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={(e) => {
                e.preventDefault();
                startRecording();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopRecording();
              }}
              disabled={loading || isUploading}
              className={`h-10 w-10 rounded-xl flex items-center justify-center p-0 shadow-sm ${
                isRecording 
                  ? "bg-red-500 text-white hover:bg-red-600 animate-pulse" 
                  : "bg-accent text-accent-foreground hover:bg-accent/80"
              }`}
            >
              <Mic className="w-5 h-5" />
            </Button>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!inputText.trim() || loading || isUploading || isRecording}
              className="h-10 w-10 rounded-xl flex items-center justify-center p-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center p-0 transition-transform duration-300 active:scale-95 hero-gradient text-white border-none group"
      >
        {isOpen ? (
          <X className="w-6 h-6 rotate-90 transition-transform duration-300" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </Button>
    </div>
  );
};
