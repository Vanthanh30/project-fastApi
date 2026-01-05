import React from 'react';
import './chatbox.scss';

const ChatMessage = ({ message }) => {
    const isBot = message.type === 'bot';

    return (
        <div className={`message-item ${isBot ? 'message-bot' : 'message-user'}`}>
            {isBot && (
                <div className="message-avatar">
                    <span>LM</span>
                </div>
            )}
            <div className={`message-bubble ${isBot ? 'bubble-bot' : 'bubble-user'}`}>
                <p className="message-text">{message.text}</p>
                {message.timestamp && (
                    <span className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;