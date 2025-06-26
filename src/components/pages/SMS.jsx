import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import smsService from '@/services/api/smsService';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const SMS = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.Id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await smsService.getAll();
      setConversations(data);
    } catch (err) {
      setError('Failed to load conversations');
      toast.error('Failed to load SMS conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setMessagesLoading(true);
      const data = await smsService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const messageData = {
        conversationId: selectedConversation.Id,
        content: newMessage.trim(),
        sender: 'agent',
        timestamp: new Date().toISOString()
      };

      const sentMessage = await smsService.sendMessage(messageData);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Update conversation last message
      setConversations(prev => 
        prev.map(conv => 
          conv.Id === selectedConversation.Id 
            ? { ...conv, lastMessage: newMessage.trim(), lastMessageTime: new Date().toISOString() }
            : conv
        )
      );
      
      toast.success('Message sent successfully');
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.phoneNumber.includes(searchTerm) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return format(date, 'HH:mm');
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  if (loading) {
    return (
      <div className="h-full p-4 lg:p-6">
        <div className="h-full flex gap-6">
          <div className="w-80 space-y-4">
            <SkeletonLoader count={6} type="message" />
          </div>
          <div className="flex-1">
            <SkeletonLoader count={3} type="message" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-4 lg:p-6 flex items-center justify-center">
        <ErrorState
          message={error}
          onRetry={loadConversations}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Conversations List */}
      <div className="w-full lg:w-80 flex-shrink-0 border-r border-surface-200 bg-white">
        <div className="p-4 border-b border-surface-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">SMS Conversations</h2>
            <Button size="sm" variant="outline">
              <ApperIcon name="Plus" size={16} />
              New Chat
            </Button>
          </div>
          <SearchBar
            placeholder="Search conversations..."
            onSearch={setSearchTerm}
            className="w-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="No conversations found"
                description="Start a new SMS conversation with your customers"
                icon="MessageSquare"
              />
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.Id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedConversation?.Id === conversation.Id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-surface-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="User" size={18} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-surface-900 truncate">
                          {conversation.customerName}
                        </h3>
                        <span className="text-xs text-surface-500">
                          {formatMessageTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-surface-500 mb-1">{conversation.phoneNumber}</p>
                      <p className="text-sm text-surface-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unreadCount > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {conversation.unreadCount} new
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col bg-surface-50">
        {selectedConversation ? (
          <>
            {/* Messages Header */}
            <div className="bg-white border-b border-surface-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <ApperIcon name="User" size={18} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900">{selectedConversation.customerName}</h3>
                  <p className="text-sm text-surface-500">{selectedConversation.phoneNumber}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Phone" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="MoreVertical" size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <SkeletonLoader count={3} type="message" />
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.Id}
                      className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'agent'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-surface-900 border border-surface-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'agent' ? 'text-primary-100' : 'text-surface-500'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-surface-200 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full"
                    disabled={sending}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  loading={sending}
                >
                  <ApperIcon name="Send" size={16} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="MessageSquare" size={24} className="text-surface-400" />
              </div>
              <h3 className="text-lg font-medium text-surface-900 mb-2">Select a conversation</h3>
              <p className="text-surface-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMS;