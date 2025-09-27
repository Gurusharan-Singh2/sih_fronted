"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  MessageCircle,
  Loader2,
  Shield,
  AlertTriangle,
  Lightbulb,
  BookOpen
} from "lucide-react";

export default function SOCAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your Smart SOC AI Assistant. I can help you understand security alerts, explain threat patterns, and provide remediation guidance. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage) => {
    const responses = {
      "hello": "Hello! I'm here to help with your security operations. What would you like to know about the current threats?",
      "help": "I can help you with:\n• Explaining security alerts and their implications\n• Providing threat intelligence and context\n• Suggesting remediation strategies\n• Analyzing attack patterns\n• Answering questions about cybersecurity best practices\n\nWhat specific area would you like assistance with?",
      "brute force": "Brute force attacks are automated attempts to gain unauthorized access by trying multiple username/password combinations. Key indicators include:\n• Multiple failed login attempts from the same IP\n• Rapid succession of login attempts\n• Common username patterns (admin, root, user)\n• Unusual timing (off-hours, weekends)\n\nRecommended actions:\n• Implement account lockout policies\n• Use rate limiting\n• Enable multi-factor authentication\n• Block suspicious IP addresses",
      "insider threat": "Insider threats involve malicious or negligent actions by trusted users. Warning signs include:\n• Unusual data access patterns\n• Accessing files outside normal hours\n• Large data downloads\n• Attempting privilege escalation\n• Accessing systems they don't normally use\n\nResponse strategies:\n• Review user permissions\n• Monitor user activities\n• Implement data loss prevention\n• Conduct security awareness training",
      "malware": "Malware detection involves identifying malicious software through various indicators:\n• Suspicious process behavior\n• Unusual network connections\n• Registry modifications\n• File encryption activities\n• High threat scores from security tools\n\nImmediate actions:\n• Isolate affected systems\n• Run full antivirus scans\n• Check for lateral movement\n• Update security signatures",
      "data exfiltration": "Data exfiltration is the unauthorized transfer of sensitive data outside the organization. Indicators include:\n• Large data transfers to external servers\n• Unusual cloud storage uploads\n• Data transfers outside business hours\n• Unencrypted sensitive data transfers\n• Connections to suspicious external IPs\n\nPrevention measures:\n• Implement data loss prevention (DLP)\n• Monitor data access patterns\n• Use encryption for sensitive data\n• Restrict external data transfers"
    };

    // Find the best matching response
    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Default responses for common questions
    if (lowerMessage.includes("what") && lowerMessage.includes("alert")) {
      return "Security alerts are notifications about potential security threats detected by your monitoring systems. Each alert contains:\n• Threat type and severity level\n• Evidence and indicators\n• Timestamp and source information\n• AI-generated analysis and recommendations\n\nWould you like me to explain a specific alert in detail?";
    }

    if (lowerMessage.includes("how") && lowerMessage.includes("remediate")) {
      return "Remediation involves taking action to contain and resolve security threats. Our system offers several automated remediation options:\n• Block IP addresses\n• Disable compromised accounts\n• Quarantine malicious files\n• Reset passwords\n\nEach action requires justification and confirmation. Would you like me to walk you through the remediation process for a specific alert?";
    }

    if (lowerMessage.includes("severity")) {
      return "Alert severity levels indicate the potential impact and urgency:\n• **Critical**: Immediate threat requiring urgent response\n• **High**: Significant threat requiring prompt attention\n• **Medium**: Moderate threat requiring investigation\n• **Low**: Minor threat for routine review\n\nThe severity helps prioritize your response efforts and resource allocation.";
    }

    // Fallback response
    return "I understand you're asking about security operations. While I can help with general cybersecurity concepts, for specific alerts in your dashboard, I'd recommend clicking on individual alerts to get detailed AI analysis. Is there a particular security topic or alert you'd like me to explain?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: "Explain Brute Force", query: "brute force" },
    { label: "Insider Threats", query: "insider threat" },
    { label: "Malware Detection", query: "malware" },
    { label: "Data Exfiltration", query: "data exfiltration" },
    { label: "Get Help", query: "help" }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">SOC Assistant</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Security Help</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => setInputValue(action.query)}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about security alerts, threats, or remediation..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
