import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './chatbox.scss';
import axios from 'axios';


const ChatboxAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Xin chào! Tôi là trợ lý làm đẹp của bạn tại LUMIÈRE. Tôi có thể giúp bạn tìm sản phẩm phù hợp, tư vấn trang điểm và chăm sóc da.',
            timestamp: new Date()
        },
        {
            id: 2,
            type: 'bot',
            text: 'Hôm nay bạn muốn tìm hiểu về sản phẩm nào? Hay bạn cần tư vấn về lớp trang điểm hoàn hảo? ✨',
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (inputValue) => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const res = await axios.post('http://localhost:8000/chatbot/chat', {
                message: inputValue
            });

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: res.data.reply,
                products: res.data.products, // 👈 QUAN TRỌNG
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 2,
                    type: 'bot',
                    text: 'Xin lỗi, hệ thống đang gặp sự cố. Bạn thử lại sau nhé!',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };


    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsFullscreen(false);
    };

    return (
        <div className="chatbox-container">
            {isOpen && (
                <div className={`chatbox-window ${isFullscreen ? 'fullscreen' : ''}`}>
                    <div className="chatbox-header">
                        <div className="header-left">
                            <div className="avatar-wrapper">
                                <div className="avatar">
                                    <span>LM</span>
                                </div>
                                <span className="status-indicator"></span>
                            </div>
                            <div className="header-info">
                                <h3 className="title">Trợ lý LUMIÈRE</h3>
                                <p className="subtitle">Chuyên gia làm đẹp</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button
                                title={isFullscreen ? "Thu nhỏ" : "Phóng to"}
                                onClick={toggleFullscreen}
                            >
                                {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                            </button>
                            <button onClick={handleClose} title="Đóng">
                                <X />
                            </button>
                        </div>
                    </div>
                    <div className="chatbox-messages">
                        <div className="messages-container">
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}

                            {isTyping && (
                                <div className="typing-indicator">
                                    <div className="typing-avatar">
                                        <span>LM</span>
                                    </div>
                                    <div className="typing-bubble">
                                        <div className="typing-dots">
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <ChatInput onSendMessage={handleSendMessage} />
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="chatbox-toggle-btn"
                title="Tư vấn làm đẹp"
            >
                <Sparkles className="icon" size={28} />
            </button>
        </div>
    );
};

export default ChatboxAI;