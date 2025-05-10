import React from 'react';
import { Box, Grid, Typography, TextField, Button, InputAdornment, Divider, IconButton } from '@mui/material';
import '../styles/components/footer.css';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      className="footer-container"
      sx={{
        backgroundColor: '#0a0a0a',
        backgroundImage: 'linear-gradient(rgba(40, 40, 40, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(40, 40, 40, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        borderTop: '1px solid #2a2a2a',
        paddingTop: '40px'
      }}
    >
      {/* Top Row */}
      <Grid container className="footer-top-row" spacing={4}>
        <Grid item xs={12} md={6} className="footer-locate">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ color: '#d38236', mr: 1, fontSize: 28 }} />
            <Typography variant="h5" className="footer-heading" sx={{ color: '#d38236', fontWeight: 700, letterSpacing: '1px' }}>
              LOCATE US
            </Typography>
          </Box>
          <Box sx={{ 
            ml: 4, 
            pl: 1, 
            borderLeft: '2px solid #d38236', 
            '&:hover': { 
              transform: 'translateX(5px)',
              transition: 'transform 0.3s ease'
            }
          }}>
            <Typography variant="body1" className="footer-text" sx={{ color: '#fff', mb: 1 }}>
              358 M. Vicente St, Brgy. Malamig, Mandaluyong City
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <AccessTimeIcon sx={{ color: '#d38236', mr: 1, fontSize: 20 }} />
              <Box>
                <Typography variant="body2" className="footer-text" sx={{ color: '#bbb' }}>
                  Monday - Sunday
                </Typography>
                <Typography variant="body2" className="footer-text" sx={{ color: '#fff', fontWeight: 600 }}>
                  4PM - 2AM
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} className="footer-updates">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            position: 'relative'
          }}>
            <Typography 
              variant="h5" 
              className="footer-heading" 
              sx={{ 
                color: '#d38236', 
                fontWeight: 700, 
                letterSpacing: '1px',
                position: 'relative',
                zIndex: 2
              }}
            >
              GAME DAY ALERTS
            </Typography>
            <SportsSoccerIcon 
              sx={{ 
                color: 'rgba(211, 130, 54, 0.2)', 
                fontSize: 50,
                position: 'absolute',
                right: 50,
                transform: 'rotate(15deg)',
                zIndex: 1
              }} 
            />
          </Box>

          <Typography variant="body1" sx={{ color: '#bbb', mb: 2, maxWidth: '80%' }}>
            Get updates on upcoming events, game nights, and exclusive deals!
          </Typography>

          <Box className="subscribe-container" sx={{ 
            border: '2px solid #d38236',
            borderRadius: '999px',
            backgroundColor: 'rgba(211, 130, 54, 0.1)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 0 15px rgba(211, 130, 54, 0.3)'
            }
          }}>
            <TextField
              variant="outlined"
              placeholder="Enter your email"
              size="small"
              className="subscribe-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                  color: '#fff'
                },
                '& .MuiOutlinedInput-input': { 
                  padding: '12px 14px',
                  '&::placeholder': { color: '#999' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon style={{ color: '#d38236' }} />
                  </InputAdornment>
                )
              }}
            />
            <Button 
              variant="contained" 
              className="subscribe-button"
              sx={{
                backgroundColor: '#d38236',
                color: '#fff',
                fontWeight: 'bold',
                padding: '8px 24px',
                borderRadius: '999px',
                '&:hover': {
                  backgroundColor: '#b05e1d',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              JOIN THE TEAM
            </Button>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mt: 3,
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}>
            {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, idx) => (
              <IconButton 
                key={idx}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: '#d38236',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#d38236',
                    color: '#fff',
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Icon />
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Middle Row: Full-Width Map with styled container */}
      <Box 
        className="footer-map-row" 
        sx={{
          mt: 6,
          mb: 6, 
          border: 'none', 
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
          position: 'relative'
        }}
      >
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40px',
          background: 'linear-gradient(to right, #d38236, #b05e1d)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          px: 2
        }}>
          <LocationOnIcon sx={{ color: '#fff', mr: 1 }} />
          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
            FIND US HERE
          </Typography>
        </Box>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.421774913128!2d121.04219071038666!3d14.575026185849502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9459c58bcb7%3A0x563ad18fc323e83d!2sStop%20Shot%20Sports%20Bar%20%26%20KTV!5e0!3m2!1sen!2sph!4v1741402972614!5m2!1sen!2sph"
          width="100%"
          height="400"
          style={{ border: 0, marginTop: '40px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>

      {/* Bottom Row */}
      <Grid container className="footer-bottom-row" spacing={4}>
        <Grid item xs={12} md={6} className="footer-brand-section">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <img
              src="/logo.png"
              alt="Stop Shot Logo"
              className="footer-logo"
              style={{ maxWidth: '180px', height: 'auto', filter: 'drop-shadow(0 0 10px rgba(211, 130, 54, 0.5))' }}
            />
            <SportsBasketballIcon sx={{ 
              color: '#d38236', 
              ml: 2, 
              fontSize: 32,
              animation: 'bounce 2s infinite' 
            }} />
          </Box>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
            Stop Shot - Mandaluyong
          </Typography>
          <Typography variant="body2" sx={{ color: '#bbb', mb: 2, maxWidth: '80%' }}>
            The ultimate sports destination in the heart of Mandaluyong. Come for the games, stay for the experience.
          </Typography>
          <Typography variant="body2" sx={{ color: '#d38236' }}>
            stopshot.management@gmail.com
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} className="footer-links-section">
          <Typography variant="h6" sx={{ color: '#d38236', fontWeight: 600, mb: 3 }}>
            QUICK LINKS
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> },
              { label: 'Menu', path: '/menu', icon: <RestaurantMenuIcon fontSize="small" /> },
              { label: 'Reservations', path: '/reservations', icon: <EventSeatIcon fontSize="small" /> },
              { label: 'Contact', path: '/contact', icon: <ContactPhoneIcon fontSize="small" /> }
            ].map((link, idx) => (
              <Grid item xs={6} key={idx}>
                <Box 
                  component="a" 
                  href={link.path}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#fff',
                    textDecoration: 'none',
                    mb: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#d38236',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  {link.icon}
                  <Typography sx={{ ml: 1 }}>{link.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 3,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="subtitle2" sx={{ color: '#aaa' }}>
              GAME ON!
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <SportsBasketballIcon sx={{ color: '#d38236', fontSize: 20 }} />
              <SportsSoccerIcon sx={{ color: '#d38236', fontSize: 20 }} />
              <SportsBaseballIcon sx={{ color: '#d38236', fontSize: 20 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Box className="footer-divider" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mt: 4 }} />

      {/* Copyright */}
      <Box className="footer-copyright" sx={{ pt: 3, pb: 3, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#777' }}>
          © 2025 All Rights Reserved. Stop Shot - Mandaluyong | Powered by BSCS 3-3 Group 4
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;