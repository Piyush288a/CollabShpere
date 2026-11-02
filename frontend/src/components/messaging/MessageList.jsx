import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SocketContext } from '../../context/SocketContext';
import { messageService } from '../../services/message.service';
import { collaborationService } from '../../services/collaboration.service';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { MessageSquare, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import '../../styles/global.css';

export const MessageList = ({ projectId }) => {
  const { user } = useAuth();
  const { socket, socketService } = useContext(SocketContext) || {};
  
  const currentUserId = user?._id || user?.id;

  const [messages, setMessages] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load message history & team members
  const loadHistoryAndTeam = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [msgRes, teamRes] = await Promise.all([
        messageService.getProjectMessages(projectId, { limit: 100 }),
        collaborationService.getProjectTeam(projectId).catch(() => ({ members: [] })),
      ]);

      // REST returns newest-first; reverse to display chronologically (oldest at top)
      const chronological = (msgRes.results || []).slice().reverse();
      setMessages(chronological);
      setTeamMembers(teamRes.members || []);
    } catch (err) {
      console.error('Failed to load message history:', err);
      setError(err.message || 'Unable to load workspace messages.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadHistoryAndTeam();
    }
  }, [projectId]);

  // Socket Lifecycle & Event Listeners
  useEffect(() => {
    if (!projectId || !socketService) return;

    let isMounted = true;

    // Join room on backend socket
    socketService.joinProject(projectId, (ack) => {
      if (isMounted) {
        if (ack && ack.ok) {
          setSocketConnected(true);
        } else {
          console.warn('Socket room join response:', ack);
        }
      }
    });

    // Event handler for incoming live messages
    const handleNewMessage = (newMsg) => {
      if (String(newMsg.projectId) !== String(projectId)) return;

      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some((m) => String(m._id) === String(newMsg._id))) {
          return prev;
        }
        return [...prev, newMsg];
      });
    };

    socketService.onNewMessage(handleNewMessage);

    // Socket status listener
    const currentSocket = socketService.getSocket();
    if (currentSocket) {
      setSocketConnected(currentSocket.connected);
      
      const onConnect = () => setSocketConnected(true);
      const onDisconnect = () => setSocketConnected(false);

      currentSocket.on('connect', onConnect);
      currentSocket.on('disconnect', onDisconnect);

      return () => {
        isMounted = false;
        socketService.offNewMessage(handleNewMessage);
        socketService.leaveProject(projectId);
        currentSocket.off('connect', onConnect);
        currentSocket.off('disconnect', onDisconnect);
      };
    }

    return () => {
      isMounted = false;
      socketService.offNewMessage(handleNewMessage);
      socketService.leaveProject(projectId);
    };
  }, [projectId, socketService, socket]);

  // Send message handler
  const handleSendMessage = async (text) => {
    try {
      const res = await messageService.sendMessage(projectId, text);
      const sentMsg = res.message;
      if (sentMsg) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(sentMsg._id))) {
            return prev;
          }
          return [...prev, sentMsg];
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      display: 'flex',
      flexDirection: 'column',
      height: '620px',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        borderBottom: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--color-bg-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <MessageSquare size={18} color="var(--color-accent)" />
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-extrabold)', margin: 0 }}>
            Team Discussion
          </h3>
        </div>

        {/* Live Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: 'var(--font-size-xs)',
          color: socketConnected ? '#166534' : 'var(--color-text-muted)',
          backgroundColor: socketConnected ? '#F0FDF4' : 'var(--color-bg-primary)',
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          fontWeight: 'var(--font-weight-medium)',
        }}>
          {socketConnected ? (
            <>
              <Wifi size={13} />
              <span>Realtime Live</span>
            </>
          ) : (
            <>
              <WifiOff size={13} />
              <span>Connecting...</span>
            </>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        padding: 'var(--space-lg)',
        overflowY: 'auto',
        backgroundColor: 'var(--color-bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {isLoading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 'var(--space-md)',
            color: 'var(--color-text-muted)',
          }}>
            <Loader2 size={32} className="spin" style={{ color: 'var(--color-accent)' }} />
            <span style={{ fontSize: 'var(--font-size-sm)' }}>Loading message history...</span>
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            fontSize: 'var(--font-size-sm)',
            margin: 'auto 0',
          }}>
            <AlertCircle size={24} style={{ marginBottom: 'var(--space-xs)' }} />
            <div>{error}</div>
          </div>
        ) : messages.length === 0 ? (
          /* Empty Chat State */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            padding: 'var(--space-xl)',
          }}>
            <MessageSquare size={44} color="var(--color-text-subtle)" style={{ marginBottom: 'var(--space-md)' }} />
            <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)', marginBottom: '4px' }}>
              No messages yet
            </h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', maxWidth: '360px', margin: 0 }}>
              Start the discussion! Send a message below to coordinate tasks, share links, or say hello to your team.
            </p>
          </div>
        ) : (
          /* Message List Bubbles */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                currentUserId={currentUserId}
                teamMembers={teamMembers}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Composer Footer */}
      <MessageComposer onSend={handleSendMessage} disabled={isLoading || Boolean(error)} />
    </div>
  );
};
