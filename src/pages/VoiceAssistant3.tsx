import React, { useState, useRef, useEffect } from "react";
import PageContainer from "../components/layout/PageContainer";
import Sidebar from "../components/layout/Sidebar";

interface Message {
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  description: string;
}

interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
}

const VoiceAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      type: "Doctor",
      date: "05/10/2023",
      time: "10:00 AM",
      description: "Annual physical checkup",
    },
    {
      id: "2",
      type: "Dentist",
      date: "05/15/2023",
      time: "2:30 PM",
      description: "Teeth cleaning",
    },
  ]);
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Take medication",
      date: "05/05/2023",
      time: "8:00 AM",
    },
    {
      id: "2",
      title: "Call mom",
      date: "05/08/2023",
      time: "7:00 PM",
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    if (!hasSpokenWelcome) {
      const welcomeMessage =
        "Hello! I'm your voice assistant. How can I help you today? You can ask me to schedule appointments, set reminders, or ask general questions.";
      addMessage(welcomeMessage, "assistant");
      speak(welcomeMessage);
      setHasSpokenWelcome(true);
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        addMessage(transcript, "user");
        processUserInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        const errorMessage = "Sorry, I didn't catch that. Please try again.";
        addMessage(errorMessage, "assistant");
        speak(errorMessage);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    } else {
      const notSupportedMessage =
        "Speech recognition is not supported in your browser.";
      console.warn(notSupportedMessage);
      addMessage(notSupportedMessage, "assistant");
      speak(notSupportedMessage);
    }

    return () => {
      recognitionRef.current?.stop();
      synthRef.current?.cancel();
    };
  }, [hasSpokenWelcome]);

  const addMessage = (text: string, sender: "user" | "assistant") => {
    setMessages((prev) => [
      ...prev,
      { text, sender, timestamp: new Date() },
    ]);
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
      addMessage("Listening...", "assistant");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      addMessage("Stopped listening.", "assistant");
    }
  };

  const processUserInput = (input: string) => {
    const lower = input.toLowerCase();
    let response = "";

    if (lower.includes("schedule") || lower.includes("appointment")) {
      response = handleAppointmentRequest(input);
    } else if (lower.includes("remind") || lower.includes("reminder")) {
      response = handleReminderRequest(input);
    } else if (lower.includes("list appointments") || lower.includes("my appointments")) {
      response = listAppointments();
    } else if (lower.includes("list reminders") || lower.includes("my reminders")) {
      response = listReminders();
    } else if (lower.includes("hello") || lower.includes("hi")) {
      response = "Hello there! How can I assist you today?";
    } else if (lower.includes("thank")) {
      response = "You're welcome! Let me know if you need anything else.";
    } else {
      response =
        "I'm not sure I understood that. You can ask about appointments, reminders, or say hi!";
    }

    addMessage(response, "assistant");
    speak(response);
  };

  const handleAppointmentRequest = (input: string) => {
    const doctorMatch = input.match(/doctor|dentist|physician/i);
    const dateMatch = input.match(/(\d{1,2}\/\d{1,2}\/\d{4})|tomorrow|next week/i);
    const timeMatch = input.match(/(\d{1,2}:\d{2} (AM|PM))|morning|afternoon|evening/i);
    const reasonMatch = input.match(/for (.+)/i);

    const type = doctorMatch?.[0] ?? "appointment";
    const date = dateMatch?.[0] ?? "tomorrow";
    const time = timeMatch?.[0] ?? "10:00 AM";
    const reason = reasonMatch?.[1] ?? "general checkup";

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      type,
      date,
      time,
      description: reason,
    };

    setAppointments((prev) => [...prev, newAppointment]);
    return `I've scheduled your ${type} appointment for ${date} at ${time} for ${reason}. Would you like a reminder too?`;
  };

  const handleReminderRequest = (input: string) => {
    const titleMatch = input.match(/remind me to (.+)/i) || input.match(/about (.+)/i);
    const dateMatch = input.match(/(\d{1,2}\/\d{1,2}\/\d{4})|tomorrow|next week/i);
    const timeMatch = input.match(/(\d{1,2}:\d{2} (AM|PM))|morning|afternoon|evening/i);

    const title = titleMatch?.[1] ?? "your reminder";
    const date = dateMatch?.[0] ?? "tomorrow";
    const time = timeMatch?.[0] ?? "9:00 AM";

    const newReminder: Reminder = {
      id: Date.now().toString(),
      title,
      date,
      time,
    };

    setReminders((prev) => [...prev, newReminder]);
    return `Reminder set for "${title}" on ${date} at ${time}.`;
  };

  const listAppointments = () => {
    if (appointments.length === 0) {
      return "You have no upcoming appointments.";
    }

    return (
      "Here are your upcoming appointments:\n" +
      appointments
        .map(
          (appt) =>
            `${appt.type} on ${appt.date} at ${appt.time} for ${appt.description}`
        )
        .join("\n")
    );
  };

  const listReminders = () => {
    if (reminders.length === 0) {
      return "You have no reminders set.";
    }

    return (
      "Here are your reminders:\n" +
      reminders.map((r) => `${r.title} on ${r.date} at ${r.time}`).join("\n")
    );
  };

  return (
    <div className="flex">
      <Sidebar />
      <PageContainer>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Voice Assistant</h1>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={startListening}
              disabled={isListening}
              className={`px-4 py-2 rounded ${
                isListening
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isListening ? "Listening..." : "Start Speaking"}
            </button>
            <button
              onClick={stopListening}
              disabled={!isListening}
              className={`px-4 py-2 rounded ${
                !isListening
                  ? "bg-gray-400"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Stop
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow-md h-96 overflow-y-scroll">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <p className={`${msg.sender === "user" ? "text-blue-600" : "text-green-600"}`}>
                  <strong>{msg.sender === "user" ? "You" : "Assistant"}:</strong> {msg.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default VoiceAssistant;
