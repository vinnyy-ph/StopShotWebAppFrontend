import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  Divider,
  Paper,
  useTheme,
  Zoom,
  alpha,
  Fade,
  InputAdornment,
  FormControl,
  FormLabel,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';

// Orange accent color
const ACCENT_COLOR = '#d38236';

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (employee: any) => Promise<boolean>;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onClose,
  onAdd
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'BARTENDER',
    hire_date: new Date().toISOString().split('T')[0],
    is_active: true
  });

  // Validate Philippine phone number format
  const validatePhoneNumber = (phone: string) => {
    if (!phone) return true;
    const mobilePattern = /^(09\d{9}|(\+)?639\d{9})$/;
    return mobilePattern.test(phone);
  };

  // Format phone number as needed
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    
    // Remove any non-numeric characters except leading +
    let formatted = phone.replace(/[^\d+]/g, '');
    
    // If it starts with 0, keep as is
    if (formatted.startsWith('0')) {
      return formatted.substring(0, 11); // Limit to 11 digits (09XXXXXXXXX)
    }
    
    // If it starts with +63, keep as is
    if (formatted.startsWith('+63')) {
      return formatted.substring(0, 13); // Limit to 13 digits (+639XXXXXXXXX)
    }
    
    // If it starts with 63, add the +
    if (formatted.startsWith('63')) {
      return '+' + formatted.substring(0, 12); // Limit to 13 digits (+639XXXXXXXXX)
    }
    
    // If it's just the 9 digits, add the 0
    if (formatted.length === 9 && /^\d{9}$/.test(formatted)) {
      return '09' + formatted;
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);
    
    setNewEmployee({ ...newEmployee, phone_number: formattedValue });
    
    if (formattedValue && !validatePhoneNumber(formattedValue)) {
      setPhoneError('Enter a valid Philippine phone number (09XXXXXXXXX or +639XXXXXXXXX)');
    } else {
      setPhoneError('');
    }
  };

  const handleAddEmployee = async () => {
    // Validate required fields
    if (!newEmployee.first_name || !newEmployee.last_name) {
      setError('First name and last name are required');
      return;
    }

    // Validate phone number if provided
    if (newEmployee.phone_number && !validatePhoneNumber(newEmployee.phone_number)) {
      setPhoneError('Enter a valid Philippine phone number (09XXXXXXXXX or +639XXXXXXXXX)');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // Create a payload that matches what the backend expects
      const payload = {
        first_name: newEmployee.first_name,
        last_name: newEmployee.last_name,
        phone_num: newEmployee.phone_number || null, // Allow null for empty phone
        role: newEmployee.role,
        hire_date: newEmployee.hire_date,
        is_active: newEmployee.is_active
      };

      const success = await onAdd(payload);
      if (success) {
        // Reset the form
        setNewEmployee({
          first_name: '',
          last_name: '',
          phone_number: '',
          role: 'BARTENDER',
          hire_date: new Date().toISOString().split('T')[0],
          is_active: true
        });
        onClose(); // Ensure the dialog closes
      } else {
        setError('Failed to add employee. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while adding the employee.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced styling using the accent color
  const styles = {
    paper: {
      backgroundColor: '#1a1a1a',
      backgroundImage: `linear-gradient(145deg, #1e1e1e 0%, #121212 100%)`,
      color: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    },
    title: {
      borderLeft: `4px solid ${ACCENT_COLOR}`,
      paddingLeft: '16px',
      margin: '12px 0',
    },
    input: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        transition: 'all 0.2s',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.15)',
          transition: 'all 0.2s',
        },
        '&:hover fieldset': {
          borderColor: alpha(ACCENT_COLOR, 0.5),
        },
        '&.Mui-focused fieldset': {
          borderColor: ACCENT_COLOR,
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-focused': {
          color: ACCENT_COLOR,
        },
      },
      '& .MuiInputBase-input': {
        color: '#ffffff',
      },
      '& .MuiSelect-icon': {
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
    divider: {
      borderColor: 'rgba(255, 255, 255, 0.07)'
    },
    primaryButton: {
      background: `linear-gradient(45deg, ${ACCENT_COLOR} 30%, ${alpha(ACCENT_COLOR, 0.8)} 90%)`,
      color: 'white',
      fontWeight: 600,
      padding: '8px 24px',
      borderRadius: '8px',
      boxShadow: `0 4px 12px ${alpha(ACCENT_COLOR, 0.3)}`,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: `0 6px 16px ${alpha(ACCENT_COLOR, 0.5)}`,
        transform: 'translateY(-1px)',
      },
    },
    menuItem: {
      color: '#ffffff',
      '&:hover': {
        backgroundColor: alpha(ACCENT_COLOR, 0.1)
      },
      '&.Mui-selected': {
        backgroundColor: alpha(ACCENT_COLOR, 0.2),
        '&:hover': {
          backgroundColor: alpha(ACCENT_COLOR, 0.3)
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Zoom}
      transitionDuration={300}
      PaperProps={{
        elevation: 8,
        sx: styles.paper
      }}
    >
      <DialogTitle sx={{ pt: 2.5, pb: 1.5, color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={styles.title}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon sx={{ color: ACCENT_COLOR }} /> Add New Employee
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mt: 0.5 }}>
            Create a new staff member profile
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          disabled={loading}
          sx={{ 
            color: alpha('#fff', 0.7),
            '&:hover': { color: '#fff', bgcolor: alpha('#fff', 0.1) }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={styles.divider} />
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {error && (
          <Fade in={Boolean(error)}>
            <Paper sx={{ 
              p: 1.5, 
              mb: 2, 
              bgcolor: alpha('#ff3333', 0.15),
              borderRadius: '8px',
              borderLeft: '4px solid #ff3333'
            }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          </Fade>
        )}
        
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              value={newEmployee.first_name}
              onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
              required
              variant="outlined"
              sx={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <BadgeIcon sx={{ color: newEmployee.first_name ? ACCENT_COLOR : 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              value={newEmployee.last_name}
              onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
              required
              variant="outlined"
              sx={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <BadgeIcon sx={{ color: newEmployee.last_name ? ACCENT_COLOR : 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              fullWidth
              value={newEmployee.phone_number}
              onChange={handlePhoneChange}
              error={Boolean(phoneError)}
              placeholder="09XXXXXXXXX or +639XXXXXXXXX"
              helperText={phoneError || "Philippine mobile format (optional)"}
              variant="outlined"
              sx={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <PhoneIcon sx={{ color: newEmployee.phone_number ? ACCENT_COLOR : 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Role"
              select
              fullWidth
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              variant="outlined"
              sx={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <WorkIcon sx={{ color: ACCENT_COLOR }} />
                  </InputAdornment>
                ),
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: { 
                      bgcolor: '#1e1e1e',
                      backgroundImage: 'linear-gradient(145deg, #222222 0%, #1a1a1a 100%)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                    }
                  }
                }
              }}
            >
              <MenuItem value="ADMIN" sx={styles.menuItem}>Admin</MenuItem>
              <MenuItem value="OWNER" sx={styles.menuItem}>Owner</MenuItem>
              <MenuItem value="BAR_MANAGER" sx={styles.menuItem}>Bar Manager</MenuItem>
              <MenuItem value="HEAD_CHEF" sx={styles.menuItem}>Head Chef</MenuItem>
              <MenuItem value="BARTENDER" sx={styles.menuItem}>Bartender</MenuItem>
              <MenuItem value="SERVER" sx={styles.menuItem}>Server</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hire Date"
              type="date"
              fullWidth
              value={newEmployee.hire_date}
              onChange={(e) => setNewEmployee({ ...newEmployee, hire_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <CalendarTodayIcon sx={{ color: ACCENT_COLOR }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <Divider sx={styles.divider} />
      
      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          color="inherit"
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{ 
            color: '#ffffff', 
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleAddEmployee}
          disabled={loading || Boolean(phoneError)}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
          sx={styles.primaryButton}
        >
          {loading ? 'Adding...' : 'Add Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;