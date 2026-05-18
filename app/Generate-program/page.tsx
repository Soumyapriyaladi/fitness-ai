"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { vapi } from "@/lib/vapi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateProgram } from "@/app/actions/generateProgram";

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const [vapiData, setVapiData] = useState<Record<string, string>>({});

  const { user } = useUser();
  const router = useRouter();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // navigate user to profile page after call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  // setup event listeners for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = async () => {
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);

      try {
        if (user?.id) {
          await generateProgram({
            user_id: user.id,
            age: "25",
            height: "5'6\"",
            weight: "150 lbs",
            injuries: "None",
            workout_days: "4",
            fitness_goal: "Weight Loss",
            fitness_level: "Beginner",
            dietary_restrictions: "None",
          });
        }
      } catch (error) {
        console.log("Error generating program:", error);
      }
    };

    const handleSpeechStart = () => {
      console.log("AI started Speaking");
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log("AI stopped Speaking");
      setIsSpeaking(false);
    };

    const handleMessage = (message: any) => {
      if (
        message.type === "transcript" &&
        message.transcriptType === "final"
      ) {
        const newMessage = {
          content: message.transcript,
          role: message.role,
        };
        setMessages((prev) => [...prev, newMessage]);
      }

      if (message.type === "end-of-call-report") {
        console.log("End of call report:", message);
        const structuredData = message.analysis?.structuredData;
        if (structuredData) {
          setVapiData(structuredData);
        }
      }
    };

    const handleError = (error: any) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, [user, vapiData]);

  const toggleCall = async () => {
    if (callActive) {
      vapi.stop();
    } else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);
        setVapiData({});

        const fullName = user?.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "There";

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,
            user_id: user?.id || "",
          },
        });
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Generate Your </span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Have a voice conversation with our AI assistant to create your
            personalized plan
          </p>
        </div>

        {/* VIDEO CALL AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* AI ASSISTANT CARD */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">

              <div
                className={`absolute inset-0 bg-primary/5 ${
                  isSpeaking ? "animate-pulse" : ""
                } transition-opacity duration-300`}
              />

              <div className="relative size-32 mb-4">
                <div
                  className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                />
                <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10" />
                  <img
                    src="/ai-avatar.png"
                    alt="AI Assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <p className="text-lg font-semibold">AI Fitness Trainer</p>
              <p className="text-sm text-muted-foreground mt-1">
                Fitness & Diet Coach
              </p>

              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                  isSpeaking ? "border-primary" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSpeaking ? "bg-primary animate-pulse" : "bg-muted"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {isSpeaking
                    ? "Speaking..."
                    : callActive
                    ? "Listening..."
                    : callEnded
                    ? "Generating your plan..."
                    : "Waiting..."}
                </span>
              </div>
            </div>
          </Card>

          {/* USER CARD */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">

              <div className="relative size-32 mb-4">
                <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10" />
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
              </div>

              <p className="text-lg font-semibold">You</p>
              <p className="text-sm text-muted-foreground mt-1">
                {user?.firstName || "User"}
              </p>

              <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border">
                <div className="w-2 h-2 rounded-full bg-muted" />
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
          </Card>

        </div>

        {/* MESSAGES */}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
          >
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    {msg.role === "assistant" ? "AI Fitness Trainer" : "You"}:
                  </div>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALL CONTROLS */}
        <div className="w-full flex justify-center gap-4">
          <Button
            className={`w-40 text-xl rounded-3xl ${
              callActive
                ? "bg-destructive hover:bg-destructive/90"
                : callEnded
                ? "bg-green-600 hover:bg-green-700"
                : "bg-primary hover:bg-primary/90"
            } text-white relative`}
            onClick={toggleCall}
            disabled={connecting || callEnded}
          >
            {connecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75" />
            )}
            <span>
              {callActive
                ? "End Call"
                : connecting
                ? "Connecting..."
                : callEnded
                ? "Generating..."
                : "Start Call"}
            </span>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default GenerateProgramPage;