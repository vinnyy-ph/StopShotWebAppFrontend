import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import { RiBilliardsFill } from "react-icons/ri";

const AgeVerificationPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Force the popup to show on every page refresh
    // by using sessionStorage instead of localStorage
    try {
      const ageVerified = sessionStorage.getItem('ageVerified');
      if (!ageVerified) {
        setOpen(true);
      }
    } catch (error) {
      // If sessionStorage is not available
      setOpen(true);
    }
  }, []);
  
  const handleConfirm = () => {
    try {
      // Save to sessionStorage so popup doesn't appear 
      // during the current browser session
      sessionStorage.setItem('ageVerified', 'true');
    } catch (error) {
      console.warn('Unable to save age verification to sessionStorage');
    }
    setOpen(false);
  };
  
  // Rest of the component remains the same...
  const handleDeny = () => {
    // Redirect to an appropriate page for underage visitors
    window.location.href = 'https://www.responsibility.org/';
  };
  
  // Prevent modal from closing when clicking outside
  const handleClose = (event: {}, reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      setOpen(false);
    }
  };
  
  
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={handleClose}
      aria-labelledby="age-verification-dialog-title"
      PaperProps={{
        sx: {
          backgroundColor: '#1a1a1a',
          color: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(211, 130, 54, 0.3)',
          boxShadow: '0 5px 20px rgba(0,0,0,0.5), 0 0 15px rgba(211, 130, 54, 0.3)',
          maxWidth: '500px',
          width: '100%',
          mx: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle id="age-verification-dialog-title" sx={{ 
        textAlign: 'center',
        background: 'linear-gradient(to right, #d38236, #b05e1d)',
        color: '#fff',
        fontWeight: 700,
        py: 2,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
        }
      }}>
        Age Verification Required
      </DialogTitle>
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ 
          mb: 3, 
          mt: 1,
          display: 'flex', 
          justifyContent: 'center',
          gap: 2
        }}>
          <Box component={RiBilliardsFill} sx={{ fontSize: 60, color: '#d38236' }} />
          <SportsBarIcon sx={{ fontSize: 60, color: '#d38236' }} />
          <NightlifeIcon sx={{ fontSize: 60, color: '#d38236' }} />
        </Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Welcome to StopShot
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          This website contains age-restricted content related to alcohol.
          You must be at least <strong>18 years of age</strong> to enter.
        </Typography>
        <Typography variant="body2" sx={{ color: '#d38236', fontStyle: 'italic' }}>
          By clicking "I am 18 or older", you confirm that you are of legal drinking age
          according to the laws in your country or region.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ 
        justifyContent: 'center', 
        pb: 4, 
        px: 3, 
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        '& .MuiButton-root': {
          width: { xs: '100%', sm: 'auto' },
          minWidth: { sm: '160px' }
        }
      }}>
        <Button 
          onClick={handleDeny} 
          color="error" 
          variant="contained"
          sx={{ 
            bgcolor: 'rgba(211, 47, 47, 0.9)',
            '&:hover': {
              bgcolor: 'rgba(211, 47, 47, 1)',
              boxShadow: '0 2px 8px rgba(211, 47, 47, 0.4)'
            }
          }}
        >
          I'm under 18
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          autoFocus
          sx={{ 
            bgcolor: '#d38236',
            '&:hover': {
              bgcolor: '#b05e1d',
              boxShadow: '0 2px 8px rgba(211, 130, 54, 0.5)'
            },
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
          I am 18 or older
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgeVerificationPopup;