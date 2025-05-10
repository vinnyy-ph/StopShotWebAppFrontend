import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Zoom,
  Badge,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import InfoIcon from '@mui/icons-material/Info';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import RateReviewIcon from '@mui/icons-material/RateReview';
// import CircleIcon from '@mui/icons-material/Circle';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import '../styles/components/navbar.css';

const navLinks = [
  { title: 'Home', path: '/', icon: <HomeIcon /> },
  { title: 'Menu', path: '/menu', icon: <RestaurantMenuIcon /> },
  { title: 'Reservations', path: '/reservations', icon: <EventSeatIcon /> },
  { title: 'About', path: '/about', icon: <InfoIcon /> },
  { title: 'Contact', path: '/contact', icon: <ContactPhoneIcon /> },
  { title: 'Feedback', path: '/feedback', icon: <RateReviewIcon /> },
];

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBall, setShowBall] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Show the basketball icon after a delay
    const timer = setTimeout(() => {
      setShowBall(true);
    }, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <Box 
      className="drawer-container" 
      role="presentation"
      sx={{ 
        backgroundColor: '#121212',
        color: '#fff',
        backgroundImage: 'linear-gradient(rgba(40, 40, 40, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(40, 40, 40, 0.2) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <Box className="drawer-close">
        <IconButton onClick={toggleDrawer(false)} sx={{ color: '#d38236' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navLinks.map((link) => (
          <ListItem 
            key={link.title} 
            component={Link} 
            to={link.path}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(211, 130, 54, 0.15)',
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#d38236' }}>
              {link.icon}
            </ListItemIcon>
            <ListItemText
              primary={link.title}
              primaryTypographyProps={{ variant: 'h6', sx: { color: '#fff' } }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      className="navbar-appbar"
      sx={{
        backgroundColor: isScrolled ? '#0a0a0a' : '#121212',
        boxShadow: isScrolled 
          ? '0px 4px 20px rgba(0, 0, 0, 0.5)' 
          : '0px 2px 10px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        borderBottom: `1px solid ${isScrolled ? '#2a2a2a' : 'transparent'}`,
        backgroundImage: 'linear-gradient(rgba(40, 40, 40, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <Toolbar
        style={{
          minHeight: isScrolled ? '70px' : '90px',
          transition: 'all 0.3s ease',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: '0 20px'
        }}
      >
        {/* Left side: Clickable logo with bouncing billiard ball effect */}
        <Box className="navbar-logo-container">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo.png" 
              alt="Stop Shot Logo" 
              className="navbar-logo" 
              style={{
                height: isScrolled ? '35px' : '40px',
                transition: 'height 0.3s ease'
              }}
            />
            <Zoom in={showBall} timeout={500}>
              <Box 
                sx={{ 
                  position: 'relative',
                  ml: 1,
                  animation: 'bounce 2s infinite',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* <CircleIcon 
                  sx={{ 
                    color: '#d38236',
                    fontSize: '24px',
                    backgroundColor: '#d38236',
                    borderRadius: '50%',
                    boxShadow: '0 0 3px rgba(255,255,255,0.5)'
                  }} 
                /> */}
                {/* <Typography 
                  sx={{
                    position: 'absolute',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    userSelect: 'none'
                  }}
                >
                  9
                </Typography> */}
              </Box>
            </Zoom>
          </Link>
        </Box>
        
        {/* Right side: Navigation */}
        {isMobile ? (
          <>
            <Badge 
              badgeContent={1} 
              color="error" 
              sx={{ '& .MuiBadge-badge': { backgroundColor: '#d38236' } }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ 
                  color: '#fff',
                  '&:hover': { transform: 'scale(1.1)', color: '#d38236' },
                  transition: 'all 0.3s ease'
                }}
              >
                <MenuIcon />
              </IconButton>
            </Badge>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawerList}
            </Drawer>
          </>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {navLinks.map((link, index) => (
              <Button
                key={link.title}
                color="inherit"
                component={Link}
                to={link.path}
                className="nav-button"
                startIcon={link.icon}
                sx={{ 
                  borderRadius: '100px',
                  color: '#fff',
                  margin: '0 4px',
                  padding: '8px 16px',
                  position: 'relative',
                  overflow: 'hidden',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: '2px',
                    backgroundColor: '#d38236',
                    transition: 'width 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(211, 130, 54, 0.1)',
                    transform: 'translateY(-3px)',
                    '&:before': {
                      width: '80%'
                    }
                  },
                  animation: index === 0 ? 'none' : `fadeIn 0.5s ease ${index * 0.1}s both`
                }}
              >
                {link.title}
              </Button>
            ))}
            <Button
              variant="contained"
              component={Link}
              to="/reservations"
              sx={{
                backgroundColor: '#d38236',
                borderRadius: '100px',
                fontWeight: 'bold',
                ml: 2,
                padding: '8px 20px',
                '&:hover': {
                  backgroundColor: '#b05e1d',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              RESERVE NOW
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;