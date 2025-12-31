import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { MOCK_CONVERSATIONS } from '../constants';
import type { Conversation, ChatMessage } from '../types';
import Button from '../components/Button';
import { useApp } from '../App';

const API_ORIGIN = (import.meta as any).env?.VITE_API_ORIGIN || 'http://localhost:4000';

const ChatWindow: React.FC<{ conversation: Conversation; onSend: (conversationId: string, content: string) => void }> = ({ conversation, onSend }) => {
    const { currentUser } = useApp();
    const [newMessage, setNewMessage] = useState('');
    const [callOpen, setCallOpen] = useState(false);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<Socket | null>(null);

    const handleSend = () => {
        if (newMessage.trim() === '') return;
        onSend(conversation.id, newMessage.trim());
        setNewMessage('');
    };

    const createPeer = () => {
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        pc.onicecandidate = (e) => {
            if (e.candidate && socketRef.current) {
                socketRef.current.emit('webrtc:ice-candidate', { conversationId: conversation.id, candidate: e.candidate });
            }
        };
        pc.ontrack = (e) => {
            const [stream] = e.streams;
            if (remoteVideoRef.current && stream) {
                remoteVideoRef.current.srcObject = stream;
            }
        };
        pcRef.current = pc;
        return pc;
    };

    const ensureLocalStream = async () => {
        if (!mediaStreamRef.current) {
            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }
        if (localVideoRef.current && localVideoRef.current.srcObject !== mediaStreamRef.current) {
            localVideoRef.current.srcObject = mediaStreamRef.current;
            await localVideoRef.current.play();
        }
        return mediaStreamRef.current;
    };

    const startCall = async () => {
        try {
            if (!currentUser) return;
            socketRef.current?.emit('join', { conversationId: conversation.id });
            const stream = await ensureLocalStream();
            const pc = createPeer();
            stream.getTracks().forEach((t) => pc.addTrack(t, stream));
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socketRef.current?.emit('webrtc:offer', { conversationId: conversation.id, sdp: offer });
            setCallOpen(true);
        } catch (err) {
            alert('Unable to start call. Check camera/mic permissions.');
            console.error(err);
        }
    };

    const endCall = () => {
        socketRef.current?.emit('call:ended', { conversationId: conversation.id });
        mediaStreamRef.current?.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
        pcRef.current?.getSenders().forEach(s => {
            try { pcRef.current?.removeTrack(s); } catch {}
        });
        pcRef.current?.close();
        pcRef.current = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        setCallOpen(false);
    };

    useEffect(() => {
        const socket = io(API_ORIGIN, { transports: ['websocket'] });
        socketRef.current = socket;
        socket.emit('join', { conversationId: conversation.id });

        socket.on('webrtc:offer', async ({ sdp }) => {
            try {
                const stream = await ensureLocalStream();
                if (!pcRef.current) createPeer();
                const pc = pcRef.current!;
                stream.getTracks().forEach((t) => pc.getSenders().find(s => s.track === t) || pc.addTrack(t, stream));
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('webrtc:answer', { conversationId: conversation.id, sdp: answer });
                setCallOpen(true);
            } catch (e) {
                console.error('Error handling offer', e);
            }
        });

        socket.on('webrtc:answer', async ({ sdp }) => {
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        });

        socket.on('webrtc:ice-candidate', async ({ candidate }) => {
            try {
                if (pcRef.current && candidate) {
                    await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (e) {
                console.error('ICE error', e);
            }
        });

        socket.on('call:ended', () => endCall());

        return () => {
            socket.disconnect();
            mediaStreamRef.current?.getTracks().forEach(t => t.stop());
            pcRef.current?.close();
        };
    }, [conversation.id]);

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b">
                <img src={conversation.participant.avatar} alt={conversation.participant.name} className="h-10 w-10 rounded-full mr-3" />
                <h2 className="text-lg font-semibold">{conversation.participant.name}</h2>
                <div className="ml-auto flex space-x-2">
                    <button className="text-gray-500 hover:text-gray-700" onClick={() => (callOpen ? endCall() : startCall())}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                {conversation.messages.map((msg: ChatMessage) => (
                    <div key={msg.id} className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === currentUser?.id ? 'bg-primary text-white' : 'bg-white'}`}>
                            <p>{msg.content}</p>
                            <span className="text-xs opacity-75">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
                {callOpen && (
                    <div className="flex justify-center">
                        <div className="rounded-lg overflow-hidden w-full max-w-3xl bg-gray-900/80">
                            <div className="grid grid-cols-2 gap-2 p-2">
                                <video ref={localVideoRef} muted playsInline autoPlay className="w-full h-64 object-cover rounded bg-black" />
                                <video ref={remoteVideoRef} playsInline autoPlay className="w-full h-64 object-cover rounded bg-black" />
                            </div>
                            <div className="flex items-center justify-between p-2 text-white text-sm">
                                <span>Connected</span>
                                <Button size="sm" variant="secondary" onClick={endCall}>End</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend} variant="primary" className="rounded-full !p-3">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </Button>
                </div>
            </div>
        </div>
    );
};


const ChatPage: React.FC = () => {
    const { currentUser } = useApp();
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(MOCK_CONVERSATIONS[0]?.id || null);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

    const sendMessage = (conversationId: string, content: string) => {
        if (!currentUser) return;
        setConversations(prev => prev.map(convo => {
            if (convo.id !== conversationId) return convo;
            const newMsg: ChatMessage = {
                id: `m${Date.now()}`,
                senderId: currentUser.id,
                receiverId: convo.participant.id,
                content,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                seen: false,
            };
            const updated = { ...convo, messages: [...convo.messages, newMsg], lastMessage: content, unreadCount: 0 };
            return updated;
        }));
    };

    return (
        <div className="container mx-auto h-[calc(100vh-8rem)] my-4">
            <div className="flex h-full bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Conversation List */}
                <aside className="w-1/3 border-r flex flex-col">
                    <div className="p-4 border-b">
                        <h1 className="text-xl font-bold">Messages</h1>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(convo => (
                            <div
                                key={convo.id}
                                className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${selectedConversationId === convo.id ? 'bg-indigo-50' : ''}`}
                                onClick={() => setSelectedConversationId(convo.id)}
                            >
                                <img src={convo.participant.avatar} alt={convo.participant.name} className="h-12 w-12 rounded-full mr-4" />
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold truncate">{convo.participant.name}</h3>
                                        {convo.unreadCount > 0 && <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{convo.unreadCount}</span>}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Chat Window */}
                <main className="w-2/3">
                    {selectedConversation ? (
                        <ChatWindow conversation={selectedConversation} onSend={sendMessage} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Select a conversation to start chatting.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ChatPage;