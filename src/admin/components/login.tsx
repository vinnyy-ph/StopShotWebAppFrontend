import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  IconButton,
  Snackbar,
  Alert,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  Stepper,
  StepLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import '../styles/loginPage.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';

// Define reset password steps
const steps = ['Request Reset', 'Verify Code', 'Set New Password'];

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const { setAuthToken, setUserRole } = useAuth();
  const navigate = useNavigate();
  
  // Password reset states
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  const [resetActiveStep, setResetActiveStep] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(prev => prev - 1);
      }, 1000);
    } else if (isLocked && lockTimer === 0) {
      setIsLocked(false);
    }
    
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate distance from center (max 20px movement)
      const deltaX = (clientX - centerX) / centerX * 10;
      const deltaY = (clientY - centerY) / centerY * 10;
      
      setLogoPosition({ x: deltaX, y: deltaY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    try {
      // The backend authenticates with either username or email
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        username: username,
        email: username, // Also send as email since backend checks both
        password
      });
      
      // Store token and user info in auth context
      setAuthToken(response.data.token);
      setUserRole(response.data.user.role);
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Display more detailed error information
      if (error.response && error.response.data) {
        console.log('Error details:', error.response.data);
        setError(error.response.data.error || 'Login failed. Please try again.');
      } else {
        setError('Cannot connect to server. Please try again later.');
      }
      
      setLoginAttempts(prev => prev + 1);
      
      if (loginAttempts + 1 >= 3) {
        setIsLocked(true);
        setLockTimer(30); // Lock for 30 seconds
      }
    }
  };

  const handleCloseAlert = () => {
    setError('');
    setMessage('');
  };
  
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    // Open the reset password dialog
    setResetDialogOpen(true);
    setResetEmail(username); // Pre-fill with the current username/email if available
  };

  const handleCloseResetDialog = () => {
    // Reset all states when closing the dialog
    setResetDialogOpen(false);
    setResetActiveStep(0);
    setResetOTP('');
    setNewPassword('');
    setConfirmPassword('');
    setOtpSent(false);
  };

  const handleRequestReset = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/request-reset/`, {
        email: resetEmail,
      });
      
      setOtpSent(true);
      setMessage("OTP sent successfully to your email.");
      setResetActiveStep(1); // Move to next step
    } catch (error: any) {
      console.error('Request reset error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Failed to request password reset.');
      } else {
        setError('Cannot connect to server. Please try again later.');
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/verify-otp/`, {
        otp: resetOTP,
      });
      
      setMessage("OTP verified successfully.");
      setResetActiveStep(2); // Move to next step
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Invalid or expired OTP.');
      } else {
        setError('Cannot connect to server. Please try again later.');
      }
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password/`, {
        email: resetEmail,
        new_password: newPassword,
      });
      
      setMessage("Password reset successfully. You can now login with your new password.");
      handleCloseResetDialog();
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Failed to reset password.');
      } else {
        setError('Cannot connect to server. Please try again later.');
      }
    }
  };
  
  const renderResetStep = () => {
    switch (resetActiveStep) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Enter your email address to receive a password reset code.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Enter the 6-digit code sent to your email.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Verification Code"
              type="text"
              fullWidth
              value={resetOTP}
              onChange={(e) => setResetOTP(e.target.value)}
              inputProps={{ maxLength: 6 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Create a new password.
            </Typography>
            <TextField
              margin="dense"
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin="dense"
              label="Confirm New Password"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const getStepButtonText = () => {
    switch (resetActiveStep) {
      case 0:
        return otpSent ? "Resend Code" : "Send Code";
      case 1:
        return "Verify";
      case 2:
        return "Reset Password";
      default:
        return "Next";
    }
  };

  const handleStepAction = () => {
    switch (resetActiveStep) {
      case 0:
        handleRequestReset();
        break;
      case 1:
        handleVerifyOTP();
        break;
      case 2:
        handleResetPassword();
        break;
      default:
        break;
    }
  };
  
  return (
    <Box className="admin-login-page">
      <Container maxWidth="sm" className="login-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={8}
            className="login-paper"
          >
            <Box className="login-header">
              <motion.div
                animate={{
                  x: logoPosition.x,
                  y: logoPosition.y,
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 10 },
                  x: { type: "spring", stiffness: 50 },
                  y: { type: "spring", stiffness: 50 }
                }}
                className="logo-container"
              >
                <SportsBasketballIcon className="logo-icon basketball" />
                <SportsSoccerIcon className="logo-icon soccer" />
              </motion.div>
              <Typography variant="h4" className="login-title">
                StopShot Admin
              </Typography>
              <Typography variant="subtitle1" className="login-subtitle">
                Handle reservations, manage menus, and more!
              </Typography>
            </Box>

            <Box 
              component="form" 
              onSubmit={handleLogin}
              className="login-form"
            >
              <TextField
                required
                fullWidth
                label="Email"
                variant="outlined"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon className="input-icon" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                required
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon className="input-icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        className="visibility-toggle"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              {isLocked ? (
                <Box className="locked-message">
                  <Typography variant="body2">
                    Too many failed attempts. Please try again in {lockTimer} seconds
                  </Typography>
                </Box>
              ) : (
                <Button 
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="login-button"
                  disabled={isLocked}
                >
                  Sign In
                </Button>
              )}
              
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                className="forgot-password-link"
              >
                Forgot Password?
              </Link>
            </Box>
          </Paper>
        </motion.div>
      </Container>
      
      {/* Password Reset Dialog */}
      <Dialog 
        open={resetDialogOpen} 
        onClose={handleCloseResetDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Stepper activeStep={resetActiveStep} sx={{ py: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderResetStep()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog}>Cancel</Button>
          <Button 
            onClick={handleStepAction}
            variant="contained"
            color="primary"
            disabled={
              (resetActiveStep === 0 && !resetEmail) || 
              (resetActiveStep === 1 && resetOTP.length !== 6) ||
              (resetActiveStep === 2 && (newPassword.length < 6 || newPassword !== confirmPassword))
            }
          >
            {getStepButtonText()}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert severity="error" onClose={handleCloseAlert}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!message} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert severity="info" onClose={handleCloseAlert}>
          {message}
        </Alert>
      </Snackbar>
      
      {/* Background elements */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div 
          key={i}
          className="bg-element"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </Box>
  );
};

export default AdminLogin;