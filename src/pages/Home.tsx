import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Container,
  Chip,
  Divider,
  CircularProgress,
  Paper,
  Tooltip
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { RiBilliardsFill } from "react-icons/ri";
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import ImageIcon from '@mui/icons-material/Image';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import '../styles/pages/homepage.css';
import AgeVerificationPopup from '../components/AgeVerificationPopup';
import { getMenus, getFeedback, getProxiedUrl } from '../utils/api';

// Hero Slideshow Data - Enhanced descriptions
const slides = [
  {
    image: '/hero/billiards.png',
    title: 'BILLIARDS ARENA',
    subtitle: 'Pro tables, dim lights & intense matches that last till 2AM'
  },
  {
    image: '/hero/karaoke.png',
    title: 'PRIVATE KARAOKE',
    subtitle: 'Soundproof rooms with premium systems for unforgettable night sessions'
  },
  {
    image: '/hero/bar.png',
    title: 'CRAFT COCKTAILS',
    subtitle: 'Signature late-night drinks crafted by our expert mixologists'
  },
  {
    image: '/hero/outside.png',
    title: 'NIGHT VIBES',
    subtitle: 'Stylish atmosphere for pre-game drinks and after-hours celebrations'
  },
  {
    image: '/hero/show.png',
    title: 'LIVE ENTERTAINMENT',
    subtitle: 'Energetic performances that keep the night alive'
  },
];

// Menu item interface
interface MenuItem {
  menu_id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  image_url: string | null;
}

// Feedback interface
interface Feedback {
  feedback_id: number;
  user: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_num: string | null;
    role: string;
  };
  feedback_text: string;
  response_text: string | null;
  experience_rating: number;
  created_at: string;
  updated_at: string;
}

// Weekly special events
const weeklyEvents = [
  { day: 'MON', name: 'POOL TOURNAMENT', time: '8PM', description: 'Weekly billiards championship with cash prizes' },
  { day: 'WED', name: 'KARAOKE BATTLE', time: '9PM', description: 'Show off your vocal skills and win free drinks' },
  { day: 'FRI', name: 'DJ NIGHT', time: '10PM', description: 'Guest DJs and dance floor opens up' },
  { day: 'SAT', name: 'COCKTAIL HAPPY HOUR', time: '7PM-9PM', description: 'Buy one, get one on signature cocktails' }
];

// Gallery images for atmosphere section
const atmosphereImages = [
  {
    url: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?q=80&w=2070&auto=format&fit=crop',
    title: 'Late Night Games'
  },
  {
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop',
    title: 'Bar Experience'
  },
  {
    url: 'https://images.unsplash.com/photo-1621252179027-9262f49856bc?q=80&w=1974&auto=format&fit=crop',
    title: 'Premium Cocktails'
  },
  {
    url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop',
    title: 'Neon Atmosphere'
  },
];

// Fallback menu items in case API fails
const fallbackMenuItems = [
  {
    menu_id: 1,
    name: 'Signature Mojito',
    description: 'Classic mojito with a twist of exotic berries, perfect for late-night sipping',
    price: '250.00',
    category: 'COCKTAILS',
    is_available: true,
    created_at: '2022-01-01',
    updated_at: '2022-01-01',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop'
  },
  {
    menu_id: 2,
    name: 'Craft Beer Flight',
    description: 'Selection of four premium craft beers, perfect for sharing during games',
    price: '350.00',
    category: 'BEER',
    is_available: true,
    created_at: '2022-01-01',
    updated_at: '2022-01-01',
    image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?q=80&w=2070&auto=format&fit=crop'
  },
  {
    menu_id: 3,
    name: 'Loaded Nachos',
    description: 'Crispy tortilla chips loaded with cheese, jalapeños, and our secret house salsa',
    price: '320.00',
    category: 'APPETIZERS',
    is_available: true,
    created_at: '2022-01-01',
    updated_at: '2022-01-01',
    image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=2070&auto=format&fit=crop'
  }
];

// Fallback testimonials in case API fails
const fallbackTestimonials = [
  {
    feedback_id: 1,
    user: {
      username: 'michael88',
      email: 'michael@example.com',
      first_name: 'Michael',
      last_name: 'Rivera',
      phone_num: null,
      role: 'user'
    },
    feedback_text: 'Best place to unwind after work! The billiards tables are top-notch and the cocktails are amazing. My go-to spot in Manila!',
    response_text: null,
    experience_rating: 5,
    created_at: '2023-04-15',
    updated_at: '2023-04-15'
  },
  {
    feedback_id: 2,
    user: {
      username: 'jennyk',
      email: 'jenny@example.com',
      first_name: 'Jenny',
      last_name: 'Kim',
      phone_num: null,
      role: 'user'
    },
    feedback_text: 'Had my birthday in one of their karaoke rooms and it was fantastic! Great sound system, awesome service, and the food was delicious.',
    response_text: null,
    experience_rating: 5,
    created_at: '2023-05-20',
    updated_at: '2023-05-20'
  },
  {
    feedback_id: 3,
    user: {
      username: 'davidr',
      email: 'david@example.com',
      first_name: 'David',
      last_name: 'Reyes',
      phone_num: null,
      role: 'user'
    },
    feedback_text: 'Love their Monday night pool tournaments! Great atmosphere and friendly competition. The craft beer selection is impressive too.',
    response_text: null,
    experience_rating: 4,
    created_at: '2023-06-10',
    updated_at: '2023-06-10'
  }
];

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [menuHighlights, setMenuHighlights] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  
  // Refs for scroll animations
  const featuredRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    // Animation trigger
    setIsVisible(true);

    // Fetch menu items for highlights
    fetchMenuHighlights();
    
    // Fetch feedback data
    fetchFeedback();

    // Add scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-element');
        }
      });
    }, observerOptions);
    
    // Observe elements for animation
    if (featuredRef.current) observer.observe(featuredRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (eventsRef.current) observer.observe(eventsRef.current);

    return () => {
      clearInterval(slideInterval);
      observer.disconnect();
    };
  }, []);

  // Fetch menu items from API
  const fetchMenuHighlights = async () => {
    try {
      setLoading(true);
      
      // Using the API utility
      const response = await getMenus();
      const data: MenuItem[] = response.data;
      
      // Select specific late-night favorites
      const categories = ['COCKTAILS', 'BEER', 'APPETIZERS'];
      const highlights = categories.map(category => {
        const categoryItems = data.filter(item => 
          item.category === category && item.is_available
        );
        // Return a random item from each category or the first one
        return categoryItems.length > 0 
          ? categoryItems[Math.floor(Math.random() * categoryItems.length)]
          : null;
      }).filter(item => item !== null) as MenuItem[];
      
      setMenuHighlights(highlights.length > 0 ? highlights : fallbackMenuItems);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setError('Unable to load menu highlights. Please try again later.');
      setMenuHighlights(fallbackMenuItems);
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedback data
  const fetchFeedback = async () => {
    try {
      setFeedbackLoading(true);
      
      // Using the API utility
      const response = await getFeedback();
      const data: Feedback[] = response.data;
      
      setFeedbacks(data.length > 0 ? data : fallbackTestimonials);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setFeedbackError('Unable to load customer feedback. Please try again later.');
      setFeedbacks(fallbackTestimonials);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Format price to Philippine Peso
  const formatPrice = (price: string) => {
    return `₱${parseFloat(price).toFixed(2)}`;
  };

  // Manual controls
  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <Box className="home-page">
    <Box className="homepage dark-mode">
      {/* ====== HERO SLIDESHOW SECTION ====== */}
      <Box className="slideshow-container">
        {/* Atmospheric overlay for mood */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(211, 130, 54, 0.15), transparent 80%)',
            mixBlendMode: 'overlay',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {slides.map((slide, index) => (
          <Box
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            sx={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <Box className="overlay">
              <Typography 
                variant="h2" 
                className="slide-title"
                sx={{ 
                  fontWeight: 800, 
                  textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 30px rgba(211, 130, 54, 0.5)',
                  letterSpacing: '3px',
                  fontSize: { xs: '2.5rem', md: '4.5rem' }
                }}
              >
                {slide.title}
              </Typography>
              <Typography 
                variant="h5" 
                className="slide-subtitle"
                sx={{ 
                  fontWeight: 400,
                  textShadow: '1px 1px 4px rgba(0,0,0,0.9), 0 0 20px rgba(211, 130, 54, 0.3)',
                  maxWidth: '800px',
                  fontSize: { xs: '1rem', md: '1.5rem' }
                }}
              >
                {slide.subtitle}
              </Typography>
              <Button 
                variant="contained"
                size="large"
                href="/reservations"
                sx={{
                  mt: 4,
                  backgroundColor: '#d38236',
                  color: '#fff',
                  fontWeight: 'bold',
                  padding: '12px 30px',
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: '#b05e1d',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.4)'
                  },
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderRadius: '4px',
                }}
              >
                RESERVE NOW
              </Button>
            </Box>
          </Box>
        ))}

        {/* Pagination & Arrows */}
        <Box className="pagination-dots">
          <IconButton 
            className="arrow arrow-left" 
            onClick={handlePrev}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': { backgroundColor: 'rgba(211, 130, 54, 0.8)' }
            }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>

          {slides.map((_, index) => (
            <Box
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              sx={{
                backgroundColor: index === currentSlide ? '#d38236' : 'rgba(255,255,255,0.5)',
                width: index === currentSlide ? '14px' : '10px',
                height: index === currentSlide ? '14px' : '10px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            />
          ))}

          <IconButton 
            className="arrow arrow-right" 
            onClick={handleNext}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': { backgroundColor: 'rgba(211, 130, 54, 0.8)' }
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Operating Hours Banner */}
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0,0,0,0.75)',
            py: 1.5,
            zIndex: 10,
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, md: 4 },
            borderTop: '1px solid rgba(211, 130, 54, 0.3)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ color: '#d38236', mr: 1 }} />
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
              OPEN DAILY: 4PM - 2AM
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MusicNoteIcon sx={{ color: '#d38236', mr: 1 }} />
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
              LIVE MUSIC: FRI-SAT
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <SportsBarIcon sx={{ color: '#d38236', mr: 1 }} />
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
              HAPPY HOUR: 4PM-7PM
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ====== MAIN HOMEPAGE CONTENT ====== */}
      <Box className="home-content" sx={{ backgroundColor: '#121212', color: '#fff' }}>
        {/* Main Offerings Icon Bar with Neon Effect */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          py: 4, 
          backgroundColor: '#151515',
          borderBottom: '1px solid #333',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative neon glow */}
          <Box sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(211, 130, 54, 0.1) 0%, transparent 70%)',
            top: 0,
            left: 0,
            pointerEvents: 'none'
          }} />

          <Container>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              {[
                { 
                  icon: <RiBilliardsFill style={{ fontSize: 45, color: '#d38236' }} />, 
                  label: "Pro Billiards Tables", 
                  desc: "Premium tables available hourly",
                  action: "/reservations?type=billiards"
                },
                { 
                  icon: <MicExternalOnIcon sx={{ fontSize: 45, color: '#d38236' }} />, 
                  label: "Private Karaoke Rooms", 
                  desc: "Soundproof party spaces",
                  action: "/reservations?type=karaoke" 
                },
                { 
                  icon: <LocalBarIcon sx={{ fontSize: 45, color: '#d38236' }} />, 
                  label: "Late-Night Bar", 
                  desc: "Signature cocktails & shots",
                  action: "/menu" 
                }
              ].map((item, index) => (
                <Grid item xs={12} sm={4} key={index} sx={{ textAlign: 'center' }}>
                  <Paper
                    elevation={6}
                    sx={{ 
                      py: 4,
                      px: 2,
                      backgroundColor: 'rgba(30,30,30,0.8)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        bgcolor: 'rgba(40,40,40,0.8)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3), 0 0 15px rgba(211, 130, 54, 0.2)'
                      },
                      border: '1px solid #333',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => window.location.href = item.action}
                  >
                    {/* Icon glow effect */}
                    <Box sx={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(211, 130, 54, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      boxShadow: '0 0 15px rgba(211, 130, 54, 0.3)'
                    }}>
                      {item.icon}
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#fff' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#bbb' }}>
                      {item.desc}
                    </Typography>
                    
                    <Button 
                      size="small" 
                      sx={{ 
                        mt: 2, 
                        color: '#d38236', 
                        borderBottom: '1px solid #d38236',
                        borderRadius: 0,
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: '#fff',
                          borderColor: '#fff'
                        }
                      }}
                    >
                      LEARN MORE
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Introduction / Welcome Section */}
        <Container maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
          <Box className="intro-section" sx={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease'
          }}>
            <Typography 
              variant="h3" 
              className="section-title"
              sx={{ 
                textAlign: 'center', 
                mb: 2, 
                fontWeight: 700,
                backgroundImage: 'linear-gradient(45deg, #d38236, #ffc259)',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(211, 130, 54, 0.3)'
              }}
            >
              MANILA'S PREMIER LATE-NIGHT DESTINATION
            </Typography>
            <Typography 
              variant="h6" 
              className="section-subtitle"
              sx={{ 
                textAlign: 'center', 
                maxWidth: '800px', 
                mx: 'auto',
                mb: 4,
                color: '#aaa',
                fontWeight: 400
              }}
            >
              Where nights come alive with great drinks, billiards battles, and karaoke sessions until 2AM.
            </Typography>
            <Box sx={{ 
              width: '60px', 
              height: '4px', 
              background: 'linear-gradient(to right, #d38236, #ffc259)',
              mx: 'auto',
              mb: 6
            }}/>
          </Box>

          {/* Weekly Schedule - New Section */}
          <Box ref={eventsRef} sx={{ 
            mb: 8,
            opacity: 1, // Changed from 0 to ensure visibility
            transform: 'translateY(0)', // Changed to ensure visibility
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            className: 'fade-in-element' // Added class for visibility
          }}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                textAlign: 'center', 
                fontWeight: 600,
                color: '#fff',
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <EventNoteIcon sx={{ color: '#d38236' }} /> 
              WEEKLY <span style={{ color: '#d38236', marginLeft: '0.5rem' }}>EVENTS</span>
            </Typography>

            <Grid container spacing={2}>
              {weeklyEvents.map((event, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ 
                    bgcolor: '#1a1a1a', 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 10px 20px rgba(0,0,0,0.3), 0 0 15px rgba(211, 130, 54, 0.2)`
                    },
                    border: '1px solid #333',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Decorative corner accent */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '30px',
                      height: '30px',
                      borderLeft: '3px solid #d38236',
                      borderTop: '3px solid #d38236',
                      opacity: 0.7
                    }} />
                    
                    <CardContent>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}>
                        <Chip
                          label={event.day}
                          sx={{
                            bgcolor: '#d38236',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '1rem',
                            mb: 2
                          }}
                        />
                        
                        <Typography variant="h5" sx={{ 
                          color: '#fff', 
                          fontWeight: 700,
                          mb: 1
                        }}>
                          {event.name}
                        </Typography>
                        
                        <Typography variant="body1" sx={{ 
                          color: '#d38236', 
                          fontWeight: 600,
                          mb: 2
                        }}>
                          {event.time}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ color: '#bbb' }}>
                          {event.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Featured Menu Items - Now uses API data */}
          <Box 
            ref={featuredRef} 
            sx={{ 
              mt: 8, 
              mb: 10,
              opacity: 1, // Changed from 0 to ensure visibility
              transform: 'translateY(0)', // Changed to ensure visibility
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              className: 'fade-in-element' // Added class for visibility
            }}
          >
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ 
                textAlign: 'center', 
                fontWeight: 600,
                color: '#fff',
                mb: 1
              }}
            >
              LATE-NIGHT <span style={{ color: '#d38236' }}>FAVORITES</span>
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                textAlign: 'center',
                color: '#aaa',
                mb: 5
              }}
            >
              Perfect pairings for billiards battles & karaoke sessions
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#d38236' }} />
              </Box>
            ) : error ? (
              <Typography color="error" align="center">{error}</Typography>
            ) : (
              <Grid container spacing={4}>
                {menuHighlights.map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      backgroundColor: '#1a1a1a',
                      borderRadius: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.3)'
                      },
                      border: '1px solid rgba(255,255,255,0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Spotlight effect on hover */}
                      <Box 
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'radial-gradient(circle at 50% 0%, rgba(211, 130, 54, 0.15), transparent 70%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          '.MuiCard-root:hover &': { opacity: 1 }
                        }}
                      />
                      
                      <CardMedia
                        component="img"
                        height="260"
                        image={item.image_url || `https://placehold.co/600x400?text=${encodeURIComponent(item.name)}`}
                        alt={item.name}
                        sx={{ 
                          objectFit: 'cover',
                          borderBottom: '3px solid #d38236'
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Chip 
                              label={item.category} 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#d38236', 
                                color: '#fff', 
                                mb: 1,
                                fontSize: '0.7rem',
                                fontWeight: 600
                              }}
                            />
                            <Typography variant="h5" component="h3" sx={{ color: '#fff', fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ 
                            color: '#d38236', 
                            fontWeight: 700,
                            textShadow: '0 0 10px rgba(211, 130, 54, 0.3)'
                          }}>
                            {formatPrice(item.price)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, color: '#bbb' }}>
                          {item.description || 'A delicious option perfect for your late-night cravings'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button 
                variant="outlined" 
                size="large" 
                component="a" 
                href="/menu"
                sx={{ 
                  borderColor: '#d38236', 
                  color: '#d38236',
                  borderWidth: 2,
                  px: 4,
                  '&:hover': {
                    borderColor: '#d38236',
                    backgroundColor: 'rgba(211, 130, 54, 0.1)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                View Full Menu
              </Button>
            </Box>
          </Box>

          {/* Divider */}
          <Divider sx={{ 
            borderColor: 'rgba(255,255,255,0.1)', 
            my: 6,
            '&::before, &::after': {
              borderColor: 'rgba(255,255,255,0.1)',
            }
          }}>
            <Chip 
              icon={<ImageIcon />} 
              label="THE VIBE" 
              sx={{ 
                backgroundColor: '#d38236', 
                color: 'white',
                px: 2,
                '& .MuiChip-icon': { color: 'white' } 
              }} 
            />
          </Divider>

          {/* Testimonials / Reviews Section - Dynamic Marquee */}
          <Box 
            ref={testimonialsRef}
            className="reviews-section fade-in-element" // Added class for visibility
            sx={{ 
              py: 6, 
              px: 3, 
              backgroundColor: 'rgba(26, 26, 26, 0.7)',
              borderRadius: 2,
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/backgrounds/night-bar.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mb: 8,
              boxShadow: '0px 5px 20px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              opacity: 1, // Changed from 0 to ensure visibility
              transform: 'translateY(0)', // Changed to ensure visibility
              transition: 'opacity 0.8s ease, transform 0.8s ease'
            }}
          >
            <Typography 
              variant="h5" 
              className="section-title"
              sx={{ 
                textAlign: 'center',
                color: 'white',
                fontWeight: 600,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <FormatQuoteIcon sx={{ color: '#d38236' }} />
              WHAT OUR NIGHT OWLS SAY
            </Typography>
            
            {feedbackLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#d38236' }} />
              </Box>
            ) : feedbackError ? (
              <Typography color="error" align="center">{feedbackError}</Typography>
            ) : (
              <Box sx={{ 
                position: 'relative',
                overflow: 'hidden',
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  width: '100px',
                  height: '100%',
                  zIndex: 2,
                },
                '&::before': {
                  left: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent)',
                },
                '&::after': {
                  right: 0,
                  background: 'linear-gradient(to left, rgba(0,0,0,0.9), transparent)',
                }
              }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    width: 'max-content', // This ensures all cards can be seen
                    gap: 3,
                    py: 2,
                    '@keyframes marquee': {
                      '0%': { transform: 'translateX(0)' },
                      '100%': { transform: `translateX(-${feedbacks.length * 370}px)` }
                    },
                    animation: feedbacks.length > 2 ? 'marquee 45s linear infinite' : 'none',
                    '&:hover': {
                      animationPlayState: 'paused'
                    }
                  }}
                >
                  {/* Display all testimonials twice to create seamless loop */}
                  {[...feedbacks, ...feedbacks].map((feedback, index) => (
                    <Box 
                      key={`${feedback.feedback_id}-${index}`}
                      sx={{ 
                        bgcolor: 'rgba(26, 26, 26, 0.75)',
                        p: 3,
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(211, 130, 54, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '340px',
                        // height: '220px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.3), 0 0 15px rgba(211, 130, 54, 0.3)',
                          borderColor: 'rgba(211, 130, 54, 0.6)'
                        },
                        position: 'relative'
                      }}
                    >
                      <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                        {Array(feedback.experience_rating).fill(0).map((_, i) => (
                          <Box 
                            key={i}
                            component="span" 
                            sx={{ 
                              color: '#d38236', 
                              fontSize: '20px', 
                              mr: 0.5,
                              filter: 'drop-shadow(0 0 2px rgba(211, 130, 54, 0.5))'
                            }}
                          >
                            ★
                          </Box>
                        ))}
                      </Box>
                      <Typography 
                        variant="body1" 
                        className="review-text"
                        sx={{ 
                          fontStyle: 'italic',
                          color: '#eee',
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          position: 'relative',
                          pl: 2
                        }}
                      >
                        {/* <FormatQuoteIcon sx={{ 
                          position: 'absolute',
                          top: -10,
                          left: -10,
                          color: 'rgba(211, 130, 54, 0.2)',
                          fontSize: '2rem'
                        }} /> */}
                        "{feedback.feedback_text}"
                      </Typography>
                      <Typography 
                        variant="subtitle2" 
                        className="review-author"
                        sx={{ 
                          color: '#d38236',
                          mt: 2,
                          fontWeight: 600,
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        {feedback.user.first_name} {feedback.user.last_name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Typography 
                  variant="body2" 
                  align="center" 
                  sx={{ 
                    mt: 2, 
                    color: 'rgba(255,255,255,0.7)',
                    fontStyle: 'italic'
                  }}
                >
                  Hover to pause • {feedbacks.length} reviews from our night crowd
                </Typography>
              </Box>
            )}
          </Box>

          {/* Call-to-Action Section */}
          <Box className="reservation-cta-section" sx={{ 
            textAlign: 'center', 
            py: 8,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(26, 26, 26, 0.7)',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/backgrounds/billiards-dark.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            {/* Decorative overlay */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(ellipse at center, rgba(211, 130, 54, 0.2), transparent 70%)',
              pointerEvents: 'none'
            }} />
            
            <Typography 
              variant="h3" 
              className="section-title"
              sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                position: 'relative',
                zIndex: 1
              }}
            >
              MAKE YOUR NIGHT <span style={{ color: '#d38236' }}>LEGENDARY</span>
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#ccc',
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                position: 'relative',
                zIndex: 1
              }}
            >
              Reserve your billiards table, private karaoke room, or VIP area for an unforgettable night out
            </Typography>
            
            <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{
                  p: 2,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(211, 130, 54, 0.3)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Box sx={{ mr: 2 }}>
                    <RiBilliardsFill style={{ fontSize: 40, color: '#d38236' }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                      Billiards Tables
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                      ₱200/hr • Available from 4PM
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{
                  p: 2,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(211, 130, 54, 0.3)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Box sx={{ mr: 2 }}>
                    <MicExternalOnIcon sx={{ fontSize: 40, color: '#d38236' }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                      Karaoke Rooms
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                      ₱500/hr • Fits up to 10 people
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
            <Button 
              variant="contained"
              size="large"
              href="/reservations"
              sx={{
                backgroundColor: '#d38236',
                color: 'white',
                fontWeight: 'bold',
                padding: '16px 40px',
                fontSize: '1.2rem',
                '&:hover': {
                  backgroundColor: '#b05e1d',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.5)'
                },
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 1,
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              RESERVE NOW
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
   <AgeVerificationPopup />
</Box>
  );
};

// Add this component at the bottom for the FormatQuoteIcon
const FormatQuoteIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.62 18h-5.24l2-4h-2V6h7v7.24L18.62 18zm-2-2h.76L19 12.76V8h-3v4h2l-1.38 4zm-8 2H3.38l2-4h-2V6h7v7.24L8.62 18zm-2-2h.76L9 12.76V8H6v4h2L6.62 16z"/>
  </svg>
);

// Add this CSS to your homepage.css file
const injectCSS = document.createElement('style');
injectCSS.innerHTML = `
.fade-in-element {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
`;
document.head.appendChild(injectCSS);

export default HomePage;