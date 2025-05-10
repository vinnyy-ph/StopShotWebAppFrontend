import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Typography,
  Box,
  Divider,
  InputAdornment,
  useTheme,
  alpha,
  Zoom,
  Fade,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NoteIcon from '@mui/icons-material/Note';
import { format, isBefore, startOfDay } from 'date-fns';
import { SelectChangeEvent } from '@mui/material';

// Orange accent color
const ACCENT_COLOR = '#d38236';

interface AddReservationDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (reservation: any) => Promise<boolean>; // Assuming onAdd returns a promise indicating success
}

const AddReservationDialog: React.FC<AddReservationDialogProps> = ({
  open,
  onClose,
  onAdd
}) => {
  const theme = useTheme();
  
  const now = new Date();
  const defaultTime = new Date();
  defaultTime.setHours(16, 0, 0, 0); 
  
  const initialReservationState = {
    guest_name: '',
    guest_email: '',
    reservation_date: now,
    reservation_time: defaultTime,
    duration: '01:00:00',
    number_of_guests: 1,
    room_type: 'TABLE',
    special_requests: ''
  };

  const [newReservation, setNewReservation] = useState(initialReservationState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    if (open) {
      const currentDate = new Date();
      const defaultReservationTime = new Date();
      defaultReservationTime.setHours(16, 0, 0, 0);
      setNewReservation({
        guest_name: '',
        guest_email: '',
        reservation_date: currentDate,
        reservation_time: defaultReservationTime,
        duration: '01:00:00',
        number_of_guests: 1,
        room_type: 'TABLE',
        special_requests: ''
      });
      setErrors({});
      setGlobalError('');
      setLoading(false);
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newReservation.guest_name.trim()) {
      newErrors.guest_name = 'Name is required';
    }
    
    if (!newReservation.guest_email.trim()) {
      newErrors.guest_email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(newReservation.guest_email)) {
      newErrors.guest_email = 'Invalid email format';
    }
    
    if (isBefore(newReservation.reservation_date, startOfDay(new Date()))) {
      newErrors.reservation_date = 'Date cannot be in the past';
    }
    
    const hours = newReservation.reservation_time.getHours();
    const minutes = newReservation.reservation_time.getMinutes();
    // Allow 1:00 AM by checking if hours is 1 (which is 1 AM)
    // Time must be 4:00 PM (16:00) or later, OR before 1:01 AM (i.e., 1:00 AM is allowed)
    const isValidTime = (hours >= 16) || (hours < 1 || (hours === 1 && minutes === 0));


    if (!isValidTime) {
      newErrors.reservation_time = 'Time must be between 4:00 PM and 1:00 AM';
    }
    
    if (newReservation.number_of_guests < 1) {
      newErrors.number_of_guests = 'Must have at least 1 guest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddReservation = async () => {
    setGlobalError('');
    if (validateForm()) {
      setLoading(true);
      const formattedDate = format(newReservation.reservation_date, 'yyyy-MM-dd');
      const formattedTime = format(newReservation.reservation_time, 'HH:mm:ss');
      
      const reservationData = {
        ...newReservation,
        reservation_date: formattedDate,
        reservation_time: formattedTime,
      };
      
      try {
        const success = await onAdd(reservationData);
        if (success) {
          onClose();
        } else {
          setGlobalError('Failed to create reservation. Please check details or try again later.');
        }
      } catch (err) {
        console.error("Error adding reservation:", err);
        setGlobalError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const target = e.target as HTMLInputElement; // Type assertion
    const { name, value } = target;
  
    setNewReservation(prev => ({ ...prev, [name!]: value }));
    
    if (errors[name!]) {
      setErrors(prev => ({ ...prev, [name!]: '' }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setNewReservation(prev => ({ ...prev, reservation_date: date }));
      if (errors.reservation_date) {
        setErrors(prev => ({ ...prev, reservation_date: '' }));
      }
    }
  };

  const handleTimeChange = (time: Date | null) => {
    if (time) {
      setNewReservation(prev => ({ ...prev, reservation_time: time }));
      if (errors.reservation_time) {
        setErrors(prev => ({ ...prev, reservation_time: '' }));
      }
    }
  };
  
  const styles = {
    paper: {
      backgroundColor: '#1a1a1a',
      backgroundImage: `linear-gradient(145deg, #1e1e1e 0%, #121212 100%)`,
      color: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden', // Important for maintaining border radius with title
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    },
    dialogTitle: { // Renamed from title to avoid conflict
      borderLeft: `4px solid ${ACCENT_COLOR}`,
      paddingLeft: '16px',
      margin: '12px 0', // Matches other dialogs
    },
    input: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        transition: 'all 0.2s',
        color: '#ffffff', // Text color for input
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
        // Style for date/time picker text color
        '& input': {
          color: '#ffffff !important', // Added !important to ensure this rule is applied
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-focused': {
          color: ACCENT_COLOR,
        },
      },
      '& .MuiInputBase-input': { // General input base color
        color: '#ffffff',
      },
      '& .MuiSelect-icon': {
        color: 'rgba(255, 255, 255, 0.5)',
      },
      '& .MuiFormHelperText-root': { // Style helper text
        color: 'rgba(255, 255, 255, 0.5)',
        '&.Mui-error': {
            color: theme.palette.error.light, // Lighter error color for dark bg
        }
      },
    },
    divider: {
      borderColor: 'rgba(255, 255, 255, 0.07)',
      my: 2.5 // Increased margin for better separation
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
        background: `linear-gradient(45deg, ${alpha(ACCENT_COLOR, 0.9)} 30%, ${alpha(ACCENT_COLOR, 0.7)} 90%)`, // Darken on hover
      },
    },
    menuItem: {
      color: '#ffffff',
      backgroundColor: '#1e1e1e', // Ensure dropdown items have dark background
      '&:hover': {
        backgroundColor: alpha(ACCENT_COLOR, 0.1)
      },
      '&.Mui-selected': {
        backgroundColor: alpha(ACCENT_COLOR, 0.2),
        '&:hover': {
          backgroundColor: alpha(ACCENT_COLOR, 0.3)
        }
      }
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: ACCENT_COLOR,
      fontWeight: 'bold',
      mb: 2,
      fontSize: '1.1rem' // Slightly larger section header
    },
    inputAdornmentIcon: {
        color: 'rgba(255, 255, 255, 0.5)' // Default color for icons in inputs
    },
    focusedInputAdornmentIcon: { // Icon color when input is focused or has value
        color: ACCENT_COLOR
    },
    // Add this new style for date/time displays
    dateTimeDisplay: {
      color: '#ffffff',
      opacity: 0.9,
      fontWeight: 500,
    },
  };
  
  const getInputIconColor = (hasValue: boolean) => {
    return hasValue ? styles.focusedInputAdornmentIcon.color : styles.inputAdornmentIcon.color;
  }

  // Create a separate handler for select changes  
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setNewReservation(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="md"
      fullWidth
      TransitionComponent={Zoom}
      transitionDuration={300}
      PaperProps={{
        elevation: 8,
        sx: styles.paper
      }}
    >
      <DialogTitle sx={{ pt: 2.5, pb: 1.5, color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={styles.dialogTitle}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 1 }}>
            <MeetingRoomIcon sx={{ color: ACCENT_COLOR }} /> Create New Reservation
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mt: 0.5 }}>
            Book a table or karaoke room
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
      
      <DialogContent sx={{ pt: 1, pb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {globalError && (
            <Fade in={Boolean(globalError)}>
              <Box sx={{ 
                p: 1.5, 
                mb: 2, 
                bgcolor: alpha(theme.palette.error.main, 0.15),
                borderRadius: '8px',
                borderLeft: `4px solid ${theme.palette.error.main}`
              }}>
                <Typography color="error">{globalError}</Typography>
              </Box>
            </Fade>
          )}

          <Box mb={3}>
            <Typography sx={styles.sectionHeader}>
              <PersonOutlineIcon /> Guest Information
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Guest Name"
                  name="guest_name"
                  fullWidth
                  value={newReservation.guest_name}
                  onChange={handleInputChange}
                  error={!!errors.guest_name}
                  helperText={errors.guest_name}
                  required
                  variant="outlined"
                  sx={styles.input}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon sx={{ color: getInputIconColor(!!newReservation.guest_name) }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Guest Email"
                  name="guest_email"
                  type="email"
                  fullWidth
                  value={newReservation.guest_email}
                  onChange={handleInputChange}
                  error={!!errors.guest_email}
                  helperText={errors.guest_email}
                  required
                  variant="outlined"
                  sx={styles.input}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: getInputIconColor(!!newReservation.guest_email) }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={styles.divider} />
          
          <Box mb={3}>
            <Typography sx={styles.sectionHeader}>
              <EventIcon /> Reservation Details
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Reservation Date"
                  value={newReservation.reservation_date}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.reservation_date,
                      helperText: errors.reservation_date,
                      sx: {
                        ...styles.input,
                        '& .MuiSvgIcon-root': {
                          color: 'rgba(255, 255, 255, 0.7)', // Make calendar icon white
                        },
                        '&:focus-within .MuiSvgIcon-root': {
                          color: ACCENT_COLOR, // Orange icon when focused
                        }
                      },
                      InputProps: {
                        style: { color: '#ffffff' }, // Force white text color
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon sx={{ color: ACCENT_COLOR }} />
                          </InputAdornment>
                        ),
                      },
                    },
                    desktopPaper: { 
                      sx: { 
                        backgroundColor: '#1e1e1e', 
                        color: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                        '& .MuiPickersDay-root': {
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: alpha(ACCENT_COLOR, 0.2)
                          },
                          '&.Mui-selected': { 
                            backgroundColor: ACCENT_COLOR,
                            color: '#ffffff',
                            fontWeight: 'bold',
                            '&:hover': {
                              backgroundColor: alpha(ACCENT_COLOR, 0.8)
                            }
                          }
                        },
                        '& .MuiDayCalendar-weekDayLabel': {
                          color: 'rgba(255, 255, 255, 0.7)'
                        },
                        '& .MuiPickersDay-today': {
                          border: `1px solid ${ACCENT_COLOR}`,
                        },
                        '& .MuiPickersCalendarHeader-label': {
                          color: '#ffffff'
                        },
                        '& .MuiPickersCalendarHeader-switchViewButton, & .MuiPickersArrowSwitcher-button': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            backgroundColor: alpha(ACCENT_COLOR, 0.15)
                          }
                        },
                        '& .MuiPickersYear-yearButton': {
                          color: '#ffffff',
                          '&.Mui-selected': {
                            backgroundColor: ACCENT_COLOR
                          },
                          '&:hover': {
                            backgroundColor: alpha(ACCENT_COLOR, 0.2)
                          }
                        },
                        '& .MuiPickersMonth-monthButton': {
                          color: '#ffffff',
                          '&.Mui-selected': {
                            backgroundColor: ACCENT_COLOR
                          },
                          '&:hover': {
                            backgroundColor: alpha(ACCENT_COLOR, 0.2)
                          }
                        }
                      } 
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TimePicker
                  label="Reservation Time"
                  value={newReservation.reservation_time}
                  onChange={handleTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.reservation_time,
                      helperText: errors.reservation_time || (
                        <Typography variant="body2" sx={styles.dateTimeDisplay}>
                          4:00 PM - 1:00 AM
                        </Typography>
                      ),
                      sx: {
                        ...styles.input,
                        '& .MuiSvgIcon-root': {
                          color: 'rgba(255, 255, 255, 0.7)', // Make clock icon white
                        },
                        '&:focus-within .MuiSvgIcon-root': {
                          color: ACCENT_COLOR, // Orange icon when focused
                        }
                      },
                      InputProps: {
                        style: { color: '#ffffff' }, // Force white text color
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTimeIcon sx={{ color: ACCENT_COLOR }} />
                          </InputAdornment>
                        ),
                      },
                    },
                    desktopPaper: { 
                      sx: { 
                        backgroundColor: '#1e1e1e', 
                        color: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                        '& .MuiClock-pin': {
                          backgroundColor: ACCENT_COLOR
                        },
                        '& .MuiClockPointer-root': {
                          backgroundColor: ACCENT_COLOR
                        },
                        '& .MuiClockPointer-thumb': {
                          border: `16px solid ${ACCENT_COLOR}`,
                        },
                        '& .MuiButtonBase-root.Mui-selected': { 
                          backgroundColor: ACCENT_COLOR,
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: alpha(ACCENT_COLOR, 0.8)
                          }
                        },
                        '& .MuiClock-amButton, & .MuiClock-pmButton': {
                          color: '#ffffff',
                          '&.Mui-selected': {
                            backgroundColor: ACCENT_COLOR,
                            color: '#ffffff'
                          }
                        },
                        '& .MuiClockNumber-root': {
                          color: '#ffffff',
                          '&.Mui-selected': {
                            backgroundColor: ACCENT_COLOR
                          }
                        }
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={styles.input}>
                  <InputLabel id="duration-label" sx={{color: 'rgba(255, 255, 255, 0.7)', '&.Mui-focused': {color: ACCENT_COLOR} }}>Duration</InputLabel>
                  <Select
                    labelId="duration-label"
                    name="duration"
                    value={newReservation.duration}
                    label="Duration"
                    onChange={handleSelectChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <HourglassBottomIcon sx={{ color: ACCENT_COLOR }} />
                      </InputAdornment>
                    }
                    MenuProps={{ PaperProps: { sx: { bgcolor: '#1e1e1e', backgroundImage: 'linear-gradient(145deg, #222222 0%, #1a1a1a 100%)' } } }}
                  >
                    {['01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00'].map(d => (
                        <MenuItem key={d} value={d} sx={styles.menuItem}>{d.substring(0,2)}h {d.substring(3,5) !== "00" ? `${d.substring(3,5)}m` : ''}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Number of Guests"
                  name="number_of_guests"
                  type="number"
                  fullWidth
                  value={newReservation.number_of_guests}
                  onChange={handleInputChange}
                  error={!!errors.number_of_guests}
                  helperText={errors.number_of_guests}
                  InputProps={{
                    inputProps: { min: 1 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupsIcon sx={{ color: getInputIconColor(newReservation.number_of_guests > 0) }} />
                      </InputAdornment>
                    ),
                  }}
                  required
                  sx={styles.input}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                 <FormControl fullWidth sx={styles.input}>
                  <InputLabel id="room-type-label" sx={{color: 'rgba(255, 255, 255, 0.7)', '&.Mui-focused': {color: ACCENT_COLOR} }}>Reservation Type</InputLabel>
                  <Select
                    labelId="room-type-label"
                    name="room_type"
                    value={newReservation.room_type}
                    label="Reservation Type"
                    onChange={handleSelectChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <MeetingRoomIcon sx={{ color: ACCENT_COLOR }} />
                      </InputAdornment>
                    }
                    MenuProps={{ PaperProps: { sx: { bgcolor: '#1e1e1e', backgroundImage: 'linear-gradient(145deg, #222222 0%, #1a1a1a 100%)' } } }}
                  >
                    <MenuItem value="TABLE" sx={styles.menuItem}>Table</MenuItem>
                    <MenuItem value="KARAOKE_ROOM" sx={styles.menuItem}>Karaoke Room</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={styles.divider} />
          
          <Box>
            <Typography sx={styles.sectionHeader}>
              <NoteIcon /> Additional Information
            </Typography>
            <TextField
              label="Special Requests"
              name="special_requests"
              fullWidth
              multiline
              rows={3}
              value={newReservation.special_requests}
              onChange={handleInputChange}
              placeholder="e.g., dietary restrictions, birthday celebration"
              sx={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}> {/* Align icon to top */}
                    <NoteIcon sx={{ color: getInputIconColor(!!newReservation.special_requests) }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </LocalizationProvider>
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
          onClick={handleAddReservation}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EventIcon />}
          sx={styles.primaryButton}
        >
          {loading ? 'Creating...' : 'Create Reservation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReservationDialog;