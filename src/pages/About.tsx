// src/pages/About.tsx
import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  Paper,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import PoolIcon from '@mui/icons-material/Pool';
import TvIcon from '@mui/icons-material/Tv';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import CelebrationIcon from '@mui/icons-material/Celebration';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { RiBilliardsFill } from "react-icons/ri";

// Import custom CSS
import '../styles/pages/aboutpage.css';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);
const MotionCard = motion(Card);

const AboutPage: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  // Ambient hover state for glow effects
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // More detailed features with enhanced descriptions
  const features = [
    {
      title: "Championship Billiards",
      description: "9 professional tables available until 2AM. Weekly tournaments every Monday with cash prizes and late-night happy hour specials for players.",
      icon: <RiBilliardsFill style={{ fontSize: 40 }} />,
      color: "#e63946",
      route: "/reservations?type=billiards"
    },
    {
      title: "Private Karaoke Suites",
      description: "5 premium soundproof rooms with 50,000+ songs. Perfect for late night sessions with friends, each with dedicated service buttons for drinks and food.",
      icon: <MicExternalOnIcon fontSize="large" />,
      color: "#457b9d",
      route: "/reservations?type=karaoke"
    },
    {
      title: "Nocturnal Sports Hub",
      description: "Never miss a game with our late broadcasts of NBA, NFL, MLB, UFC and more. 15+ HD screens with immersive sound zones throughout the venue.",
      icon: <TvIcon fontSize="large" />,
      color: "#2a9d8f",
      route: "/events"
    },
    {
      title: "Craft Cocktail Bar",
      description: "Specialty drinks crafted by expert mixologists until 2AM. Try our signature 'Night Shot' and 'Cue Ball' cocktails, perfect to enjoy while playing billiards.",
      icon: <SportsBarIcon fontSize="large" />,
      color: "#f4a261",
      route: "/menu"
    }
  ];

  // Testimonials carousel
  const testimonials = [
    {
      quote: "The atmosphere during big games is incredible! Best place to watch sports in the city. The billiards tables are championship quality, and they're open when all other places are closing.",
      author: "Mike R., Regular since 2021"
    },
    {
      quote: "My go-to spot for late night karaoke. The rooms are properly soundproofed and the song selection is unmatched. Perfect for unwinding after a long day.",
      author: "Sarah K., Weekend Regular"
    },
    {
      quote: "StopShot is where we come for our league tournaments. Great tables, amazing drinks, and the staff actually understands billiards! The 2AM closing time is perfect.",
      author: "David L., Local Billiards Champion"
    }
  ];
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <Box className="about-page-container">
      {/* Ambient neon light effect */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'radial-gradient(ellipse at top center, rgba(211, 130, 54, 0.15), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />
      
      {/* Enhanced hero section with more night vibes */}
      <Box className="hero-section">
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <MotionGrid 
            container 
            spacing={4} 
            alignItems="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Grid item xs={12} md={6}>
              <MotionTypography 
                variant="h2" 
                component="h1" 
                className="page-title"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
              >
                YOUR <span className="highlight-text"> <br></br>LATE NIGHT</span> DESTINATION
              </MotionTypography>
              
              <Typography variant="h5" className="tagline">
                Where Billiards, Karaoke & Great Times Connect Until 2AM
              </Typography>
              
              <Box mt={4} className="sports-icons">
                <Box 
                  component={RiBilliardsFill} 
                  sx={{ 
                    fontSize: '2.8rem',
                    color: '#f77f00',
                    marginRight: '16px',
                    animation: 'float 3s ease-in-out infinite',
                    filter: 'drop-shadow(0 0 10px rgba(247, 127, 0, 0.5))'
                  }}
                />
                <MicExternalOnIcon 
                  className="sports-icon" 
                  sx={{ 
                    color: '#d62828',
                    fontSize: '2.8rem',
                    marginRight: '16px',
                    animation: 'float 3s ease-in-out infinite 0.5s',
                    filter: 'drop-shadow(0 0 10px rgba(214, 40, 40, 0.5))'
                  }}
                />
                <SportsBasketballIcon 
                  className="sports-icon basketball" 
                  sx={{ 
                    fontSize: '2.8rem',
                    animation: 'float 3s ease-in-out infinite 1s',
                    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
                  }}
                />
                <SportsBarIcon 
                  className="sports-icon" 
                  sx={{ 
                    color: '#fcbf49',
                    fontSize: '2.8rem',
                    animation: 'float 3s ease-in-out infinite 1.5s',
                    filter: 'drop-shadow(0 0 10px rgba(252, 191, 73, 0.5))'
                  }}
                />
              </Box>
              
              <Box mt={4} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  className="cta-button" 
                  size="large"
                  component={Link}
                  to="/reservations"
                  startIcon={<NightlifeIcon />}
                  sx={{ 
                    boxShadow: '0 0 15px rgba(211, 130, 54, 0.5)',
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
                  Reserve a Spot
                </Button>
                
                <Button 
                  variant="outlined" 
                  size="large"
                  component={Link}
                  to="/menu"
                  startIcon={<SportsBarIcon />}
                  sx={{ 
                    color: '#d38236',
                    borderColor: '#d38236',
                    '&:hover': {
                      borderColor: '#d38236',
                      backgroundColor: 'rgba(211, 130, 54, 0.1)',
                    },
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  View Menu
                </Button>
              </Box>
              
              <Box mt={3} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(0,0,0,0.5)', 
                p: 1,
                px: 2,
                borderRadius: '30px',
                width: 'fit-content',
                border: '1px solid rgba(211, 130, 54, 0.3)'
              }}>
                <AccessTimeIcon sx={{ color: '#d38236', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  Open Daily 4PM - 2AM | Late Night Happy Hour 11PM - 1AM
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <MotionBox 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="hero-image-container"
                sx={{ position: 'relative' }}
              >
                <Box
                  component="img"
                  className="hero-image"
                  alt="StopShot Sports Bar"
                  src="/hero/outside.png"
                  sx={{ filter: 'contrast(1.1) saturate(1.2)' }}
                />
                
                {/* Play video button overlay */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(211, 130, 54, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translate(-50%, -50%) scale(1.1)',
                    backgroundColor: 'rgba(211, 130, 54, 0.9)',
                  },
                  boxShadow: '0 0 15px rgba(211, 130, 54, 0.6)'
                }}>
                  <PlayCircleIcon sx={{ fontSize: '40px', color: 'white' }} />
                </Box>
              </MotionBox>
            </Grid>
          </MotionGrid>
        </Container>
      </Box>

      {/* Enhanced story section with night theme */}
      <Box className="story-section" sx={{ backgroundColor: '#1a1a1a', position: 'relative' }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box className="story-image-grid" ref={ref}>
                <MotionBox 
                  component="img" 
                  className="story-image main"
                  src="/about/interior.png" 
                  alt="Bar Interior" 
                  initial={{ opacity: 0, y: 20 }}
                  animate={controls}
                  variants={{
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  sx={{
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3), 0 0 30px rgba(211, 130, 54, 0.3)'
                  }}
                />
                <MotionBox 
                  component="img" 
                  className="story-image overlay-1"
                  src="/about/show.png" 
                  alt="Sports Fans" 
                  initial={{ opacity: 0, x: 20 }}
                  animate={controls}
                  variants={{
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }
                  }}
                  sx={{
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.3)'
                  }}
                />
                <MotionBox 
                  component="img" 
                  className="story-image overlay-2"
                  src="/about/billiards.png" 
                  alt="Billiards Table" 
                  initial={{ opacity: 0, x: -20 }}
                  animate={controls}
                  variants={{
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.4 } }
                  }}
                  sx={{
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.3)'
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold', color: '#D38236' }}
                className="section-title"
              >
                <motion.span
                  initial={{ x: -100 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ display: 'block' }}
                >
                  About Stop Shot
                </motion.span>
              </Typography>

              <MotionBox 
                initial={{ opacity: 0 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3 } }
                }}
                sx={{ mt: 5 }}
              >
                <Typography variant="body1" paragraph className="story-text">
                  <span className="first-letter">F</span>ounded in 2020 during challenging times, StopShot was born from a dream to create Manila's premier <strong>late-night sports destination</strong>. What began as a small viewing bar with two pool tables has evolved into the go-to entertainment venue in Mandaluyong City for night owls and sports enthusiasts alike.
                </Typography>
                <Typography variant="body1" paragraph className="story-text">
                  Our passion for nightlife entertainment runs deep. From showing every major sporting event on our state-of-the-art screens to hosting regional <strong>billiards tournaments until the early hours</strong>, we've created a haven for those who believe the night is when life truly begins.
                </Typography>
                <Typography variant="body1" paragraph className="story-text">
                  Whether you're challenging friends to a game of pool at midnight, belting out tunes in our premium <strong>karaoke rooms</strong>, or enjoying our signature late-night cocktails – at StopShot, we've perfected the art of after-hours entertainment.
                </Typography>
              </MotionBox>
              
              {/* Added operating hours highlight */}
              <MotionBox 
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.6 } }
                }}
                sx={{ mt: 3 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(211, 130, 54, 0.15)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(211, 130, 54, 0.3)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ color: '#d38236', mr: 2, fontSize: 30 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                        Late Night Hours
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ccc' }}>
                        Open Daily 4PM to 2AM<br />
                        Happy Hour: 4-7PM & 11PM-1AM
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
        
        {/* Ambient light effect */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(211, 130, 54, 0.1), transparent 70%)',
          pointerEvents: 'none'
        }} />
      </Box>

      {/* Enhanced features section */}
      <Box className="features-section" ref={featuresRef}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" className="section-title text-center">
              THE NIGHTLIFE <span style={{ color: '#d38236' }}>EXPERIENCE</span>
            </Typography>
            <Typography variant="subtitle1" className="section-subtitle text-center">
              Everything you need for the perfect night out
            </Typography>
            <Box 
              sx={{ 
                width: '80px', 
                height: '3px', 
                backgroundColor: '#d38236', 
                mx: 'auto',
                mt: 2,
                boxShadow: '0 0 10px rgba(211, 130, 54, 0.5)'
              }} 
            />
          </Box>
          
          <Grid container spacing={3} mt={5}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="feature-card"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  component={Link}
                  to={feature.route}
                  sx={{ 
                    textDecoration: 'none',
                    backgroundColor: '#222222',
                    cursor: 'pointer',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    border: hoveredFeature === index ? `1px solid ${feature.color}` : '1px solid #333',
                    boxShadow: hoveredFeature === index 
                      ? `0 10px 20px rgba(0,0,0,0.3), 0 0 15px ${feature.color}40` 
                      : '0 10px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at top left, ${feature.color}20, transparent 70%)`,
                    opacity: hoveredFeature === index ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none'
                  }} />
                  
                  <Box className="feature-icon-container" sx={{ bgcolor: feature.color }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ position: 'relative' }}>
                    <Typography variant="h5" component="h3" className="feature-title">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="feature-description">
                      {feature.description}
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                      }}
                    >
                      {/* <Typography variant="button" sx={{ color: feature.color, fontWeight: 500 }}>
                        Learn more
                      </Typography> */}
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Enhanced atmosphere gallery */}
      <Box className="atmosphere-section" sx={{ position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(18,18,18,0), rgba(18,18,18,1))',
          pointerEvents: 'none',
          zIndex: 3
        }} />
        
        <Box sx={{ 
          textAlign: 'center', 
          mb: 4, 
          position: 'relative',
          zIndex: 4 
        }}>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
            THE <span style={{ color: '#d38236' }}>ATMOSPHERE</span>
          </Typography>
          <Box 
            sx={{ 
              width: '80px', 
              height: '3px', 
              backgroundColor: '#d38236', 
              mx: 'auto',
              mt: 2,
              boxShadow: '0 0 10px rgba(211, 130, 54, 0.5)'
            }} 
          />
        </Box>
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 4 }}>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <MotionBox 
                className="atmosphere-image"
                component="img"
                src={`/gallery/front.png`}
                alt="Front View"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 20px rgba(211, 130, 54, 0.3)' }}
                transition={{ type: "spring", stiffness: 300 }}
                sx={{
                  borderRadius: '12px',
                  border: '2px solid #333',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover'
                }}
              />
            </Grid>
            
            {/* Small images row - moved here from bottom */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} sm={3}>
                <MotionBox 
                  className="atmosphere-image"
                  component="img"
                  src={`/gallery/outside.png`}
                  alt="Outside View"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 20px rgba(211, 130, 54, 0.3)' }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{
                    borderRadius: '12px',
                    border: '2px solid #333',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    height: { xs: '140px', md: '180px' },
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MotionBox 
                  className="atmosphere-image"
                  component="img"
                  src={`/gallery/show.png`}
                  alt="Live Entertainment"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 20px rgba(211, 130, 54, 0.3)' }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{
                    borderRadius: '12px',
                    border: '2px solid #333',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    height: { xs: '140px', md: '180px' },
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MotionBox 
                  className="atmosphere-image"
                  component="img"
                  src={`/gallery/beerpong.png`}
                  alt="Beer Pong"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 20px rgba(211, 130, 54, 0.3)' }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{
                    borderRadius: '12px',
                    border: '2px solid #333',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    height: { xs: '140px', md: '180px' },
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MotionBox 
                  className="atmosphere-image"
                  component="img"
                  src={`/gallery/drinks.png`}
                  alt="Signature Drinks"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 20px rgba(211, 130, 54, 0.3)' }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{
                    borderRadius: '12px',
                    border: '2px solid #333',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    height: { xs: '140px', md: '180px' },
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Grid>
            </Grid>

            {/* Bar and side images */}
            <Grid container spacing={2}>
              {/* Featured large image - Bar atmosphere */}
              <Grid item xs={12} md={8}>
                <MotionBox 
                  className="atmosphere-image large"
                  component="img"
                  src={`/gallery/bar.png`}
                  alt="Bar Atmosphere"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 20px rgba(211, 130, 54, 0.3)'
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{
                    borderRadius: '12px',
                    border: '2px solid #333',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Grid>
              
              {/* Right side column */}
              <Grid item xs={12} md={4}>
                <Grid container spacing={0.1}>
                  <Grid item xs={12}>
                    <MotionBox 
                      className="atmosphere-image"
                      component="img"
                      src={`/gallery/billiards.png`}
                      alt="Billiards Tables"
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 20px rgba(211, 130, 54, 0.3)' }}
                      transition={{ type: "spring", stiffness: 300 }}
                      sx={{
                        borderRadius: '12px',
                        border: '2px solid #333',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        height: '200px',
                        width: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MotionBox 
                      className="atmosphere-image"
                      component="img"
                      src={`/gallery/karaoke.png`}
                      alt="Karaoke Room"
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 20px rgba(211, 130, 54, 0.3)' }}
                      transition={{ type: "spring", stiffness: 300 }}
                      sx={{
                        borderRadius: '12px',
                        border: '2px solid #333',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        height: '200px',
                        width: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          
          {/* Added featured activities */}
          <Box sx={{ mt: 6, mb: 4 }}>
            <Grid container spacing={3}>
              {[
                { title: "Weekly Billiards Tournaments", icon: <RiBilliardsFill style={{ fontSize: 28 }} />, color: "#e63946" },
                { title: "Live Sports Broadcasts All Night", icon: <TvIcon />, color: "#2a9d8f" },
                { title: "Private Karaoke Until 2AM", icon: <MicExternalOnIcon />, color: "#457b9d" },
                { title: "Night Owl Drink Specials", icon: <SportsBarIcon />, color: "#f4a261" }
              ].map((item, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Paper 
                    elevation={3}
                    sx={{ 
                      p: 2, 
                      height: '100%', 
                      backgroundColor: '#1E1E1E',
                      border: `1px solid ${item.color}40`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 10px 20px rgba(0,0,0,0.2), 0 0 15px ${item.color}30`
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: `${item.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        color: item.color
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Enhanced testimonial section */}
      <Box className="testimonials-section" sx={{
        background: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.9)), url('/backgrounds/cheering-fans.jpg')`,
        py: 8,
        position: 'relative'
      }}>
        {/* Ambient light effect */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(211, 130, 54, 0.2), transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 1
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Box className="testimonial-card" sx={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            p: 4,
            borderRadius: '16px',
            position: 'relative',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <IconButton 
              onClick={prevTestimonial}
              sx={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#d38236',
                backgroundColor: 'rgba(0,0,0,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(211, 130, 54, 0.2)'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <IconButton 
              onClick={nextTestimonial}
              sx={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#d38236',
                backgroundColor: 'rgba(0,0,0,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(211, 130, 54, 0.2)'
                }
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
            
            <FormatQuoteIcon sx={{ 
              fontSize: 60, 
              color: 'rgba(211, 130, 54, 0.3)', 
              position: 'absolute',
              top: 20,
              left: 20
            }} />
            
            <Box sx={{ px: { xs: 2, sm: 6 } }}>
              <MotionTypography 
                key={currentTestimonial}
                variant="h5" 
                className="testimonial-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                sx={{ fontStyle: 'italic', fontWeight: 400, textAlign: 'center' }}
              >
                "{testimonials[currentTestimonial].quote}"
              </MotionTypography>
            </Box>
            
            <MotionBox 
              key={`author-${currentTestimonial}`}
              className="testimonial-author"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              sx={{ mt: 4, textAlign: 'center' }}
            >
              <Typography variant="subtitle1" sx={{ color: '#d38236', fontWeight: 600 }}>
                {testimonials[currentTestimonial].author}
              </Typography>
            </MotionBox>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              {testimonials.map((_, index) => (
                <Box 
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  sx={{
                    width: index === currentTestimonial ? '12px' : '8px',
                    height: index === currentTestimonial ? '12px' : '8px',
                    borderRadius: '50%',
                    backgroundColor: index === currentTestimonial ? '#d38236' : '#555',
                    mx: 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Enhanced CTA section */}
      <Box className="cta-section" sx={{
        background: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('/backgrounds/bar-counter.jpg')`,
        py: 10,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient glow effects */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '20%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(211, 130, 54, 0.15), transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }} />
        
        <Box sx={{
          position: 'absolute',
          top: '30%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(69, 123, 157, 0.15), transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Box textAlign="center">
            <MotionTypography 
              variant="h3" 
              className="cta-title"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{ textShadow: '0 0 20px rgba(0,0,0,0.7)' }}
            >
              Your Night Is Just <span style={{ color: '#d38236' }}>Beginning</span>
            </MotionTypography>
            
            <MotionTypography 
              variant="h6" 
              className="cta-subtitle"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              sx={{ my: 3 }}
            >
              Open daily 4PM - 2AM • Happy Hour 4-7PM & 11PM-1AM
            </MotionTypography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', my: 4 }}>
              <Chip
                icon={<RiBilliardsFill style={{ color: '#222' }} />}
                label="Billiards Tables"
                sx={{ 
                  bgcolor: '#d38236', 
                  color: '#222',
                  fontWeight: 600,
                  '&.MuiChip-root': {
                    height: '36px',
                    fontSize: '0.95rem',
                    px: 1
                  }
                }}
              />
              
              <Chip
                icon={<MicExternalOnIcon sx={{ color: '#222' }} />}
                label="Karaoke Rooms"
                sx={{ 
                  bgcolor: '#d38236', 
                  color: '#222',
                  fontWeight: 600,
                  '&.MuiChip-root': {
                    height: '36px',
                    fontSize: '0.95rem',
                    px: 1
                  }
                }}
              />
              
              <Chip
                icon={<NightlifeIcon sx={{ color: '#222' }} />}
                label="Late Night Bar"
                sx={{ 
                  bgcolor: '#d38236', 
                  color: '#222',
                  fontWeight: 600,
                  '&.MuiChip-root': {
                    height: '36px',
                    fontSize: '0.95rem',
                    px: 1
                  }
                }}
              />
              
              <Chip
                icon={<CelebrationIcon sx={{ color: '#222' }} />}
                label="Special Events"
                sx={{ 
                  bgcolor: '#d38236', 
                  color: '#222',
                  fontWeight: 600,
                  '&.MuiChip-root': {
                    height: '36px',
                    fontSize: '0.95rem',
                    px: 1
                  }
                }}
              />
            </Box>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button 
                variant="contained" 
                className="cta-button" 
                component={Link}
                to="/reservations"
                size="large" 
                sx={{ 
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 0 20px rgba(211, 130, 54, 0.5)',
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
                Reserve Your Spot
              </Button>
            </MotionBox>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

// Additional arrow icons for testimonial navigation
const ArrowBackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
    <path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const ArrowForwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
    <path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

export default AboutPage;