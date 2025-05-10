import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  TextField, 
  Button, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  FormHelperText,
  Chip,
  Fade,
  useMediaQuery,
  useTheme
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import SendIcon from '@mui/icons-material/Send';
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import CelebrationIcon from '@mui/icons-material/Celebration';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { RiBilliardsFill } from "react-icons/ri";
import '../styles/pages/contactpage.css';
import { sendContactMessage } from '../utils/api';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Validate email format
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Validate Philippine phone number format (09XXXXXXXXX or +639XXXXXXXX)
  const validatePhoneNumber = (phone: string) => {
    if (!phone) return true; // Phone is optional
    const regex = /^(09|\+639)\d{9}$/;
    return regex.test(phone);
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const email = formData.get('email') as string;
    const phone = formData.get('phone_number') as string;
    
    // Reset validation errors
    setEmailError("");
    setPhoneError("");
    
    // Validate email and phone
    let isValid = true;
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    
    if (phone && !validatePhoneNumber(phone)) {
      setPhoneError("Please enter a valid Philippine phone number (09XXXXXXXXX or +639XXXXXXXX)");
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Create payload matching backend requirements
    const payload = {
      email: email,
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      phone_number: phone,
      message_text: formData.get('message_text')
    };
    
    try {
      // Using our API utility
      const response = await sendContactMessage(payload);
      
      setSubmitted(true);
      setOpen(true);
      setIsError(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage((error as any).message || 'Failed to send message. Please try again.');
      setIsError(true);
      setOpen(true);
    } finally {
      setSubmitted(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className="contact-page" sx={{ 
      backgroundColor: '#121212', 
      pt: 2, 
      pb: 10,
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      {/* Ambient background effect */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at top right, rgba(211, 130, 54, 0.15), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at bottom left, rgba(69, 123, 157, 0.08), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Enhanced Hero Section with Night Theme */}
        <Box 
          className="contact-hero" 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            position: 'relative',
            overflow: 'hidden',
            pt: 2,
            backdropFilter: 'blur(5px)',
            borderRadius: '16px',
            px: 3,
            py: 4,
            backgroundColor: 'rgba(18, 18, 18, 0.6)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 1, sm: 0 }
            }}
          >
            <SportsBasketballIcon 
              sx={{ 
                color: '#d38236', 
                fontSize: 40, 
                mr: 2,
                animation: 'bounce 2s infinite',
                display: { xs: 'none', sm: 'block' }
              }} 
            />
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700, 
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textShadow: '0 0 10px rgba(211, 130, 54, 0.5), 0 0 20px rgba(0,0,0,0.5)',
                m: 0,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
              className="contact-title"
            >
              Contact <span style={{ color: '#d38236' }}>StopShot</span>
            </Typography>
            <MicExternalOnIcon 
              sx={{ 
                color: '#d38236', 
                fontSize: 40, 
                ml: 2,
                animation: 'bounce 2s infinite',
                animationDelay: '0.5s',
                display: { xs: 'none', sm: 'block' }
              }} 
            />
          </Box>
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#bbb',
              maxWidth: '700px',
              mx: 'auto',
              fontSize: '1.1rem',
              mb: 3
            }}
            className="contact-subtitle"
          >
            Need information about our late night entertainment venue? Reach out for reservations, private events, or just to say hello.
          </Typography>

          {/* Features Bar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mt: 2
          }}>
            <Chip 
              icon={<RiBilliardsFill style={{ color: '#222' }} />}
              label="BILLIARDS" 
              sx={{ 
                bgcolor: 'rgba(211, 130, 54, 0.9)', 
                color: '#222',
                fontWeight: 600,
                '& .MuiChip-icon': { color: '#222' }
              }}
            />
            <Chip 
              icon={<MicExternalOnIcon sx={{ color: '#222' }} />}
              label="KARAOKE" 
              sx={{ 
                bgcolor: 'rgba(211, 130, 54, 0.9)', 
                color: '#222',
                fontWeight: 600,
                '& .MuiChip-icon': { color: '#222' }
              }}
            />
            <Chip 
              icon={<AccessTimeIcon sx={{ color: '#222' }} />}
              label="OPEN UNTIL 2AM" 
              sx={{ 
                bgcolor: 'rgba(211, 130, 54, 0.9)', 
                color: '#222',
                fontWeight: 600,
                '& .MuiChip-icon': { color: '#222' }
              }}
            />
          </Box>
          
          <Divider 
            sx={{ 
              mt: 4, 
              mb: 0, 
              backgroundColor: 'rgba(255,255,255,0.1)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '80px',
                height: '3px',
                backgroundColor: '#d38236',
                bottom: '-1px',
                left: '50%',
                transform: 'translateX(-50%)'
              }
            }} 
          />
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information - Enhanced for Night Bar Theme */}
          <Grid item xs={12} md={5} className="info-section">
            <Paper 
              elevation={5} 
              sx={{ 
                p: 3, 
                height: '100%',
                backgroundColor: 'rgba(30, 30, 30, 0.9)',
                backgroundImage: 'linear-gradient(rgba(40, 40, 40, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(40, 40, 40, 0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                borderRadius: '16px',
                border: '1px solid #333',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.2)'
                },
                boxShadow: '0 5px 15px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.5)'
              }}
              className="contact-info-card"
            >
              {/* Orange accent strip - enhanced */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '5px',
                  height: '100%',
                  background: 'linear-gradient(to bottom, #d38236, rgba(211, 130, 54, 0.3))'
                }} 
              />
              
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  color: '#d38236', 
                  fontWeight: 700,
                  mb: 3,
                  pl: 2,
                  borderLeft: '1px solid #d38236',
                  display: 'flex',
                  alignItems: 'center',
                  textShadow: '0 0 10px rgba(211, 130, 54, 0.3)'
                }}
              >
                <NightlifeIcon sx={{ mr: 1 }} /> GET IN TOUCH
              </Typography>
              
              <List sx={{ '.MuiListItem-root': { px: 0, py: 2 } }}>
                <ListItem className="contact-list-item">
                  <ListItemIcon>
                    <Box 
                      className="icon-circle" 
                      sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.15)',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(211, 130, 54, 0.2)'
                      }}
                    >
                      <LocationOnIcon style={{ fontSize: 16, color: '#e0e0e0' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff' }}>
                        Address
                      </Typography>
                    } 
                    secondary={
                      <Typography variant="body2" sx={{ color: '#bbb' }}>
                        358 M. Vicente St, Brgy. Malamig, Mandaluyong City
                      </Typography>
                    }
                  />
                </ListItem>
                
                <ListItem className="contact-list-item">
                  <ListItemIcon>
                    <Box 
                      className="icon-circle"
                      sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.15)',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(211, 130, 54, 0.2)'
                      }}
                    >
                      <PhoneIcon sx={{ color: '#d38236' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff' }}>
                        Phone
                      </Typography>
                    } 
                    secondary={
                      <Typography variant="body2" sx={{ color: '#bbb' }}>
                        (02) 8123-4567
                      </Typography>
                    } 
                  />
                </ListItem>
                
                <ListItem className="contact-list-item">
                  <ListItemIcon>
                    <Box 
                      className="icon-circle"
                      sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.15)',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(211, 130, 54, 0.2)'
                      }}
                    >
                      <EmailIcon sx={{ color: '#d38236' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff' }}>
                        Email
                      </Typography>
                    } 
                    secondary={
                      <Typography variant="body2" sx={{ color: '#bbb' }}>
                        stopshot.management@gmail.com
                      </Typography>
                    }
                  />
                </ListItem>
                
                <ListItem className="contact-list-item">
                  <ListItemIcon>
                    <Box 
                      className="icon-circle" 
                      sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.15)',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(211, 130, 54, 0.2)'
                      }}
                    >
                      <AccessTimeIcon sx={{ color: '#d38236' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff' }}>
                        Hours
                      </Typography>
                    } 
                    secondary={
                      <Typography variant="body2" sx={{ color: '#bbb' }}>
                        Monday - Sunday: 4PM - 2AM
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, color: '#d38236', fontWeight: 600 }}>
                FOLLOW US ON SOCIAL MEDIA
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mt: 1 
                }}
                className="social-icons"
              >
                {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, idx) => (
                  <IconButton 
                    key={idx}
                    className="social-icon-btn"
                    sx={{
                      backgroundColor: 'rgba(211, 130, 54, 0.15)',
                      color: '#d38236',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#d38236',
                        color: '#fff',
                        transform: 'translateY(-5px)',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2), 0 0 10px rgba(211, 130, 54, 0.4)'
                      },
                      width: '42px',
                      height: '42px'
                    }}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </Box>
              
              {/* Contact Reasons Box - New Addition */}
              <Paper 
                elevation={0} 
                sx={{ 
                  mt: 4, 
                  p: 2, 
                  backgroundColor: 'rgba(15, 15, 15, 0.6)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(211, 130, 54, 0.2)'
                }}
              >
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#d38236', fontWeight: 600 }}>
                  CONTACT US ABOUT:
                </Typography>
                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <RiBilliardsFill style={{ color: '#d38236', fontSize: 16, marginRight: '8px' }} />
                      <Typography variant="body2" sx={{ color: '#bbb' }}>Table Reservations</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MicExternalOnIcon sx={{ color: '#d38236', fontSize: 16, mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#bbb' }}>Karaoke Booking</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CelebrationIcon sx={{ color: '#d38236', fontSize: 16, mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#bbb' }}>Private Events</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalActivityIcon sx={{ color: '#d38236', fontSize: 16, mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#bbb' }}>Tournament Entry</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Paper>
          </Grid>
          
          {/* Contact Form - Enhanced for Night Atmosphere */}
          <Grid item xs={12} md={7} className="form-section">
            <Paper 
              elevation={5} 
              sx={{ 
                p: 0, 
                backgroundColor: 'rgba(30, 30, 30, 0.9)',
                borderRadius: '16px',
                border: '1px solid #333',
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.2)'
                },
                position: 'relative',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.5)'
              }}
              className="contact-form-card"
            >
              {/* Ambient lighting effect */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at top right, rgba(211, 130, 54, 0.05), transparent 70%)',
                pointerEvents: 'none',
                zIndex: 1
              }} />
              
              <Box 
                sx={{ 
                  background: 'linear-gradient(to right, #d38236, #b05e1d)',
                  p: 2, 
                  pl: 3,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#fff', 
                    fontWeight: 700,
                    position: 'relative',
                    zIndex: 2,
                    textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                  }}
                >
                  SEND US A MESSAGE
                </Typography>
                
                {/* Decorative elements for enhanced night bar feel */}
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
                  pointerEvents: 'none'
                }} />
                
                <SportsBasketballIcon 
                  sx={{ 
                    color: 'rgba(255,255,255,0.2)', 
                    fontSize: 80,
                    position: 'absolute',
                    top: '-15px',
                    right: '-15px',
                    zIndex: 1,
                    transform: 'rotate(15deg)'
                  }}
                />
              </Box>
              
              <Box 
                sx={{ 
                  p: 3, 
                  pt: 4, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  height: '100%', 
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                {submitted ? (
                  <Box 
                    className="success-message-container"
                    sx={{ 
                      p: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      background: 'radial-gradient(circle at top right, rgba(211, 130, 54, 0.15), transparent 70%)',
                      width: '100%',
                      maxWidth: '500px'
                    }}
                  >
                    <Box className="success-confetti"></Box>
                    
                    <Box 
                      className="success-content"
                      sx={{ 
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 5
                      }}
                    >
                      <Box 
                        className="success-icon-container" 
                        sx={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(211, 130, 54, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 24px',
                          position: 'relative',
                          animation: 'pulse 2s infinite'
                        }}
                      >
                        <CheckCircleIcon 
                          sx={{ 
                            fontSize: 44, 
                            color: '#d38236'
                          }} 
                        />
                      </Box>
                      
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: '#fff', 
                          mb: 2,
                          fontWeight: 700,
                          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}
                        className="success-title"
                      >
                        Message Sent!
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#bbb', 
                          mb: 4,
                          fontSize: '1.1rem',
                          maxWidth: '400px',
                          mx: 'auto',
                          lineHeight: 1.6
                        }}
                        className="success-message-text"
                      >
                        Thanks for reaching out. We'll get back to you as soon as possible to confirm your request or answer any questions.
                      </Typography>
                      
                      <Button 
                        variant="contained" 
                        onClick={() => setSubmitted(false)}
                        className="send-another-button"
                        sx={{ 
                          backgroundColor: '#d38236',
                          color: '#fff',
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(211, 130, 54, 0.3)',
                          '&:hover': {
                            backgroundColor: '#b06b2c',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 16px rgba(211, 130, 54, 0.4), 0 0 30px rgba(211, 130, 54, 0.2)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        SEND ANOTHER MESSAGE
                      </Button>
                    </Box>
                    
                    <SportsBasketballIcon 
                      className="bg-icon-1"
                      sx={{ 
                        color: 'rgba(211, 130, 54, 0.05)',
                        fontSize: 180,
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        transform: 'rotate(15deg)',
                        zIndex: 1
                      }}
                    />
                    
                    <SportsSoccerIcon 
                      className="bg-icon-2"
                      sx={{ 
                        color: 'rgba(211, 130, 54, 0.05)',
                        fontSize: 140,
                        position: 'absolute',
                        bottom: '-40px',
                        left: '-40px',
                        transform: 'rotate(-10deg)',
                        zIndex: 1
                      }}
                    />
                  </Box>
                ) : (
                  <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    noValidate 
                    className="contact-form"
                    sx={{
                      width: '100%',
                      '& .MuiFormControl-root': {
                        mb: 2.5,
                      },
                      '& .MuiInputBase-root': {
                        backgroundColor: 'rgba(15,15,15,0.5)',
                        borderRadius: '8px',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(25,25,25,0.7)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(25,25,25,0.8)',
                          boxShadow: '0 0 0 2px rgba(211, 130, 54, 0.25)',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#aaa'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(211, 130, 54, 0.3)',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#777',
                        opacity: 1
                      }
                    }}
                  >
                    {/* Form Intro Message - New Addition */}
                    <Box sx={{ 
                      mb: 3, 
                      p: 2,
                      backgroundColor: 'rgba(211, 130, 54, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(211, 130, 54, 0.2)'
                    }}>
                      <Typography variant="body2" sx={{ color: '#ccc' }}>
                        <strong style={{ color: '#d38236' }}>After dark inquiries welcome!</strong> Whether you're planning a late-night billiards tournament, booking a karaoke room, or just have questions about our nightlife offerings, we'll respond promptly.
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="First Name"
                          name="first_name"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: '#d38236' }} />
                              </InputAdornment>
                            ),
                          }}
                          className="form-input"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d38236'
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="Last Name"
                          name="last_name"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: '#d38236' }} />
                              </InputAdornment>
                            ),
                          }}
                          className="form-input"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d38236'
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          variant="outlined"
                          error={!!emailError}
                          helperText={emailError}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon sx={{ color: emailError ? '#f44336' : '#d38236' }} />
                              </InputAdornment>
                            ),
                          }}
                          className="form-input"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: emailError ? '#f44336' : '#d38236'
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone_number"
                          variant="outlined"
                          error={!!phoneError}
                          helperText={phoneError}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon sx={{ color: phoneError ? '#f44336' : '#d38236' }} />
                              </InputAdornment>
                            ),
                          }}
                          className="form-input"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: phoneError ? '#f44336' : '#d38236'
                              }
                            }
                          }}
                        />
                        {!phoneError && (
                          <FormHelperText sx={{ color: 'rgba(255,255,255,0.5)', ml: 2 }}>
                            Format: 09XXXXXXXXX or +639XXXXXXXX
                          </FormHelperText>
                        )}
                      </Grid>
                      {/* The Subject field is not in the backend API but we'll keep the UI intact */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SubjectIcon sx={{ color: '#d38236' }} />
                              </InputAdornment>
                            ),
                          }}
                          className="form-input"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d38236'
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Message"
                          name="message_text"
                          multiline
                          rows={4}
                          variant="outlined"
                          placeholder="Tell us about your inquiry or request. Need a billiards table reservation? Booking a karaoke room? Have questions about our late night hours?"
                          className="form-input message-input"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderLeft: '3px solid #d38236',
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d38236'
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          endIcon={<SendIcon />}
                          className="submit-button"
                          sx={{ 
                            mt: 2, 
                            mb: 1, 
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            backgroundColor: '#d38236',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2), 0 0 15px rgba(211, 130, 54, 0.2)',
                            '&:hover': {
                              backgroundColor: '#b06b2c',
                              transform: 'translateY(-3px)',
                              boxShadow: '0 6px 12px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.3)'
                            },
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                              transition: 'all 0.5s ease',
                            },
                            '&:hover::after': {
                              left: '100%'
                            }
                          }}
                        >
                          SEND MESSAGE
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Map Section - Enhanced */}
        <Box mt={8} className="map-section">
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              py: 1,
              px: 3,
              backgroundColor: 'rgba(30, 30, 30, 0.8)',
              borderRadius: '50px',
              width: 'fit-content',
              border: '1px solid rgba(211, 130, 54, 0.3)',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}
          >
            <LocationOnIcon sx={{ color: '#d38236', mr: 1, fontSize: 28 }} />
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                color: '#fff', 
                fontWeight: 700,
                m: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              FIND US HERE
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              borderRadius: '16px', 
              overflow: 'hidden', 
              height: '400px',
              border: '1px solid #333',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3), 0 0 30px rgba(0,0,0,0.2)',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.4), 0 0 30px rgba(211, 130, 54, 0.15)'
              }
            }}
            className="map-container"
          >
            {/* Improved map header with nightlife theme */}
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50px',
              background: 'linear-gradient(to right, #d38236, #b05e1d)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              px: 3,
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ color: '#fff', mr: 1 }} />
                <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                  STOP SHOT SPORTS BAR & KTV - MANDALUYONG
                </Typography>
              </Box>
              
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip 
                    icon={<RiBilliardsFill style={{ color: '#222' }} />} 
                    label="BILLIARDS" 
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.85)',
                      color: '#222',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#222' }
                    }}
                  />
                  <Chip 
                    icon={<MicExternalOnIcon sx={{ color: '#222' }} />} 
                    label="KARAOKE" 
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.85)',
                      color: '#222',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#222' }
                    }}
                  />
                </Box>
              )}
            </Box>
            
            {/* Map with styling for nightlife theme */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.421774913128!2d121.04219071038666!3d14.575026185849502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9459c58bcb7%3A0x563ad18fc323e83d!2sStop%20Shot%20Sports%20Bar%20%26%20KTV!5e0!3m2!1sen!2sph!4v1741402972614!5m2!1sen!2sph"
              width="100%"
              height="100%"
              style={{ border: 0, marginTop: '50px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="google-map"
            />
            
            {/* Map footer with hours - New addition */}
            <Box sx={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '35px',
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(5px)',
              borderTop: '1px solid rgba(211, 130, 54, 0.3)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ color: '#d38236', fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 500 }}>
                  OPEN DAILY 4PM - 2AM | LATE NIGHT HAPPY HOUR 11PM - 1AM
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      
      {/* Enhanced Snackbar notification */}
      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={isError ? "error" : "success"} 
          sx={{ 
            width: '100%', 
            backgroundColor: isError ? 'rgba(211, 47, 47, 0.95)' : 'rgba(46, 125, 50, 0.95)',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          }}
        >
          {isError ? errorMessage : "Message sent! We will get back to you soon."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;

// Use the existing CheckCircleIcon component
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);