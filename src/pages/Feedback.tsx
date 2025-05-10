import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  TextField,
  Button,
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  Divider,
  Avatar,
  IconButton,
  InputAdornment,
  Fade,
  Chip
} from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import StarIcon from '@mui/icons-material/Star';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailIcon from '@mui/icons-material/Email';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { RiBilliardsFill } from "react-icons/ri";
import '../styles/pages/feedback.css';
import axios from 'axios';

// Testimonial data for the marquee
const testimonials = [
  {
    id: 1,
    name: 'Michael J.',
    avatar: 'https://placehold.co/400x400/333/fff?text=MJ',
    rating: 5,
    text: 'Best place to watch NBA games! The atmosphere during playoffs is unbeatable.',
    date: 'March 15, 2025'
  },
  {
    id: 2,
    name: 'Sarah T.',
    avatar: 'https://placehold.co/400x400/333/fff?text=ST',
    rating: 4,
    text: 'Love the food selection and craft beer options. My go-to spot on weekends!',
    date: 'February 20, 2025'
  },
  {
    id: 3,
    name: 'David R.',
    avatar: 'https://placehold.co/400x400/333/fff?text=DR',
    rating: 5,
    text: 'The karaoke rooms are fantastic for private parties. Had an amazing birthday celebration here!',
    date: 'April 2, 2025'
  },
  {
    id: 4,
    name: 'Kimberly L.',
    avatar: 'https://placehold.co/400x400/333/fff?text=KL',
    rating: 5,
    text: 'Excellent service and the best chicken wings in town. Always my first choice for game nights.',
    date: 'January 10, 2025'
  },
  {
    id: 5,
    name: 'Jason M.',
    avatar: 'https://placehold.co/400x400/333/fff?text=JM',
    rating: 4,
    text: 'Great screens, great drinks, great vibe. What more could you ask for?',
    date: 'March 28, 2025'
  }
];

// Rating descriptions to explain what each star means
const ratingLabels = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Good',
  4: 'Very Good', 
  5: 'Excellent'
};

const FeedbackPage: React.FC = () => {
  // Primary rating state
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number>(-1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  // Testimonial states
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('left');

  // Add state for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    feedback_text: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch feedback data from API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/feedback/');
        // Get random 5 feedbacks if there are more than 5
        const feedbacks = response.data;
        const randomFeedbacks = feedbacks.length > 5 
          ? [...feedbacks].sort(() => 0.5 - Math.random()).slice(0, 5)
          : feedbacks;
        
        // Map the API response to the testimonials format
        const mappedTestimonials = randomFeedbacks.map((feedback: any) => {
          const firstName = feedback.user.first_name;
          const lastName = feedback.user.last_name;
          const name = `${firstName} ${lastName.charAt(0)}.`;
          const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
          const date = new Date(feedback.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          return {
            id: feedback.feedback_id,
            name: name,
            avatar: `https://placehold.co/400x400/333/fff?text=${initials}`,
            rating: feedback.experience_rating,
            text: feedback.feedback_text,
            date: date
          };
        });
        
        setTestimonials(mappedTestimonials);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setIsLoading(false);
      }
    };
    
    fetchFeedbacks();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused || isHovered) return;
    
    const interval = setInterval(() => {
      setAnimationDirection('left');
      setActiveTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused, isHovered]);

  const handlePrevTestimonial = () => {
    setAnimationDirection('right');
    setActiveTestimonialIndex(prev => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNextTestimonial = () => {
    setAnimationDirection('left');
    setActiveTestimonialIndex(prev => 
      (prev + 1) % testimonials.length
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Extract first and last name from full name
    const nameParts = formData.fullName.trim().split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';
    
    // Prepare data according to backend API requirements
    const feedbackData = {
      email: formData.email,
      first_name: first_name,
      last_name: last_name,
      feedback_text: formData.feedback_text,
      experience_rating: rating || 3, // Default to 3 if not selected
    };
    
    // Show loading state
    setIsSubmitting(true);
    
    // Immediately show success message (optimistic UI)
    setOpenSnackbar(true);
    
    try {
      // Send feedback to backend API with timeout
      await axios.post('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/feedback/', feedbackData, {
        timeout: 8000 // 8 second timeout
      });
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        feedback_text: '',
      });
      setRating(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // If there's an error, show an error message
      setOpenSnackbar(false);
      // You could add additional error handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Function to get label text for rating value
  const getLabelText = (value: number) => {
    if (!value || !ratingLabels[value as keyof typeof ratingLabels]) {
      return 'Click to rate';
    }
    return `${value} Star${value !== 1 ? 's' : ''}, ${ratingLabels[value as keyof typeof ratingLabels]}`;
  };

  return (
    <Box className="feedback-page" sx={{ 
      backgroundColor: '#121212', 
      pt: 2, 
      pb: 10,
      position: 'relative',
      backgroundImage: 'linear-gradient(rgba(40, 40, 40, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(40, 40, 40, 0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }}>
      {/* Ambient neon effect overlays */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'radial-gradient(ellipse at top center, rgba(211, 130, 54, 0.1), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        right: 0, 
        width: '100%', 
        height: '40%', 
        background: 'radial-gradient(ellipse at bottom right, rgba(69, 123, 157, 0.08), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Enhanced Hero Section with Night Vibes */}
        <Box 
          className="feedback-hero" 
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
            backgroundColor: 'rgba(18, 18, 18, 0.5)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2
          }}>
            <Box 
              component={RiBilliardsFill}
              className="neon-icon"
              sx={{ 
                color: '#d38236', 
                fontSize: 40, 
                mr: 2,
                filter: 'drop-shadow(0 0 8px rgba(211, 130, 54, 0.7))',
                animation: 'neonPulse 2s infinite alternate'
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
              className="feedback-title"
            >
              Night <span style={{ color: '#d38236' }}>Feedback</span>
            </Typography>
            <MicExternalOnIcon
              className="neon-icon" 
              sx={{ 
                color: '#d38236', 
                fontSize: 40, 
                ml: 2,
                filter: 'drop-shadow(0 0 8px rgba(211, 130, 54, 0.7))',
                animation: 'neonPulse 2s infinite alternate',
                animationDelay: '0.5s'
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
            className="feedback-subtitle"
          >
            Your opinion matters! Help us improve your late night billiards, karaoke, and bar experience.
          </Typography>

          {/* Late Night Feature Tags */}
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

        {/* Enhanced Testimonials Marquee Section */}
        <Box 
          className="testimonials-section"
          sx={{ 
            mb: 6, 
            position: 'relative',
            overflow: 'hidden', 
            borderRadius: '16px',
            backgroundColor: 'rgba(26, 26, 26, 0.7)',
            boxShadow: '0px 8px 20px rgba(0,0,0,0.25), 0 0 20px rgba(211, 130, 54, 0.15)',
            border: '1px solid rgba(211, 130, 54, 0.2)',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/backgrounds/night-bar.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Header Bar */}
          <Box sx={{ 
            background: 'linear-gradient(to right, #d38236, #b05e1d)',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                textShadow: '0 1px 3px rgba(0,0,0,0.7)'
              }}
            >
              <FormatQuoteIcon sx={{ mr: 1 }} /> WHAT OUR NIGHT OWLS SAY
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => setIsPaused(!isPaused)}
                size="small"
                sx={{ 
                  color: 'white', 
                  opacity: 0.8,
                  mr: 1,
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
              </IconButton>
              
              <Box sx={{ display: 'flex' }}>
                {testimonials.map((_, idx) => (
                  <Box 
                    key={idx}
                    onClick={() => setActiveTestimonialIndex(idx)}
                    sx={{ 
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      mx: 0.5,
                      backgroundColor: idx === activeTestimonialIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Testimonials Slider with Navigation Controls */}
          <Box sx={{ 
            position: 'relative',
            height: '240px',
            overflow: 'hidden',
            backgroundColor: 'rgba(26, 26, 26, 0.4)',
            backdropFilter: 'blur(5px)'
          }}>
            {/* Left Navigation Arrow */}
            <IconButton
              className="testimonial-nav-button"
              onClick={handlePrevTestimonial}
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                color: '#fff',
                backgroundColor: 'rgba(211, 130, 54, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(211, 130, 54, 0.5)',
                },
                m: 1,
                transition: 'all 0.3s ease',
                opacity: isHovered ? 1 : 0
              }}
            >
              <NavigateBeforeIcon fontSize="large" />
            </IconButton>
            
            {/* Right Navigation Arrow */}
            <IconButton
              className="testimonial-nav-button"
              onClick={handleNextTestimonial}
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                color: '#fff',
                backgroundColor: 'rgba(211, 130, 54, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(211, 130, 54, 0.5)',
                },
                m: 1,
                transition: 'all 0.3s ease',
                opacity: isHovered ? 1 : 0
              }}
            >
              <NavigateNextIcon fontSize="large" />
            </IconButton>
            
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6" sx={{ color: '#aaa' }}>Loading testimonials...</Typography>
              </Box>
            ) : (
              <Box 
                className={`testimonials-container ${animationDirection === 'left' ? 'slide-left' : 'slide-right'}`}
                sx={{
                  display: 'flex',
                  transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: `translateX(-${activeTestimonialIndex * 100}%)`,
                  height: '100%'
                }}
              >
                {testimonials.map((testimonial) => (
                  <Box 
                    key={testimonial.id}
                    className="testimonial-slide"
                    sx={{ 
                      width: '100%',
                      minWidth: '100%',
                      p: 3,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'center', sm: 'flex-start' },
                      justifyContent: 'center',
                      gap: 3,
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Background ball icon - decorative */}
                    <Box
                      component={RiBilliardsFill}
                      sx={{ 
                        position: 'absolute',
                        color: 'rgba(211, 130, 54, 0.03)',
                        fontSize: '300px',
                        right: '-100px',
                        bottom: '-100px',
                        transform: 'rotate(-15deg)',
                        zIndex: 0
                      }}
                    />
                    
                    <Avatar 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{ 
                        width: { xs: 80, md: 90 }, 
                        height: { xs: 80, md: 90 },
                        border: '3px solid #d38236',
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(211, 130, 54, 0.4)',
                        zIndex: 1
                      }}
                      className="testimonial-avatar"
                    />
                    <Box sx={{ 
                      flex: 1, 
                      textAlign: { xs: 'center', sm: 'left' }, 
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1, 
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        flexWrap: 'wrap',
                        gap: 1
                      }}>
                        <Rating 
                          value={testimonial.rating} 
                          readOnly 
                          size="small"
                          emptyIcon={<StarIcon style={{ opacity: 0.3, color: 'rgba(211, 130, 54, 0.3)' }} fontSize="inherit" />}
                          sx={{ 
                            color: '#d38236',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            borderRadius: '4px',
                            p: 0.5,
                            '& .MuiRating-iconFilled': {
                              filter: 'drop-shadow(0 0 2px rgba(211, 130, 54, 0.7))'
                            }
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#999',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            px: 1,
                            py: 0.5,
                            borderRadius: '4px',
                            ml: { xs: 0, sm: 1 },
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {testimonial.date}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#fff', 
                          fontWeight: 600,
                          mb: 1,
                          position: 'relative',
                          textShadow: '0 1px 3px rgba(0,0,0,0.7)'
                        }}
                        className="testimonial-name"
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        className="testimonial-text"
                        sx={{ 
                          color: '#bbb',
                          fontStyle: 'italic',
                          position: 'relative',
                          pl: 2,
                          pr: 2,
                          pb: 1,
                          borderBottom: '1px dotted rgba(255,255,255,0.1)',
                          animation: 'fadeIn 0.5s ease'
                        }}
                      >
                        <FormatQuoteIcon 
                          sx={{ 
                            position: 'absolute',
                            left: -5,
                            top: -5,
                            color: 'rgba(211, 130, 54, 0.2)',
                            fontSize: '1.5rem'
                          }} 
                        />
                        {testimonial.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          
          {/* Progress bar */}
          <Box sx={{ 
            height: '4px', 
            width: '100%', 
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            {!isLoading && testimonials.length > 0 && (
              <Box 
                sx={{ 
                  height: '100%', 
                  background: 'linear-gradient(to right, #d38236, #b05e1d)',
                  width: `${(1/testimonials.length) * 100}%`,
                  position: 'absolute',
                  left: `${(activeTestimonialIndex/testimonials.length) * 100}%`,
                  transition: 'left 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 10px rgba(211, 130, 54, 0.5)'
                }}
              />
            )}
          </Box>
        </Box>

        {/* Feedback Form - Enhanced with Late Night Bar Theme */}
        <Paper 
          elevation={5} 
          sx={{ 
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            color: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(211, 130, 54, 0.2)',
            backgroundImage: 'linear-gradient(rgba(40, 40, 40, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(40, 40, 40, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 30px rgba(211, 130, 54, 0.1)'
          }}
          className="feedback-form-card"
        >
          {/* Ambient glow effect */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(211, 130, 54, 0.05), transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1
          }} />
          
          <Box 
            sx={{ 
              background: 'linear-gradient(to right, #d38236, #b05e1d)',
              p: 2.5, 
              pl: 3,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#fff', 
                fontWeight: 700,
                position: 'relative',
                zIndex: 2,
                textShadow: '0 1px 3px rgba(0,0,0,0.5)'
              }}
            >
              SHARE YOUR NIGHT EXPERIENCE
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box component={RiBilliardsFill} sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 24 }} />
              <MicExternalOnIcon sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 24 }} />
              <NightlifeIcon sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 24 }} />
            </Box>
            
            <Box 
              component={SportsBasketballIcon}
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
            component="form" 
            onSubmit={handleSubmit} 
            noValidate
            sx={{ p: 3, pt: 4, position: 'relative', zIndex: 2 }}
            className="feedback-form"
          >
            <Grid container spacing={4}>
              {/* Introduction Message */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ 
                  p: 2, 
                  mb: 2, 
                  bgcolor: 'rgba(211, 130, 54, 0.08)', 
                  border: '1px solid rgba(211, 130, 54, 0.2)',
                  borderRadius: '8px'
                }}>
                  <Typography variant="body2" sx={{ color: '#ccc', fontStyle: 'italic' }}>
                    <strong style={{ color: '#d38236' }}>How was your night with us?</strong> We'd love to hear about your experience with our billiards tables, karaoke rooms, drinks, and service. Your feedback helps us create the perfect late night atmosphere.
                  </Typography>
                </Paper>
              </Grid>
              
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: '#d38236',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(211, 130, 54, 0.3)',
                    pb: 1
                  }}
                >
                  <PersonOutlineIcon sx={{ mr: 1 }} /> Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      variant="outlined"
                      className="dark-input"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ color: '#d38236' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="outlined"
                      className="dark-input"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#d38236' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
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
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Enhanced Rating Section */}
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: '#d38236',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(211, 130, 54, 0.3)',
                    pb: 1
                  }}
                >
                  <StarIcon sx={{ mr: 1 }} /> Rate Your Experience
                </Typography>
                <Paper 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'rgba(15,15,15,0.5)',
                    border: '1px solid rgba(211, 130, 54, 0.2)',
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Ambient light effect */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at top center, rgba(211, 130, 54, 0.1), transparent 70%)',
                    pointerEvents: 'none'
                  }} />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 1,
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: '#fff',
                        fontWeight: 600,
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      How would you rate your night at StopShot?
                    </Typography>
                    
                    <Rating
                      name="overall_rating"
                      value={rating}
                      precision={1}
                      size="large"
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                      onChangeActive={(event, newHover) => {
                        setHoverRating(newHover);
                      }}
                      emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                      sx={{ 
                        color: '#d38236',
                        fontSize: '3rem',
                        mb: 2,
                        '& .MuiRating-iconEmpty': {
                          color: 'rgba(211, 130, 54, 0.3)'
                        },
                        '& .MuiRating-iconFilled': {
                          filter: 'drop-shadow(0 0 4px rgba(211, 130, 54, 0.7))'
                        },
                        '& .MuiRating-iconHover': {
                          color: '#d38236',
                          transform: 'scale(1.2)',
                          filter: 'drop-shadow(0 0 6px rgba(211, 130, 54, 0.9))'
                        }
                      }}
                    />
                    
                    {/* Rating label explanation */}
                    <Fade in={rating !== null || hoverRating !== -1}>
                      <Box
                        sx={{
                          mt: 1,
                          height: 28,
                          textAlign: 'center',
                          backgroundColor: 'rgba(211, 130, 54, 0.15)',
                          borderRadius: '8px',
                          px: 2,
                          py: 0.7,
                          border: '1px solid rgba(211, 130, 54, 0.3)',
                          minWidth: '180px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#d38236', fontWeight: 600 }}>
                          {
                            hoverRating !== -1
                              ? getLabelText(hoverRating)
                              : rating !== null
                              ? getLabelText(rating)
                              : 'Click to rate'
                          }
                        </Typography>
                      </Box>
                    </Fade>
                    
                    {/* Rating Categories */}
                    <Grid container spacing={1} sx={{ mt: 3, width: '100%' }}>
                      <Grid item xs={4}>
                        <Box sx={{ 
                          p: 1.5, 
                          textAlign: 'center', 
                          bgcolor: 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.05)',
                            transform: 'translateY(-3px)'
                          }
                        }} className="rating-item">
                          <Box component={RiBilliardsFill} sx={{ color: '#d38236', fontSize: 24, mb: 1 }} />
                          <Typography variant="caption" sx={{ color: '#bbb', display: 'block' }}>
                            Billiards Tables
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ 
                          p: 1.5, 
                          textAlign: 'center', 
                          bgcolor: 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.05)',
                            transform: 'translateY(-3px)'
                          }
                        }} className="rating-item">
                          <MicExternalOnIcon sx={{ color: '#d38236', fontSize: 24, mb: 1 }} />
                          <Typography variant="caption" sx={{ color: '#bbb', display: 'block' }}>
                            Karaoke Rooms
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ 
                          p: 1.5, 
                          textAlign: 'center', 
                          bgcolor: 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.05)',
                            transform: 'translateY(-3px)'
                          }
                        }} className="rating-item">
                          <SportsBarIcon sx={{ color: '#d38236', fontSize: 24, mb: 1 }} />
                          <Typography variant="caption" sx={{ color: '#bbb', display: 'block' }}>
                            Bar & Drinks
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              {/* Enhanced Comments Section */}
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: '#d38236',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(211, 130, 54, 0.3)',
                    pb: 1
                  }}
                >
                  <FormatQuoteIcon sx={{ mr: 1 }} /> Your Feedback
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Share your thoughts with us"
                  name="feedback_text"
                  value={formData.feedback_text}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="Tell us about your experience at StopShot. We'd love to hear what you enjoyed most and any suggestions you might have. Did you try our billiards tables, private karaoke rooms, or craft cocktails?"
                  className="dark-input message-input"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(15,15,15,0.5)',
                      borderRadius: '12px',
                      color: '#fff',
                      borderLeft: '3px solid #d38236',
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
                    }
                  }}
                />
              </Grid>

              {/* Recommendation Section - Enhanced */}
              <Grid item xs={12}>
                <FormControl 
                  component="fieldset"
                  sx={{
                    '& .MuiFormLabel-root': {
                      color: '#aaa'
                    },
                    '& .MuiRadio-root': {
                      color: '#999'
                    },
                    '& .Mui-checked': {
                      color: '#d38236'
                    },
                    p: 2,
                    backgroundColor: 'rgba(15,15,15,0.5)',
                    borderRadius: '12px',
                    border: '1px solid rgba(211, 130, 54, 0.2)'
                  }}
                >
                  <FormLabel component="legend">Would you recommend StopShot to friends looking for a late-night spot?</FormLabel>
                  <RadioGroup row name="recommendation">
                    <FormControlLabel 
                      value="yes" 
                      control={
                        <Radio sx={{
                          '&.Mui-checked': {
                            color: '#d38236',
                            '& .MuiSvgIcon-root': {
                              filter: 'drop-shadow(0 0 2px rgba(211, 130, 54, 0.5))'
                            }
                          }
                        }}/>
                      } 
                      label="Definitely!" 
                    />
                    <FormControlLabel value="maybe" control={<Radio />} label="Maybe" />
                    <FormControlLabel value="no" control={<Radio />} label="Not Really" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Submit Button - Enhanced */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  endIcon={isSubmitting ? null : <SendIcon />}
                  disabled={isSubmitting}
                  className="submit-button"
                  sx={{ 
                    py: 1.8, 
                    backgroundColor: '#d38236',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.3)',
                    letterSpacing: '1px',
                    '&:hover': {
                      backgroundColor: '#b06b2c',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.4), 0 0 30px rgba(211, 130, 54, 0.4)'
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
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 1.5, color: '#aaa', fontStyle: 'italic' }}>
                  Your feedback helps us create the perfect night spot for you.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Enhanced success snackbar */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            icon={
              <Box 
                component={NightlifeIcon} 
                sx={{ 
                  color: '#fff',
                  animation: 'pulse 2s infinite'
                }} 
              />
            }
            sx={{ 
              width: '100%', 
              backgroundColor: 'rgba(46, 125, 50, 0.9)',
              color: '#fff',
              borderRadius: '10px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.5), 0 0 15px rgba(46, 125, 50, 0.5)',
              border: '1px solid rgba(56, 142, 60, 0.3)',
              backdropFilter: 'blur(5px)',
              '& .MuiAlert-icon': {
                color: '#fff'
              }
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Thank you for your feedback! We appreciate your input.
            </Typography>
          </Alert>
        </Snackbar>
      </Container>
      
      {/* Replace the problematic style tag */}
      <style>{`
        /* Custom styles for rating */
        .MuiRating-iconFilled {
          color: #f57c00 !important;
        }
        .MuiRating-iconHover {
          color: #ffb74d !important;
        }
      `}</style>
    </Box>
  );
};

export default FeedbackPage;