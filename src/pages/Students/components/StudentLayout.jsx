import React, { useRef, useState, useEffect } from "react";
import StudentSidebar from "./StudentSidebar"; // Sibling import

const StudentLayout = ({
  children,
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleTheme,
  handleLogout,
  currentUser,
  menuItems,
}) => {
  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi ${currentUser?.fullName?.split(" ")[0] || "there"}! I'm your CareerVector AI assistant.`,
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  // Chat Logic
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    setMessages([...messages, { id: Date.now(), text: inputValue, sender: "user" }]);
    setInputValue("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "I'm analyzing your profile...", sender: "bot" },
      ]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showChat]);

  return (
    // The 'dark' class is technically handled on <html> by Portal, 
    // but wrapping here ensures local consistency if needed.
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen w-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden transition-colors duration-300">
        
        {/* SIDEBAR */}
        <StudentSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          menuItems={menuItems}
        />

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Top Header */}
          <div className="h-16 bg-slate-900 flex items-center justify-between px-8 shadow-md z-10 flex-shrink-0 border-b border-slate-800">
            <div className="text-slate-400 text-sm font-medium">
              Dashboard / <span className="text-white">{activeTab}</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                    <p className="text-xs text-slate-400">Welcome,</p>
                    <p className="text-sm font-bold text-white leading-none">{currentUser?.fullName || "Guest"}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20 ring-2 ring-slate-800">
                {getInitials(currentUser?.fullName)}
                </div>
            </div>
          </div>

          {/* DYNAMIC CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 scroll-smooth">
            {children}
          </div>
        </div>

        {/* CHAT WIDGET OVERLAY */}
        {showChat && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="w-full max-w-md h-[600px] bg-white dark:bg-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-fade-in-up border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Career Assistant
                  </h3>
                </div>
                <button
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors"
                  onClick={() => setShowChat(false)}
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 bg-slate-50 dark:bg-slate-900/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "self-end bg-blue-600 text-white rounded-br-none"
                        : "self-start bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-600"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2 bg-white dark:bg-slate-800">
                <input
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2 transition-all font-medium text-sm shadow-md hover:shadow-lg active:scale-95"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-2xl border-none cursor-pointer shadow-lg shadow-blue-600/30 transition-all hover:scale-110 flex items-center justify-center z-40 active:scale-90"
          onClick={() => setShowChat(!showChat)}
        >
          💬
        </button>
      </div>
    </div>
  );
};

export default StudentLayout;