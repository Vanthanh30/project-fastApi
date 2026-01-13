import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './chatbox.scss';

const ChatInput = ({ onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chatbox-input">
            <div className="input-disclaimer">
                Trợ lý AI được tích hợp, thông tin mang tính tham khảo
            </div>
            <div className="input-wrapper">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập câu hỏi về làm đẹp..."
                />
                <button
                    onClick={handleSend}
                    disabled={inputValue.trim() === ''}
                >
                    <Send />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;