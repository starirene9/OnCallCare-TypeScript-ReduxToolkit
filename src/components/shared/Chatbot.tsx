import React, { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chatbot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: "assistant",
      content: "안녕하세요! OnCallCare 의사 도우미입니다. 무엇을 도와드릴까요?",
    },
  ]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage: Message = { role: "user", content: userInput };
    setChatHistory([...chatHistory, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("https://api.cohere.ai/v1/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          model: "command-r-plus",
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.statusText}`);
      }

      const data = await response.json();

      const botReply: Message = {
        role: "assistant",
        content: data.text,
      };

      setChatHistory([...chatHistory, newMessage, botReply]);
    } catch (error) {
      console.error("Cohere API 호출 오류:", error);
    } finally {
      setIsLoading(false);
    }

    setUserInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleChat}
        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-1 transition-all duration-300 mr-6"
      >
        <span className="text-sm">의사 도우미 챗봇</span>
      </button>
      <div
        className={`absolute bottom-12 left-0 bg-white rounded-lg shadow-xl w-80 md:w-101 transition-all duration-300 transform origin-bottom-left ${
          isChatOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-blue-500 p-3 rounded-t-lg flex justify-between items-center">
          <h3 className="font-medium text-white">OnCallCare 의사 도우미</h3>
          <button
            onClick={toggleChat}
            className="text-white hover:bg-blue-600 rounded-full p-1"
          >
            X
          </button>
        </div>
        <div className="h-90 p-3 overflow-y-auto bg-gray-50 backdrop-blur-sm">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <p className="text-black inline-block bg-gray-100 rounded-lg p-2 max-w-3/4 shadow-sm">
                <strong className="text-black">
                  {msg.role === "user" ? "👤 :" : "🤖 챗봇:"}
                </strong>{" "}
                <span className="text-black">{msg.content}</span>
              </p>
            </div>
          ))}
          {isLoading && (
            <div className="mb-2 text-left">
              <div className="text-black inline-block bg-gray-100 rounded-lg p-2">
                <div className="flex items-center">
                  <strong className="text-black">🤖 챗봇:</strong>
                  <div className="ml-2 flex space-x-1">
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-gray-200 flex">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 border border-gray-300 rounded-l-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className={`${
              isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-r-lg px-4 transition-colors`}
            disabled={isLoading}
          >
            {isLoading ? "처리중..." : "전송"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
