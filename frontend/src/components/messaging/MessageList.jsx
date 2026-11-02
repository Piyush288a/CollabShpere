import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SocketContext } from '../../context/SocketContext';
import { messageService } from '../../services/message.service';
import { collaborationService } from '../../services/collaboration.service';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { MessageSquare, Loader2, AlertCircle, Wifi, WifiOff, Terminal, Activity, Zap } from 'lucide-react';
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
        currentSocket.off('connect', onConnect);
        currentSocket.off('disconnect', onDisconnect);
        socketService.leaveProject(projectId);
      };
    }

    return () => {
      isMounted = false;
      socketService.offNewMessage(handleNewMessage);
      socketService.leaveProject(projectId);
    };
  }, [projectId, socketService]);

  const handleSendMessage = async (text) => {
    try {
      const response = await messageService.sendMessage(projectId, text);
      const savedMsg = response.message || response;

      // Optimistically append if not received through socket yet
      setMessages((prev) => {
        if (prev.some((m) => String(m._id) === String(savedMsg._id))) {
          return prev;
        }
        return [...prev, savedMsg];
      });
    } catch (err) {
      console.error('Failed to dispatch message:', err);
      throw err;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '620px',
      backgroundColor: 'rgba(14, 18, 28, 0.7)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
    }}>
      {/* High-Tech Channel Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        backgroundColor: 'rgba(10, 13, 20, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-xs)',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid var(--color-accent-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-cyan)',
          }}>
            <Terminal size={16} />
          </div>
          <div>
            <span style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-bold)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              PROJECT_QUANTUM_STREAM
              <span style={{
                fontSize: '10px',
                color: 'var(--color-text-subtle)',
                fontWeight: 'normal',
              }}>
                [ROOM:{projectId.slice(-6).toUpperCase()}]
              </span>
            </span>
          </div>
        </div>

        {/* Live Network Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-xs)',
          backgroundColor: socketConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
          border: `1px solid ${socketConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
        }}>
          {socketConnected ? (
            <>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-emerald)',
                boxShadow: '0 0 8px var(--color-emerald)',
              }} />
              <span style={{ color: 'var(--color-emerald)', fontWeight: 'bold' }}>LIVE_NODE</span>
            </>
          ) : (
            <>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-danger)',
                boxShadow: '0 0 8px var(--color-danger)',
              }} />
              <span style={{ color: '#f87171' }}>RECONNECTING</span>
            </>
          )}
        </div>
      </div>

      {/* Message Stream Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
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
            gap: '12px',
            color: 'var(--color-cyan)',
          }}>
            <Loader2 size={32} className="spin" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              INITIALIZING SECURE QUANTUM STREAM...
            </span>
          </div>
        ) : error ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '10px',
            color: '#f87171',
          }}>
            <AlertCircle size={28} />
            <span style={{ fontSize: 'var(--font-size-sm)' }}>{error}</span>
          </div>
        ) : messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-cyan)',
            }}>
              <Terminal size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: 'var(--font-size-base)', marginBottom: '4px' }}>
                Channel Initialized
              </h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', maxWidth: '320px' }}>
                No transmission packets detected in this workspace room. Broadcast the first message to synchronize team members.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                currentUserId={currentUserId}
                teamMembers={teamMembers}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Cyber Message Composer */}
      <MessageComposer
        onSendMessage={handleSendMessage}
        disabled={isLoading || Boolean(error)}
      />
    </div>
  );
};
