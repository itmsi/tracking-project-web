import React, { useState, useRef, useEffect } from 'react';
import { useWebSocketChat } from '../../hooks/useWebSocketChat';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

interface TaskChatWebSocketProps {
  taskId: string;
  permissions?: any;
  initialMessages?: any[];
}

const TaskChatWebSocket: React.FC<TaskChatWebSocketProps> = ({ taskId, permissions, initialMessages = [] }) => {
  const {
    messages,
    isConnected,
    isLoading,
    error,
    typingUsers,
    onlineUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    stopTyping
  } = useWebSocketChat(taskId, initialMessages);

  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user } = useSelector((state: any) => state.auth);
  const canComment = permissions?.permissions?.can_comment !== false;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() && !isLoading) {
      sendMessage(newMessage.trim());
      setNewMessage('');
      stopTyping();
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!isConnected) return;

    try {
      editMessage(messageId, editText.trim());
      setEditingMessage(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?') || !isConnected) return;

    try {
      deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const startEdit = (message: any) => {
    setEditingMessage(message.id);
    setEditText(message.message);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText('');
  };

  // Handle typing
  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (value.trim()) {
      startTyping();
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 1000);
    } else {
      stopTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTyping(e.target.value);
  };

  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0].userName} is typing...`;
    if (typingUsers.length === 2) return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`;
    return `${typingUsers.length} people are typing...`;
  };

  return (
    <div className="task-chat-websocket">
      <div className="chat-header">
        <div className="chat-title">
          <h3>Task Chat</h3>
          <div className="chat-status">
            <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 Online' : '🔴 Offline'}
            </span>
            <span className="message-count">{messages.length} messages</span>
          </div>
        </div>
        
        <div className="online-users">
          <span className="online-count">{onlineUsers.length} online</span>
          {onlineUsers.length > 0 && (
            <div className="online-list">
              {onlineUsers.map((user: any) => (
                <span key={user.userId} className="online-user">
                  {user.userName}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message: any) => (
          <div key={message.id} className="chat-message">
            <div className="message-avatar">
              <img 
                src={message.avatar_url || '/default-avatar.png'} 
                alt={message.first_name}
              />
            </div>
            
            <div className="message-content">
              <div className="message-header">
                <span className="message-author">
                  {message.first_name} {message.last_name}
                </span>
                <span className="message-time">
                  {format(new Date(message.created_at), 'HH:mm')}
                </span>
                {message.is_edited && (
                  <span className="message-edited">(edited)</span>
                )}
              </div>

              {editingMessage === message.id ? (
                <div className="message-edit">
                  <textarea
                    className="form-control"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    ref={textareaRef}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEditMessage(message.id)}
                    >
                      Save
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="message-text">{message.message}</div>
              )}

              {message.attachments && message.attachments.length > 0 && (
                <div className="message-attachments">
                  {message.attachments.map((attachment: any, index: number) => (
                    <div key={index} className="attachment">
                      <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                        📎 {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {message.user_id === user?.id && (
                <div className="message-actions">
                  <button 
                    className="btn btn-sm btn-link"
                    onClick={() => startEdit(message)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-link text-danger"
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {getTypingText() && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="typing-text">{getTypingText()}</span>
        </div>
      )}

      {canComment && (
        <form className="chat-input" onSubmit={handleSendMessage}>
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button 
              className="btn btn-primary" 
              type="submit"
              disabled={!newMessage.trim() || isLoading}
            >
              Send
            </button>
          </div>
        </form>
      )}

      {!canComment && (
        <div className="chat-no-permission">
          <p className="text-muted">You don't have permission to comment on this task</p>
        </div>
      )}

      {error && (
        <div className="chat-error">
          <p className="text-danger">Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default TaskChatWebSocket;
