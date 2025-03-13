import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chatbot: React.FC = () => {
  const intl = useIntl();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  useEffect(() => {
    setChatHistory([
      {
        role: "assistant",
        content: intl.formatMessage({ id: "chatbot_welcome_message" }),
      },
    ]);
  }, [intl]);

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
        <span className="text-sm">
          {intl.formatMessage({ id: "chatbot_open_button" })}
        </span>
      </button>
      <div
        className={`absolute bottom-12 left-0 bg-white rounded-lg shadow-xl w-80 md:w-101 transition-all duration-300 transform origin-bottom-left ${
          isChatOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-blue-500 p-3 rounded-t-lg flex justify-between items-center">
          <h3 className="font-medium text-white">
            {intl.formatMessage({ id: "chatbot_title" })}
          </h3>
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
                  {msg.role === "user" ? "👤 :" : "🤖 :"}
                </strong>{" "}
                <span className="text-black">{msg.content}</span>
              </p>
            </div>
          ))}
          {isLoading && (
            <div className="mb-2 text-left">
              <div className="text-black inline-block bg-gray-100 rounded-lg p-2">
                <div className="flex items-center">
                  <strong className="text-black">
                    {intl.formatMessage({ id: "chatbot_assistant_label" })}
                  </strong>
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
            placeholder={intl.formatMessage({
              id: "chatbot_input_placeholder",
            })}
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
            {isLoading
              ? `${intl.formatMessage({ id: "chatbot_loading" })}`
              : `${intl.formatMessage({ id: "chatbot_send_button" })}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
