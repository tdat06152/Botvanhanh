import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { askBot } from '../lib/gemini';

function ChatInterface() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Xin chào, tôi là Bot hỗ trợ vận hành. Hãy đặt câu hỏi về quy trình làm việc tại bưu cục cho tôi nhé!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // --- CƠ CHẾ MẬT KHẨU ADMIN ---
        if (input.trim() === 'admin@ghn') {
            navigate('/admin');
            return;
        }
        // ----------------------------

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const history = messages.slice(-5);
        const aiResponse = await askBot(input, history);

        setMessages(prev => [...prev, {
            role: 'bot',
            text: aiResponse.text,
            sources: aiResponse.sources
        }]);
        setIsLoading(false);
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
                    <Bot size={24} color="white" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Trợ Lý Vận Hành GHN</h1>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>READY TO HELP • ROTATING API ACTIVE</p>
                </div>
            </div>

            <div className="messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            {msg.role === 'bot' ? <Sparkles size={14} color="#00a0fa" /> : <User size={14} />}
                            <span style={{ fontSize: '0.7rem', fontWeight: '700', opacity: 0.7 }}>
                                {msg.role === 'bot' ? 'ASSISTANT' : 'YOU'}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{msg.text}</div>
                        {msg.sources && msg.sources.length > 0 && (
                            <div className="sources" style={{ marginTop: '10px', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontWeight: '600', color: '#00a0fa' }}>Nguồn:</span> {msg.sources.map(s => s.q).join(', ')}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="message bot" style={{ opacity: 0.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <span>Bot đang tra cứu quy trình...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <input
                    type="text"
                    placeholder="Nhập câu hỏi quy trình..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} disabled={isLoading} style={{ opacity: isLoading ? 0.5 : 1 }}>
                    <Send size={20} />
                </button>
            </div>

            <style>{`
        .typing-dot { width: 4px; height: 4px; background: white; border-radius: 50%; animation: blink 1.4s infinite both; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
      `}</style>
        </div>
    );
}

export default ChatInterface;
