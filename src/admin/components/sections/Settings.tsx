import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  StepConnector,
  stepConnectorClasses
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';

interface SettingsProps {
  darkMode: boolean;
  onDarkModeChange: (darkMode: boolean) => void;
}

// Define password change steps (same as forgot password)
const steps = ['Request OTP', 'Verify Code', 'Set New Password'];
const API_BASE_URL = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';

// Custom connector for stepper
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#eaeaf0',
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#e67e22',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#e67e22',
    },
  },
}));

// Custom step icons
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }: any) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: '#e67e22',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#e67e22',
  }),
}));

function ColorlibStepIcon(props: any) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <EmailIcon />,
    2: <VpnKeyIcon />,
    3: <LockOutlinedIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? <CheckIcon /> : icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const Settings: React.FC<SettingsProps> = ({ darkMode, onDarkModeChange }) => {
  const { authToken } = useAuth();
  const theme = useTheme();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Change password dialog and form states
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP based password change states
  const [changePasswordStep, setChangePasswordStep] = useState(0);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // Added success message state
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Create axios instance with auth header
        const axiosInstance = axios.create({
          baseURL: API_BASE_URL,
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Get user profile
        const response = await axiosInstance.get('/auth/profile/');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    if (authToken) {
      fetchUserData();
    }
  }, [authToken]);

  const handleRequestOTP = async () => {
    try {
      // Use the existing request-reset endpoint
      await axios.post(`${API_BASE_URL}/auth/request-reset/`, {
        email: userData.email // Use the logged-in user's email
      });
      
      setOtpSent(true);
      setSuccessMessage("OTP sent successfully to your email.");
      setShowSuccessAlert(true);
      setChangePasswordStep(1); // Move to OTP verification step
    } catch (error: any) {
      console.error('Request OTP error:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        setPasswordError(error.response.data.error);
      } else {
        setPasswordError('Failed to send OTP. Please try again later.');
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      // Use the existing verify-otp endpoint
      await axios.post(`${API_BASE_URL}/auth/verify-otp/`, {
        otp: otp
      });
      
      setSuccessMessage("OTP verified successfully.");
      setShowSuccessAlert(true);
      setChangePasswordStep(2); // Move to new password step
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        setPasswordError(error.response.data.error);
      } else {
        setPasswordError('Invalid or expired OTP. Please try again.');
      }
    }
  };

  const handleResetPassword = async () => {
    // Validate password fields
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    try {
      // Use the existing reset-password endpoint
      await axios.post(`${API_BASE_URL}/auth/reset-password/`, {
        email: userData.email,
        new_password: newPassword
      });
      
      // Reset form and close dialog
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setChangePasswordStep(0);
      setChangePasswordOpen(false);
      setOtpSent(false);
      
      // Show success message
      setSuccessMessage("Password changed successfully!");
      setShowSuccessAlert(true);
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        setPasswordError(error.response.data.error);
      } else {
        setPasswordError('Failed to change password. Please try again later.');
      }
    }
  };

  const handleStepAction = () => {
    switch (changePasswordStep) {
      case 0:
        handleRequestOTP();
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

  const getStepButtonText = () => {
    switch (changePasswordStep) {
      case 0:
        return otpSent ? "RESEND OTP" : "SEND OTP";
      case 1:
        return "VERIFY";
      case 2:
        return "CHANGE PASSWORD";
      default:
        return "NEXT";
    }
  };

  const handleCloseDialog = () => {
    setChangePasswordOpen(false);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setChangePasswordStep(0);
    setOtpSent(false);
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
  };

  // Set text color based on mode
  const textColor = darkMode ? '#fff' : '#333';
  const descriptionColor = darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
  
  // Render the current step content in the change password dialog
  const renderChangePasswordStep = () => {
    switch (changePasswordStep) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2, color: textColor }}>
              We'll send a verification code to your email:
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: textColor }}>
              {userData.email}
            </Typography>
            <Typography variant="body2" sx={{ color: descriptionColor, mb: 1 }}>
              Click the "Send OTP" button below to receive a one-time password.
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3, color: textColor }}>
              Enter the 6-digit code sent to your email.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Verification Code"
              type="text"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ 
                maxLength: 6,
                style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2em' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon sx={{ color: darkMode ? '#e67e22' : undefined }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-input': { color: textColor },
                '& .MuiInputLabel-root': { color: descriptionColor },
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.2)' : undefined },
                  '&:hover fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.3)' : undefined },
                  '&.Mui-focused fieldset': { borderColor: '#e67e22' }
                }
              }}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3, color: textColor }}>
              Create a new password.
            </Typography>
            <TextField
              margin="dense"
              label="New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              helperText="Password must be at least 6 characters long"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: darkMode ? '#e67e22' : undefined }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : undefined }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiInputBase-input': { color: textColor },
                '& .MuiInputLabel-root': { color: descriptionColor },
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.2)' : undefined },
                  '&:hover fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.3)' : undefined },
                  '&.Mui-focused fieldset': { borderColor: '#e67e22' }
                },
                '& .MuiFormHelperText-root': { color: descriptionColor }
              }}
            />
            <TextField
              margin="dense"
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{
                '& .MuiInputBase-input': { color: textColor },
                '& .MuiInputLabel-root': { color: descriptionColor },
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.2)' : undefined },
                  '&:hover fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.3)' : undefined },
                  '&.Mui-focused fieldset': { borderColor: '#e67e22' }
                }
              }}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box className="content-paper" sx={{ color: textColor }}>
        <Typography variant="h6" className="settings-title" sx={{ color: textColor }}>
          User Preferences
        </Typography>
        
        <Box className="settings-item">
          <Box className="settings-text">
            <Typography variant="body1" fontWeight={500} sx={{ color: textColor }}>Dark Mode</Typography>
            <Typography variant="body2" className="settings-description" sx={{ color: descriptionColor }}>
              Enable dark mode for better visibility in low light
            </Typography>
          </Box>
          <Switch 
            checked={darkMode} 
            onChange={(e) => onDarkModeChange(e.target.checked)}
            className="settings-switch"
          />
        </Box>
        
        <Box className="settings-item">
          <Box className="settings-text">
            <Typography variant="body1" fontWeight={500} sx={{ color: textColor }}>Notifications</Typography>
            <Typography variant="body2" className="settings-description" sx={{ color: descriptionColor }}>
              Receive notifications for new reservations and feedback
            </Typography>
          </Box>
          <Switch 
            checked={notifications} 
            onChange={(e) => setNotifications(e.target.checked)}
            className="settings-switch"
          />
        </Box>
        
        <Box className="settings-item">
          <Box className="settings-text">
            <Typography variant="body1" fontWeight={500} sx={{ color: textColor }}>Data Auto-refresh</Typography>
            <Typography variant="body2" className="settings-description" sx={{ color: descriptionColor }}>
              Automatically refresh dashboard data every 5 minutes
            </Typography>
          </Box>
          <Switch 
            checked={autoRefresh} 
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="settings-switch"
          />
        </Box>
      </Box>
      
      <Box className="content-paper" sx={{ mt: 2, color: textColor }}>
        <Typography variant="h6" className="settings-title" sx={{ color: textColor }}>
          Account Settings
        </Typography>
        
        <Box className="account-settings" sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              className="account-avatar" 
              sx={{ 
                bgcolor: '#e67e22', 
                width: 60, 
                height: 60 
              }}
            >
              {userData.username ? userData.username[0].toUpperCase() : 'A'}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: textColor, mb: 0.5 }}>
                {userData.username || 'Loading...'}
              </Typography>
              <Typography variant="body2" sx={{ color: descriptionColor }}>
                {userData.email || 'Loading...'}
              </Typography>
              <Typography variant="body2" sx={{ color: descriptionColor }}>
                Role: {userData.role === 'ADMIN' ? 'Administrator' : userData.role || 'Admin'}
              </Typography>
            </Box>
          </Box>
          
          <Button 
            variant="outlined" 
            sx={{ 
              borderColor: '#e67e22',
              color: '#e67e22',
              '&:hover': {
                borderColor: '#d35400',
                backgroundColor: 'rgba(230, 126, 34, 0.08)'
              }
            }}
            onClick={() => setChangePasswordOpen(true)}
          >
            CHANGE PASSWORD
          </Button>
        </Box>
      </Box>
      
      {/* Change Password Dialog */}
      <Dialog 
        open={changePasswordOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: darkMode ? '#1a1a1a' : '#fff',
            color: textColor,
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            color: textColor, 
            borderBottom: darkMode ? '1px solid #333' : '1px solid #eee',
            py: 2,
            px: 3,
            fontWeight: 'bold'
          }}
        >
          Change Password
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {passwordError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                mt: 1,
                backgroundColor: darkMode ? 'rgba(211, 47, 47, 0.15)' : undefined,
                color: darkMode ? '#fff' : undefined
              }}
            >
              {passwordError}
            </Alert>
          )}
          
          <Stepper 
            activeStep={changePasswordStep} 
            alternativeLabel 
            connector={<ColorlibConnector />}
            sx={{ pt: 1, pb: 4 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <Typography sx={{ color: textColor }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderChangePasswordStep()}
        </DialogContent>
        <DialogActions 
          sx={{ 
            px: 3, 
            py: 2, 
            borderTop: darkMode ? '1px solid #333' : '1px solid #eee',
            display: 'flex', 
            justifyContent: 'space-between'
          }}
        >
          <Button 
            onClick={handleCloseDialog} 
            sx={{ 
              color: darkMode ? '#e67e22' : 'inherit',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(230, 126, 34, 0.08)' : undefined
              }
            }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleStepAction}
            variant="contained" 
            sx={{ 
              backgroundColor: '#e67e22', 
              '&:hover': { 
                backgroundColor: '#d35400' 
              },
              '&.Mui-disabled': {
                backgroundColor: darkMode ? 'rgba(230, 126, 34, 0.3)' : undefined
              }
            }}
            disabled={
              (changePasswordStep === 0 && !userData.email) || 
              (changePasswordStep === 1 && otp.length !== 6) ||
              (changePasswordStep === 2 && (newPassword.length < 6 || newPassword !== confirmPassword))
            }
          >
            {getStepButtonText()}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Notification */}
      <Snackbar 
        open={showSuccessAlert} 
        autoHideDuration={6000} 
        onClose={handleCloseSuccessAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSuccessAlert} 
          severity="success" 
          sx={{ 
            width: '100%',
            backgroundColor: darkMode ? 'rgba(76, 175, 80, 0.15)' : undefined,
            color: darkMode ? '#fff' : undefined
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Settings;