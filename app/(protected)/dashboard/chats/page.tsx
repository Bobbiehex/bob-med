"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useChat } from "@/context/ChatContext"; // ✅ import ChatContext

export default function ChatPage() {
  const { chatHistory, addMessage, setMessages } = useChat(); // ✅ use context

  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Replace this with your logged-in user ID
  const loggedInUserId = "replace_with_actual_user_id";

  // Example staff list
  const staffList = [
    { id: "doc1", name: "Dr. Sarah Johnson", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: "nurse1", name: "Nurse Grace Adebayo", img: "https://randomuser.me/api/portraits/women/33.jpg" },
  ];

  // Fetch messages from backend and update context
  const fetchMessages = async (staffId: string) => {
    try {
      const res = await fetch(`/api/messages?staffId=${staffId}&userId=${loggedInUserId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(staffId, data); // ✅ update context
    } catch (err) {
      console.error(err);
    }
  };

  // Polling messages every 2 seconds
  useEffect(() => {
    if (!selectedStaff) return;
    fetchMessages(selectedStaff.id); // initial fetch
    const interval = setInterval(() => fetchMessages(selectedStaff.id), 2000);
    return () => clearInterval(interval);
  }, [selectedStaff, setMessages]);

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedStaff) return;

    const textToSend = message;
    setMessage("");
    setIsTyping(true);

    // ✅ optimistically update context
    addMessage(selectedStaff.id, { staffId: selectedStaff.id, from: "You", text: textToSend });

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: selectedStaff.id,
          userId: loggedInUserId,
          from: "You",
          text: textToSend,
        }),
      });
      if (!res.ok) console.error("Failed to save message to database");
      else {
        const savedMessage = await res.json();
        addMessage(selectedStaff.id, savedMessage); // ✅ ensure context has saved message
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Chats</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staffList.map((staff) => (
          <Card key={staff.id} className="rounded-2xl shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={staff.img} alt={staff.name} />
                <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{staff.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="flex w-full items-center gap-2" onClick={() => setSelectedStaff(staff)}>
                <MessageCircle className="h-4 w-4" /> Open Chat
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStaff && (
        <div className="mt-6 max-w-md rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Chat with {selectedStaff.name}</h2>
          <div className="mb-2 max-h-60 overflow-y-auto rounded border bg-gray-50 p-2">
            {chatHistory[selectedStaff.id]?.length
              ? chatHistory[selectedStaff.id].map((msg, idx) => (
                  <div key={idx} className={`mb-2 ${msg.from === "You" ? "text-right" : "text-left"}`}>
                    <span
                      className={`inline-block rounded-xl px-3 py-1 ${
                        msg.from === "You" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))
              : "No messages yet"}
            {isTyping && <div className="animate-pulse text-right">Typing...</div>}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
