import React from 'react';
import { Box, Grid, Typography, TextField, Button, InputAdornment } from '@mui/material';
import '../styles/components/footer.css';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const Footer: React.FC = () => {
  return (
    <Box component="footer" className="footer-container">
      {/* Top Row */}
      <Grid container className="footer-top-row" spacing={2}>
        <Grid item xs={12} md={6} className="footer-locate">
          <Typography variant="h5" className="footer-heading">
            LOCATE US AT
          </Typography>
          <Typography variant="body2" className="footer-text">
            358 M. Vicente St, Brgy. Malamig, Mandaluyong City
          </Typography>
          <Typography variant="body2" className="footer-text">
            Monday - Sunday
          </Typography>
          <Typography variant="body2" className="footer-text">
            4PM - 2AM
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} className="footer-updates">
      <Typography variant="h6" className="footer-heading">
        KEEP UPDATED FOR EVENTS AND MORE DEALS!
      </Typography>

      <Box className="subscribe-container">
        <TextField
          variant="outlined"
          placeholder="Enter your email"
          size="small"
          className="subscribe-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon style={{ color: '#FBAA00' }} />
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" color="warning" className="subscribe-button">
          SUBSCRIBE
        </Button>
      </Box>
    </Grid>
      </Grid>

      {/* Middle Row: Full-Width Map */}
      <Box className="footer-map-row">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.421774913128!2d121.04219071038666!3d14.575026185849502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9459c58bcb7%3A0x563ad18fc323e83d!2sStop%20Shot%20Sports%20Bar%20%26%20KTV!5e0!3m2!1sen!2sph!4v1741402972614!5m2!1sen!2sph"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>

      {/* Bottom Row */}
      <Grid container className="footer-bottom-row" spacing={2}>
        <Grid item xs={12} md={6} className="footer-brand-section">
          {/* Logo placeholder: replace src with your actual logo path */}
          <img
            src="/logo.png"
            alt="Stop Shot Logo"
            className="footer-logo"
          />
          <Typography variant="body2" className="footer-subtext">
            Stop Shot - Mandaluyong
          </Typography>
          <Typography variant="body2" className="footer-contact">
            msysonxyz@genrail.com
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} className="footer-links-section">
          <Typography variant="body1" className="footer-links-title">
            Quick Links
          </Typography>
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/menu">Menu</a>
            </li>
            <li>
              <a href="/reservations">Reservations</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </Grid>
      </Grid>

      {/* Divider */}
      <Box className="footer-divider" />

      {/* Copyright */}
      <Box className="footer-copyright">
        <Typography variant="caption">
          © 2025 All Rights Reserved. Stop Shot - Mandaluyong | Powered by Lorem Ipsum
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
