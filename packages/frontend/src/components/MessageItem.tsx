import React from 'react';
import styled from 'styled-components';
import { Message } from '@intelligenai/shared';

interface MessageItemProps {
  message: Message;
  primaryColor: string;
}

const MessageWrapper = styled.div<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 4px;
`;

const MessageBubble = styled.div<{ $isUser: boolean; $primaryColor: string }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  position: relative;
  
  ${props => props.$isUser ? `
    background-color: ${props.$primaryColor};
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    background-color: #f1f3f5;
    color: #333;
    border-bottom-left-radius: 4px;
  `}
  
  /* Message content */
  .content {
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
    white-space: pre-wrap;
  }
`;

const MessageInfo = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 11px;
  color: #666;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

const SenderLabel = styled.span<{ $primaryColor: string }>`
  font-weight: 600;
  color: ${props => props.$primaryColor};
`;

const Timestamp = styled.span`
  color: #999;
`;

const MetadataInfo = styled.div`
  font-size: 10px;
  color: #888;
  margin-top: 2px;
`;

const SystemMessage = styled.div`
  text-align: center;
  padding: 8px 16px;
  margin: 8px 0;
  background-color: #f8f9fa;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
  font-style: italic;
`;

const MessageItem: React.FC<MessageItemProps> = ({ message, primaryColor }) => {
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  const getSenderLabel = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return 'You';
      case 'assistant':
        return 'AI';
      case 'system':
        return 'System';
      default:
        return 'Unknown';
    }
  };

  // Handle system messages differently
  if (message.type === 'system') {
    return (
      <SystemMessage role="status" aria-label={`System message: ${message.content}`}>
        {message.content}
      </SystemMessage>
    );
  }

  const isUser = message.type === 'user';

  return (
    <div role="article" aria-label={`Message from ${getSenderLabel(message.type)}`}>
      <MessageWrapper $isUser={isUser}>
        <MessageBubble $isUser={isUser} $primaryColor={primaryColor}>
          <div className="content">{message.content}</div>
        </MessageBubble>
      </MessageWrapper>

      <MessageInfo $isUser={isUser}>
        <SenderLabel $primaryColor={primaryColor}>
          {getSenderLabel(message.type)}
        </SenderLabel>
        <Timestamp>
          {formatTimestamp(message.timestamp)}
        </Timestamp>

        {message.metadata?.processingTime && (
          <MetadataInfo>
            ({message.metadata.processingTime}ms)
          </MetadataInfo>
        )}
      </MessageInfo>
    </div>
  );
};

export default MessageItem;