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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import '../styles/components/Navbar.css';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Menu', path: '/menu' },
  { title: 'Reservations', path: '/reservations' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
  { title: 'Feedback', path: '/feedback' },
];

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust the scroll threshold (50) as needed
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer =
    (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
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
    <Box className="drawer-container" role="presentation">
      <Box className="drawer-close">
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navLinks.map((link) => (
          <ListItem button key={link.title} component={Link} to={link.path}>
            <ListItemText
              primary={link.title}
              primaryTypographyProps={{ variant: 'h6' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" className="navbar-appbar">
      <Toolbar
        style={{
          minHeight: isScrolled ? '70px' : '90px',
          transition: 'min-height 0.3s ease-in-out',
        }}
      >
        {/* Left side: Clickable logo */}
        <Box className="navbar-logo-container">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="navbar-logo" />
          </Link>
        </Box>
        {/* Right side: Navigation */}
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawerList}
            </Drawer>
          </>
        ) : (
          navLinks.map((link) => (
            <Button
              key={link.title}
              color="inherit"
              component={Link}
              to={link.path}
              className="nav-button"
              sx={{ borderRadius: 100 }}
            >
              {link.title}
            </Button>
          ))
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
