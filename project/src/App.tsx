import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BrainCog, Plus } from 'lucide-react';
import { Message, KnowledgeBaseEntry } from './types';
import { knowledgeBase } from './knowledgeBase';
import { findBestMatch } from './utils/chatUtils';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m an AI assistant with a knowledge base. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTeaching, setIsTeaching] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTeach = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const newEntry: KnowledgeBaseEntry = {
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      };
      
      knowledgeBase.questions.push(newEntry);

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `Thanks for teaching me! I've learned that "${newQuestion}" should be answered with "${newAnswer}"`,
        sender: 'bot',
        timestamp: new Date(),
      }]);

      setNewQuestion('');
      setNewAnswer('');
      setIsTeaching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Find the best matching response using our improved matching algorithm
    const bestMatch = findBestMatch(input, knowledgeBase.questions);
    
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: bestMatch 
          ? bestMatch.answer
          : "I don't know the answer to that. Would you like to teach me? Click the 'Teach AI' button above.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 500); // Reduced delay for better responsiveness
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-sm p-4 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">AI Assistant</h1>
            </div>
            <button
              onClick={() => setIsTeaching(!isTeaching)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <BrainCog className="w-5 h-5" />
              Teach AI
            </button>
          </div>
        </div>

        {/* Teaching Interface */}
        {isTeaching && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
            <h2 className="text-lg font-semibold mb-4">Teach the AI Something New</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a question..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <input
                  type="text"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the answer..."
                />
              </div>
              <button
                onClick={handleTeach}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add to Knowledge Base
              </button>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-white rounded-b-lg shadow-sm mb-4">
          <div className="h-[600px] overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-start gap-2.5 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user'
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">AI is thinking...</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 p-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;