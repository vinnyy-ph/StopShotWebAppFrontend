// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button 
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../styles/pages/homepage.css'; // Custom CSS import

// Hero Slideshow Data
const slides = [
  {
    image: '/hero/billiards.png',
    title: 'BILLIARDS AREA',
    subtitle: 'A lively spot to challenge friends to a game of pool with drinks on the side.'
  },
  {
    image: '/hero/karaoke.png',
    title: 'KARAOKE AREA',
    subtitle: 'An indoor private area to sing your heart out with top-notch sound systems.'
  },
  {
    image: '/hero/bar.png',
    title: 'BAR AREA',
    subtitle: 'A sleek and cozy bar serving our signature cocktails, beers, and spirits.'
  },
  {
    image: '/hero/outside.png',
    title: 'OUTSIDE LOUNGE',
    subtitle: 'A relaxed open-air space for unwinding with drinks and good company.'
  },
  {
    image: '/hero/show.png',
    title: 'SPECTACULAR SHOWS',
    subtitle: 'Dazzling live performances and electrifying energy all night long.'
  },
];

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

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
    <Box className="homepage">
      {/* ====== HERO SLIDESHOW SECTION ====== */}
      <Box className="slideshow-container">
        {slides.map((slide, index) => (
          <Box
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            sx={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <Box className="overlay">
              <Typography variant="h3" className="slide-title">
                {slide.title}
              </Typography>
              <Typography variant="h6" className="slide-subtitle">
                {slide.subtitle}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* Pagination & Arrows */}
        <Box className="pagination-dots">
          <Box className="arrow arrow-left" onClick={handlePrev}>
            <ArrowBackIosIcon fontSize="small" />
          </Box>

          {slides.map((_, index) => (
            <Box
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}

          <Box className="arrow arrow-right" onClick={handleNext}>
            <ArrowForwardIosIcon fontSize="small" />
          </Box>
        </Box>
      </Box>

      {/* ====== MAIN HOMEPAGE CONTENT ====== */}
      <Box className="home-content">
        {/* Introduction / Welcome Section */}
        <Box className="intro-section">
          {/* <Typography variant="h4" className="section-title">
            Welcome to Stop Shot Sports Bar
          </Typography>
          <Typography variant="body1" className="section-text">
            Experience the perfect blend of great food, live sports, and
            entertainment. Whether you’re here to enjoy a thrilling pool match,
            belt out your favorite tunes, or just relax with friends over drinks,
            we’ve got something for everyone.
          </Typography> */}
        </Box>

        {/* Featured Offerings Section */}
        <Box className="featured-offerings-section">
          {/* <Typography variant="h5" className="section-title">
            Featured Offerings
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card className="offer-card">
                <CardMedia
                  component="img"
                  height="180"
                  image="/hero/cocktails.png"
                  alt="Cocktails"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Signature Cocktails
                  </Typography>
                  <Typography variant="body2">
                    Enjoy our curated list of cocktails, handcrafted by our top bartenders to delight your taste buds.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card className="offer-card">
                <CardMedia
                  component="img"
                  height="180"
                  image="/hero/specials.png"
                  alt="Specials"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Daily Specials
                  </Typography>
                  <Typography variant="body2">
                    From wings to burgers, each day features a unique special to keep you coming back for more.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card className="offer-card">
                <CardMedia
                  component="img"
                  height="180"
                  image="/hero/live_music.png"
                  alt="Live Music"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Live Music & Events
                  </Typography>
                  <Typography variant="body2">
                    Don’t miss our live bands, DJ sets, and interactive events happening throughout the week.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid> */}
        </Box>

        {/* Events & Promotions Section */}
        <Box className="events-promos-section">
          {/* <Typography variant="h5" className="section-title">
            Upcoming Events & Promotions
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box className="event-promo-card">
                <Typography variant="h6" gutterBottom>
                  Karaoke Nights
                </Typography>
                <Typography variant="body2">
                  Every Wednesday & Saturday | 8:00 PM - 12:00 AM
                </Typography>
                <Typography variant="body2">
                  Grab the mic and sing your favorite hits! Specials on selected drinks all night.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="event-promo-card">
                <Typography variant="h6" gutterBottom>
                  Live Sports Screening
                </Typography>
                <Typography variant="body2">
                  Football, Basketball, UFC, and more!
                </Typography>
                <Typography variant="body2">
                  Catch all the big matches on our giant screens. Enjoy beer bucket promos during major games.
                </Typography>
              </Box>
            </Grid>
          </Grid> */}
        </Box>

        {/* Testimonials / Reviews Section */}
        <Box className="reviews-section">
          {/* <Typography variant="h5" className="section-title">
            What Our Customers Say
          </Typography>
          <Box className="reviews-list">
            <Box className="review-item">
              <Typography variant="body1" className="review-text">
                "The atmosphere is unbeatable! Great service and amazing drinks. I love coming here with friends!"
              </Typography>
              <Typography variant="caption" className="review-author">
                - Alex M.
              </Typography>
            </Box>
            <Box className="review-item">
              <Typography variant="body1" className="review-text">
                "Their daily specials are awesome. The wings are a must-try, and the pool tables are top-notch!"
              </Typography>
              <Typography variant="caption" className="review-author">
                - Jordan K.
              </Typography>
            </Box>
          </Box> */}
        </Box>

        {/* Call-to-Action Section */}
        <Box className="reservation-cta-section">
          <Typography variant="h4" className="section-title">
            Ready to Book Your Table?
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            href="/reservations"
            sx={{ mt: 2, background:'#d38236'}}
          >
            Reserve Now
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
