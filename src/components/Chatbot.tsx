import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Fab,
  Badge,
  Tooltip,
  Zoom,
  Chip as MuiChip,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import MinimizeIcon from '@mui/icons-material/Minimize';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import PlaceIcon from '@mui/icons-material/Place';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import '../styles/components/chatbot.css';

// FAQ database
const faqs = [
  {
    keywords: ['hour', 'time', 'open', 'close', 'business'],
    answer: 'We are open Monday to Sunday from 4PM to 2AM. Come enjoy the night with us! 🕺',
    hasMap: false
  },
  {
    keywords: ['location', 'address', 'where', 'find', 'place', 'map'],
    answer: 'We are located at 358 M. Vicente St, Brgy. Malamig, Mandaluyong City. Easy to find with great parking! 📍 Check out the map below:',
    hasMap: true
  },
  {
    keywords: ['reservation', 'book', 'table', 'reserve'],
    answer: 'You can make a reservation through our website\'s Reservation page or by calling us at (02) 8123-4567. We recommend booking ahead on game nights! 📅',
    hasMap: false
  },
  {
    keywords: ['menu', 'food', 'drink', 'offer', 'serve'],
    answer: 'Our menu features craft beers, signature cocktails, and amazing bar food like our famous wings and loaded nachos! Check our Menu page for the full experience. 🍻🍔',
    hasMap: false
  },
  {
    keywords: ['event', 'show', 'entertainment', 'live', 'music', 'game', 'watch'],
    answer: 'We show all major sports events on our big screens! We also host live music events and karaoke nights regularly. Follow our social media for event schedules! 🏀🎸',
    hasMap: false
  },
  {
    keywords: ['parking', 'park', 'car', 'vehicle'],
    answer: 'Yes! We have free parking space available for our customers. No need to worry about where to leave your car. 🚗',
    hasMap: false
  },
  {
    keywords: ['billiards', 'pool', 'table', 'game'],
    answer: 'We have 8 professional billiards tables available. First come, first served, but you can reserve them for tournaments or private events! 🎱',
    hasMap: false
  },
  {
    keywords: ['karaoke', 'sing', 'song', 'ktv'],
    answer: 'Our 5 private karaoke rooms are perfect for parties! Each room fits 4-12 people and has its own service button for drinks. Book in advance on weekends! 🎤',
    hasMap: false
  },
  {
    keywords: ['help', 'assist', 'support', 'information'],
    answer: 'I can answer questions about our hours, location, menu, reservations, and facilities. What would you like to know? Just ask away! 💬',
    hasMap: false
  }
];

// Suggestions for user
const suggestions = [
  "What are your hours?",
  "Where are you located?",
  "How do I make a reservation?",
  "Tell me about your menu",
  "Do you show NBA games?",
  "Do you have parking?",
  "How many pool tables do you have?"
];

// Google Maps embed URL for Stop Shot Sports Bar
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.421774913128!2d121.04219071038666!3d14.575026185849502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9459c58bcb7%3A0x563ad18fc323e83d!2sStop%20Shot%20Sports%20Bar%20%26%20KTV!5e0!3m2!1sen!2sph!4v1741402972614!5m2!1sen!2sph";

// Bot responds to user query
const getBotResponse = (userMessage: string) => {
  const lowercaseMessage = userMessage.toLowerCase();

  // Check for greetings
  if (/hi|hello|hey|greetings/i.test(lowercaseMessage)) {
    return {
      text: "Hey there! Welcome to StopShot! How can I help you tonight? 😊🍻",
      hasMap: false
    };
  }

  // Check for thanks
  if (/thank|thanks|appreciate/i.test(lowercaseMessage)) {
    return {
      text: "You're welcome! That's what I'm here for! Anything else you want to know about StopShot? 🎱",
      hasMap: false
    };
  }

  // Check for goodbye
  if (/bye|goodbye|see you|later/i.test(lowercaseMessage)) {
    return {
      text: "Hope to see you at StopShot soon! Have a great day! 👋",
      hasMap: false
    };
  }

  // Check against keywords
  for (const faq of faqs) {
    if (faq.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return {
        text: faq.answer,
        hasMap: faq.hasMap
      };
    }
  }

  // Default response
  return {
    text: "I'm not sure about that, but our friendly staff can help you with any specific questions! Call us at (02) 8123-4567 or drop by and ask in person. We love to chat! 🍻",
    hasMap: false
  };
};

interface MessageResponse {
  text: string;
  hasMap: boolean;
}

interface Message {
  text: string;
  isBot: boolean;
  isTyping?: boolean;
  hasMap?: boolean;
}

type Position = { x: number; y: number };

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey! What's up? How can I help you enjoy StopShot Sports Bar? 🎱🍻", isBot: true }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 340, height: 480 });
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Periodically animate the chat button when closed
  useEffect(() => {
    if (!open) {
      const interval = setInterval(() => {
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 1500);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [open]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Suggest a tip after 30 seconds of inactivity
  useEffect(() => {
    if (open && messages.length <= 2) {
      const timeout = setTimeout(() => {
        const suggestedTip = "💡 Tip: You can ask me about our hours, menu, games, or special events!";
        setMessages(prev => [...prev, { text: suggestedTip, isBot: true }]);
      }, 25000);
      return () => clearTimeout(timeout);
    }
  }, [open, messages]);

  // Focus input field when chat opens
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 300);
    }
  }, [open, minimized]);

  // Show special message at night
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 4) { // Between 8pm and 4am
      setTimeout(() => {
        if (messages.length === 1) {
          setMessages(prev => [...prev, { 
            text: "Looking for late-night fun? We're open until 2AM every day! 🌙✨", 
            isBot: true 
          }]);
        }
      }, 10000);
    }
  }, [messages]);

  const handleToggleChat = () => {
    setOpen(!open);
    setMinimized(false);
    if (!open) {
      setNotification(false);
      setPosition({ x: 0, y: 0 });
      setHasDragged(false);
    }
  };

  const handleMinimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimized(!minimized);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const updatedMessages = [
      ...messages,
      { text: inputText, isBot: false }
    ];
    setMessages(updatedMessages);
    setInputText("");

    // Show typing indicator
    setIsTyping(true);
    setMessages(current => [...current, { text: "", isBot: true, isTyping: true }]);

    // Get bot response with a realistic delay
    const responseTime = Math.max(600, inputText.length * 35);
    setTimeout(() => {
      const botResponse = getBotResponse(inputText);
      setIsTyping(false);
      // Replace typing indicator with the actual response
      setMessages(current =>
        current.filter(msg => !msg.isTyping).concat([{ 
          text: botResponse.text, 
          isBot: true,
          hasMap: botResponse.hasMap 
        }])
      );
    }, responseTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    chatInputRef.current?.focus();
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
    setHasDragged(true);
  };

  const handleResizeStop = (_e: React.SyntheticEvent, data: ResizeCallbackData) => {
    setDimensions({
      width: data.size.width,
      height: data.size.height,
    });
  };

  // Trigger notification when component mounts
  useEffect(() => {
    setTimeout(() => setNotification(true), 5000);
  }, []);

  return (
    <Box className="chatbot-container">
      {open ? (
        <Draggable
          nodeRef={nodeRef}
          handle=".drag-handle"
          bounds="parent"
          position={hasDragged ? position : undefined}
          defaultPosition={{ x: 0, y: 0 }}
          onStop={handleDragStop} 
          cancel=".react-resizable-handle"
        >
          <Box
            ref={nodeRef}
            className={`chatbot-draggable ${minimized ? 'minimized' : ''}`}
            sx={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              pointerEvents: 'auto',
              maxWidth: 'calc(100vw - 40px)',
              maxHeight: 'calc(100vh - 40px)',
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              transition: 'height 0.3s ease',
            }}
          >
            {minimized ? (
              // Minimized Header Bar
              <Box
                className="chatbot-minimized-header drag-handle"
                sx={{
                  bgcolor: '#1e1e1e',
                  color: 'white',
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'move',
                  userSelect: 'none',
                  borderRadius: 2,
                  width: 280,
                  backgroundImage: 'linear-gradient(to right, #d38236, #a34d00)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                }}
                onClick={handleMinimizeChat}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar className="chatbot-avatar">
                    <SportsBarIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>
                    StopShot Assistant
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <IconButton 
                    size="small" 
                    onClick={handleMinimizeChat} 
                    className="minimize-btn"
                    sx={{ color: 'white' }}
                  >
                    <OpenInFullIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={handleToggleChat}
                    className="close-btn"
                    sx={{ color: 'white' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              // Full Chat Interface
              <ResizableBox
                width={dimensions.width}
                height={dimensions.height}
                onResizeStop={handleResizeStop}
                minConstraints={[300, 400]}
                maxConstraints={[600, window.innerHeight - 40]}
                resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
                className="chatbot-resizable"
              >
                <Paper
                  elevation={0}
                  className="chatbot-paper"
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: '#121212',
                    backgroundImage: 'linear-gradient(to bottom right, rgba(211, 130, 54, 0.05), rgba(0, 0, 0, 0))',
                    color: '#fff',
                  }}
                >
                  {/* Chat Header */}
                  <Box 
                    className="chatbot-header drag-handle"
                    sx={{
                      backgroundImage: 'linear-gradient(to right, #d38236, #a34d00)',
                      color: 'white',
                      p: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'move',
                      userSelect: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DragIndicatorIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
                      <Avatar 
                        className="chatbot-avatar" 
                        sx={{ bgcolor: '#1e1e1e', mr: 1 }}
                      >
                        <SportsBarIcon sx={{ color: '#d38236' }} />
                      </Avatar>
                      <Typography variant="h6" className="chatbot-title">
                        StopShot Assistant
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={handleMinimizeChat}
                        className="minimize-btn"
                      >
                        <MinimizeIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={handleToggleChat}
                        className="close-btn"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Chat Messages */}
                  <Box
                    className="chatbot-messages"
                    sx={{
                      flexGrow: 1,
                      overflow: 'auto',
                      p: 2,
                      bgcolor: '#1a1a1a',
                      backgroundImage: `
                        radial-gradient(circle at 20% 35%, rgba(211, 130, 54, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 75% 65%, rgba(211, 130, 54, 0.1) 0%, transparent 50%)
                      `,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Chat Messages List */}
                    <List className="messages-list">
                      {messages.map((message, index) => (
                        <ListItem
                          key={index}
                          className={`message-item ${message.isBot ? 'bot-message' : 'user-message'}`}
                        >
                          {message.isBot && (
                            <Avatar
                              className="message-avatar"
                              sx={{
                                bgcolor: message.isBot ? '#d38236' : '#424242',
                              }}
                            >
                              {message.isBot ? <SportsBasketballIcon /> : null}
                            </Avatar>
                          )}
                          <Box
                            className={`message-bubble ${message.isBot ? 'bot-bubble' : 'user-bubble'}`}
                          >
                            {message.isTyping ? (
                              <Box className="typing-indicator">
                                {[0, 1, 2].map((i) => (
                                  <Box
                                    key={i}
                                    className="typing-dot"
                                  />
                                ))}
                              </Box>
                            ) : (
                              <>
                                <Typography variant="body1" className="message-text">
                                  {message.text}
                                </Typography>
                                
                                {/* Google Maps Embed */}
                                {message.hasMap && (
                                  <Box className="map-container" mt={2}>
                                    <Box className="map-header">
                                      <PlaceIcon className="map-icon" />
                                      <Typography variant="caption">
                                        StopShot Sports Bar & KTV
                                      </Typography>
                                    </Box>
                                    <iframe
                                      src={GOOGLE_MAPS_EMBED_URL}
                                      width="100%"
                                      height="180"
                                      style={{ 
                                        border: 0,
                                        borderRadius: '8px',
                                        marginTop: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                      }}
                                      allowFullScreen
                                      loading="lazy"
                                      referrerPolicy="no-referrer-when-downgrade"
                                      title="Stop Shot Sports Bar & KTV Location"
                                    ></iframe>
                                  </Box>
                                )}
                              </>
                            )}
                          </Box>
                        </ListItem>
                      ))}
                      <div ref={messagesEndRef} />
                    </List>
                  </Box>

                  {/* Quick Suggestions */}
                  {messages.length <= 3 && (
                    <Box className="suggestions-container">
                      {suggestions.map((suggestion, index) => (
                        <MuiChip
                          key={index}
                          label={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="suggestion-chip"
                        />
                      ))}
                    </Box>
                  )}

                  {/* Chat Input */}
                  <Box className="chatbot-input-container">
                    <TextField
                      inputRef={chatInputRef}
                      fullWidth
                      placeholder="Type your question..."
                      variant="outlined"
                      size="small"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="chatbot-input-field"
                    />
                    <Tooltip title="Send message" placement="top" TransitionComponent={Zoom}>
                      <Box sx={{ flexShrink: 0 }}>
                        <IconButton
                          onClick={handleSendMessage}
                          disabled={!inputText.trim()}
                          className={`send-button ${!inputText.trim() ? 'disabled' : ''}`}
                        >
                          <SendIcon />
                        </IconButton>
                      </Box>
                    </Tooltip>
                  </Box>
                </Paper>
              </ResizableBox>
            )}
          </Box>
        </Draggable>
      ) : (
        // Chat Button with Notification Badge
        <Box className="chat-button-container">
          <Badge
            badgeContent={notification ? "1" : 0}
            color="error"
            className="chat-notification-badge"
          >
            <Tooltip title="Chat with us" placement="left" arrow>
              <Fab
                aria-label="chat"
                onClick={handleToggleChat}
                className={`chat-fab-button ${pulseAnimation ? 'pulse' : ''}`}
              >
                <ChatIcon />
              </Fab>
            </Tooltip>
          </Badge>
        </Box>
      )}
    </Box>
  );
};

export default Chatbot;