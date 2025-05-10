import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  CircularProgress,
  SelectChangeEvent,
  Alert,
  useTheme,
  alpha,
  Divider,
  InputAdornment,
  Paper,
  Zoom // Added for transition
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NoteIcon from '@mui/icons-material/Note';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChairIcon from '@mui/icons-material/Chair';
import InfoIcon from '@mui/icons-material/Info'; // Import InfoIcon
import SaveIcon from '@mui/icons-material/Save'; // For save button
import { format, isBefore, startOfDay } from 'date-fns';
import { Reservation } from '../dashboard';

const ACCENT_COLOR = '#d38236';

// Update to match backend model
interface Room {
  id: number;
  room_name: string;
  room_description?: string;
  room_can_be_booked: boolean;
  max_number_of_people: number;
  room_type: string;
}

interface ReservationFormDialogProps {
  open: boolean;
  reservation?: Reservation | null;
  onClose: () => void;
  onSave: (reservationData: any) => Promise<boolean>;
  rooms: Room[];
  isLoading?: boolean;
  mode: 'add' | 'edit';
}

const ReservationFormDialog: React.FC<ReservationFormDialogProps> = ({
  open,
  reservation,
  onClose,
  onSave,
  rooms,
  isLoading = false,
  mode
}) => {
  const theme = useTheme();
  
  const isConfirmationFlow = reservation?.status !== 'CONFIRMED' && mode === 'edit';
  const isInFinalState = reservation?.status === 'CONFIRMED' || reservation?.status === 'CANCELLED';
  
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    reservation_date: new Date(),
    reservation_time: new Date(),
    duration: '01:00:00',
    number_of_guests: 1,
    special_requests: '',
    status: 'PENDING',
    room_id: '',
    room_type: 'TABLE'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const normalizeRoomType = (roomType: string): string => {
    if (roomType === "Table" || roomType === "TABLE") return "TABLE";
    if (roomType === "Karaoke Room" || roomType === "KARAOKE_ROOM") return "KARAOKE_ROOM";
    return roomType;
  };

  const displayRoomType = (roomType: string): string => {
    if (roomType === "TABLE") return "Table";
    if (roomType === "KARAOKE_ROOM") return "Karaoke Room";
    return roomType;
  };

  useEffect(() => {
    if (reservation && mode === 'edit') {
      const timeString = reservation.reservation_time;
      let timeDate;
      try {
        if (timeString.includes(':')) {
          const [hours, minutes] = timeString.split(':').map(Number);
          timeDate = new Date();
          timeDate.setHours(hours); timeDate.setMinutes(minutes); timeDate.setSeconds(0);
        } else {
          timeDate = new Date(`1970-01-01T${timeString}`);
        }
      } catch (e) { timeDate = new Date(); }

      const normalizedRoomType = normalizeRoomType(reservation.room_type || 'TABLE');
      setFormData({
        guest_name: reservation.guest_name || '',
        guest_email: reservation.guest_email || '',
        reservation_date: new Date(reservation.reservation_date),
        reservation_time: timeDate,
        duration: reservation.duration || '01:00:00',
        number_of_guests: reservation.number_of_guests || 1,
        special_requests: reservation.special_requests || '',
        status: reservation.status || 'PENDING',
        room_id: reservation.room?.id?.toString() || '',
        room_type: normalizedRoomType
      });
    } else {
      const now = new Date();
      const startTime = new Date();
      startTime.setHours(16, 0, 0, 0);
      setFormData({
        guest_name: '', guest_email: '', reservation_date: now, reservation_time: startTime,
        duration: '01:00:00', number_of_guests: 1, special_requests: '',
        status: 'PENDING', room_id: '', room_type: 'TABLE'
      });
    }
  }, [reservation, open, mode]);

  const isReadOnly = mode === 'edit' && isInFinalState;

  const getDialogTitleText = () => {
    if (isReadOnly) return 'View Reservation';
    if (isConfirmationFlow) return 'Assign Room & Confirm';
    return mode === 'add' ? 'Create New Reservation' : 'Edit Reservation';
  }
  
  const getSaveButtonText = () => {
    if (isReadOnly) return 'Close';
    if (isConfirmationFlow) return 'Assign & Confirm';
    return mode === 'add' ? 'Create Reservation' : 'Save Changes';
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.guest_name.trim()) newErrors.guest_name = 'Name is required';
    if (!formData.guest_email.trim()) newErrors.guest_email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.guest_email)) newErrors.guest_email = 'Invalid email format';
    if (mode === 'add' && isBefore(formData.reservation_date, startOfDay(new Date()))) newErrors.reservation_date = 'Date cannot be in the past';
    if (formData.number_of_guests < 1) newErrors.number_of_guests = 'Must have at least 1 guest';
    if (formData.status === 'CONFIRMED' && !formData.room_id) {
      newErrors.room_id = 'Room must be assigned for confirmation';
      newErrors.status = 'Cannot confirm without assigning a room';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    if (isReadOnly) return;
    const name = e.target.name as string;
    const value = e.target.value;
    if (name === 'status' && value === 'CONFIRMED' && !formData.room_id) {
      setErrors(prev => ({ 
        ...prev, status: 'Cannot confirm without assigning a room',
        room_id: 'Room assignment required for confirmation'
      }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleSubmit = async () => {
    if (isReadOnly) { onClose(); return; }
    if (validateForm()) {
      const formattedDate = format(formData.reservation_date, 'yyyy-MM-dd');
      const formattedTime = format(formData.reservation_time, 'HH:mm:ss');
      const reservationData = {
        ...formData,
        reservation_date: formattedDate,
        reservation_time: formattedTime,
        room_id: formData.room_id || null,
        room_type: reservation?.room_type || formData.room_type, // Keep original if editing
        id: mode === 'edit' && reservation ? reservation.id : undefined
      };
      const success = await onSave(reservationData);
      if (success) onClose();
    }
  };

  const getAvailableRooms = () => {
    const normalizedRoomType = normalizeRoomType(formData.room_type);
    return rooms.filter(room => room.room_type === normalizedRoomType);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED': return { text: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.15), border: theme.palette.success.dark };
      case 'PENDING': return { text: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, 0.15), border: theme.palette.warning.dark };
      case 'CANCELLED': return { text: theme.palette.error.main, bg: alpha(theme.palette.error.main, 0.15), border: theme.palette.error.dark };
      default: return { text: theme.palette.grey[500], bg: alpha(theme.palette.grey[500], 0.15), border: theme.palette.grey[700] };
    }
  };

  const styles = {
    paper: {
      backgroundColor: '#1a1a1a',
      backgroundImage: `linear-gradient(145deg, #1e1e1e 0%, #121212 100%)`,
      color: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    },
    dialogTitleBox: {
      borderLeft: `4px solid ${ACCENT_COLOR}`,
      paddingLeft: '16px',
      margin: '12px 0',
    },
    input: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        color: '#ffffff',
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
        '&:hover fieldset': { borderColor: alpha(ACCENT_COLOR, 0.5) },
        '&.Mui-focused fieldset': { borderColor: ACCENT_COLOR },
        '& input': { color: '#ffffff' },
        '&.Mui-disabled': {
          backgroundColor: alpha('#fff', 0.05),
          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1) !important' },
        },
        '&.Mui-disabled .MuiInputBase-input': {
          color: alpha('#fff', 0.5),
          WebkitTextFillColor: alpha('#fff', 0.5), 
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-focused': { color: ACCENT_COLOR },
        '&.Mui-disabled': { color: alpha('#fff', 0.4) },
      },
      '& .MuiSelect-icon': { color: 'rgba(255, 255, 255, 0.5)' },
      '& .MuiFormHelperText-root': {
        color: 'rgba(255, 255, 255, 0.5)',
        '&.Mui-error': { color: theme.palette.error.light },
      },
    },
    divider: { borderColor: 'rgba(255, 255, 255, 0.07)', my: 2.5 },
    primaryButton: {
      background: `linear-gradient(45deg, ${ACCENT_COLOR} 30%, ${alpha(ACCENT_COLOR, 0.8)} 90%)`,
      color: 'white', fontWeight: 600, padding: '8px 24px', borderRadius: '8px',
      boxShadow: `0 4px 12px ${alpha(ACCENT_COLOR, 0.3)}`,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: `0 6px 16px ${alpha(ACCENT_COLOR, 0.5)}`,
        transform: 'translateY(-1px)',
        background: `linear-gradient(45deg, ${alpha(ACCENT_COLOR, 0.9)} 30%, ${alpha(ACCENT_COLOR, 0.7)} 90%)`,
      },
      '&.Mui-disabled': {
        background: alpha(ACCENT_COLOR, 0.3),
        boxShadow: 'none',
        color: alpha('#fff', 0.5)
      }
    },
    secondaryButton: {
      color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '8px', padding: '8px 24px',
      '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
    },
    menuItem: {
      color: '#ffffff',
      backgroundColor: '#1e1e1e',
      '&:hover': { backgroundColor: alpha(ACCENT_COLOR, 0.1) },
      '&.Mui-selected': {
        backgroundColor: alpha(ACCENT_COLOR, 0.2),
        '&:hover': { backgroundColor: alpha(ACCENT_COLOR, 0.3) }
      }
    },
    sectionPaper: {
      p: 2.5, mb: 3, borderRadius: '10px',
      background: alpha('#000', 0.2),
      border: `1px solid ${alpha('#fff', 0.08)}`,
    },
    sectionHeader: {
      display: 'flex', alignItems: 'center', gap: 1,
      color: ACCENT_COLOR, fontWeight: '600', mb: 2.5, fontSize: '1.1rem'
    },
    inputAdornmentIcon: (hasValue?: boolean) => ({
      color: hasValue || formData.status === 'CONFIRMED' ? ACCENT_COLOR : 'rgba(255, 255, 255, 0.5)'
    }),
    alert: (severity: 'info' | 'warning') => ({
      mb: 2, borderRadius: '8px',
      bgcolor: alpha(theme.palette[severity].main, 0.15),
      color: theme.palette[severity].light,
      borderLeft: `4px solid ${theme.palette[severity].main}`,
      '& .MuiAlert-icon': { color: theme.palette[severity].main }
    }),
    dateTimePickerPaper: {
      backgroundColor: '#1e1e1e', 
      color: '#fff',
      backgroundImage: 'linear-gradient(145deg, #222222 0%, #1a1a1a 100%)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
      '& .MuiPickersDay-root': {
        color: '#ffffff', // Make all day numbers white
        '&:hover': {
          backgroundColor: alpha(ACCENT_COLOR, 0.2)
        }
      },
      '& .MuiPickersDay-root.Mui-selected': { 
        backgroundColor: ACCENT_COLOR, // Use orange for selected date
        color: '#ffffff',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: alpha(ACCENT_COLOR, 0.8)
        }
      },
      '& .MuiDayCalendar-weekDayLabel': {
        color: 'rgba(255, 255, 255, 0.7)' // Make weekday labels visible
      },
      '& .MuiPickersDay-today': {
        border: `1px solid ${ACCENT_COLOR}`, // Orange border for today's date
        color: '#ffffff'
      },
      '& .MuiPickersCalendarHeader-label': {
        color: '#ffffff' // Make month/year text white
      },
      '& .MuiPickersCalendarHeader-switchViewButton, & .MuiPickersArrowSwitcher-button': {
        color: 'rgba(255, 255, 255, 0.7)', // Make navigation buttons visible
        '&:hover': {
          backgroundColor: alpha(ACCENT_COLOR, 0.15)
        }
      },
      '& .MuiPickersYear-yearButton': {
        color: '#ffffff', // Year view text
        '&.Mui-selected': {
          backgroundColor: ACCENT_COLOR // Selected year
        },
        '&:hover': {
          backgroundColor: alpha(ACCENT_COLOR, 0.2)
        }
      },
      '& .MuiPickersMonth-monthButton': {
        color: '#ffffff', // Month view text
        '&.Mui-selected': {
          backgroundColor: ACCENT_COLOR // Selected month
        },
        '&:hover': {
          backgroundColor: alpha(ACCENT_COLOR, 0.2)
        }
      },
      '& .MuiButtonBase-root': {
        color: '#ffffff', // Ensure all clickable elements have white text
      },
      '& .MuiClock-pin': {
        backgroundColor: ACCENT_COLOR // Time picker pin
      },
      '& .MuiClockPointer-root': {
        backgroundColor: ACCENT_COLOR // Clock hand
      },
      '& .MuiClockPointer-thumb': {
        border: `16px solid ${ACCENT_COLOR}`, // Clock hand circle
      }
    },
    selectMenuPaper: {
      bgcolor: '#1e1e1e',
      backgroundImage: 'linear-gradient(145deg, #222222 0%, #1a1a1a 100%)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
    }
  };
  
  const getDialogIcon = () => {
    if (isReadOnly) return <MeetingRoomIcon sx={{ color: ACCENT_COLOR, fontSize: 28 }} />;
    if (isConfirmationFlow) return <CheckCircleOutlineIcon sx={{ color: ACCENT_COLOR, fontSize: 28 }} />;
    return <MeetingRoomIcon sx={{ color: ACCENT_COLOR, fontSize: 28 }} />;
  };

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Zoom}
      transitionDuration={300}
      PaperProps={{ sx: styles.paper }}
    >
      <DialogTitle sx={{ pt: 2.5, pb: 1.5, color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={styles.dialogTitleBox}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {getDialogIcon()} {getDialogTitleText()}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          disabled={isLoading}
          sx={{ color: alpha('#fff', 0.7), '&:hover': { color: '#fff', bgcolor: alpha('#fff', 0.1) } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.07)' }} />

      <DialogContent 
        sx={{ 
          pt: 1, pb: 0, // Adjusted padding
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(ACCENT_COLOR, 0.4), borderRadius: '4px' },
          '&::-webkit-scrollbar-track': { backgroundColor: alpha('#000', 0.2) }
        }}
      >
        <Box sx={{ px: 1, py: 2 }}> {/* Inner padding for content */}
          {(isReadOnly || isConfirmationFlow) && (
            <Box sx={{ px:1.5, pt: 1 }}>
              {isReadOnly && (
                <Alert severity="info" icon={<InfoIcon />} sx={styles.alert('info')}>
                  This reservation is <strong>{reservation?.status.toLowerCase()}</strong> and cannot be edited.
                </Alert>
              )}
              {isConfirmationFlow && (
                <Alert severity="warning" sx={styles.alert('warning')}>
                  This reservation requires room assignment to be confirmed.
                </Alert>
              )}
            </Box>
          )}
        
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form>
              <Paper elevation={0} sx={styles.sectionPaper}>
                <Typography sx={styles.sectionHeader}>
                  <PersonOutlineIcon /> Guest Information
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Guest Name" name="guest_name" value={formData.guest_name}
                      onChange={handleInputChange} error={!!errors.guest_name} helperText={errors.guest_name || (mode === 'edit' ? 'Guest name cannot be changed' : '')}
                      required variant="outlined" InputProps={{ readOnly: mode === 'edit', startAdornment: (
                          <InputAdornment position="start"><PersonOutlineIcon sx={styles.inputAdornmentIcon(!!formData.guest_name)} /></InputAdornment>)}}
                      disabled={mode === 'edit'} sx={styles.input} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Email" name="guest_email" type="email" value={formData.guest_email}
                      onChange={handleInputChange} error={!!errors.guest_email} helperText={errors.guest_email || (mode === 'edit' ? 'Email cannot be changed' : '')}
                      required variant="outlined" InputProps={{ readOnly: mode === 'edit', startAdornment: (
                          <InputAdornment position="start"><EmailIcon sx={styles.inputAdornmentIcon(!!formData.guest_email)} /></InputAdornment>)}}
                      disabled={mode === 'edit'} sx={styles.input} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Number of Guests" name="number_of_guests" type="number" value={formData.number_of_guests}
                      onChange={handleInputChange} error={!!errors.number_of_guests} helperText={errors.number_of_guests || 'How many guests?'}
                      inputProps={{ min: 1 }} required variant="outlined" InputProps={{ readOnly: isReadOnly, startAdornment: (
                          <InputAdornment position="start"><GroupsIcon sx={styles.inputAdornmentIcon(formData.number_of_guests > 0)} /></InputAdornment>)}}
                      disabled={isReadOnly} sx={styles.input} />
                  </Grid>
                </Grid>
              </Paper>
              
              <Paper elevation={0} sx={styles.sectionPaper}>
                <Typography sx={styles.sectionHeader}>
                  <EventIcon /> Reservation Details
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker 
                      label="Reservation Date" 
                      value={formData.reservation_date}
                      onChange={(date) => { if (isReadOnly || !date) return; setFormData(prev => ({ ...prev, reservation_date: date })); if (errors.reservation_date) setErrors(prev => ({ ...prev, reservation_date: '' })); }}
                      minDate={mode === 'add' ? new Date() : undefined} 
                      disabled={isReadOnly}
                      slotProps={{ 
                        textField: { 
                          fullWidth: true, 
                          required: true, 
                          variant: "outlined", 
                          error: !!errors.reservation_date, 
                          helperText: errors.reservation_date || 'Select date',
                          InputProps: { 
                            readOnly: isReadOnly, 
                            style: { color: '#ffffff' }, // Add this to force white text
                            startAdornment: (<InputAdornment position="start"><EventIcon sx={styles.inputAdornmentIcon()} /></InputAdornment>),
                            // Add this sx prop to target the end adorment icon (calendar icon)
                            sx: {
                              '& .MuiSvgIcon-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                              },
                              '&:hover .MuiSvgIcon-root': {
                                color: ACCENT_COLOR,
                              }
                            }
                          },
                          sx: {
                            ...styles.input,
                            '& input': { color: '#ffffff !important' }, // Force white text with !important
                            '& .MuiInputBase-input': { color: '#ffffff !important' },
                            // This targets all SVG icons in the input (including the right-side picker icon)
                            '& .MuiSvgIcon-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: ACCENT_COLOR,
                              }
                            },
                            // Change color on focus
                            '&:focus-within .MuiSvgIcon-root': {
                              color: ACCENT_COLOR,
                            }
                          }
                        },
                        desktopPaper: { sx: styles.dateTimePickerPaper }
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TimePicker 
                      label="Reservation Time" 
                      value={formData.reservation_time}
                      onChange={(time) => { if (isReadOnly || !time) return; setFormData(prev => ({ ...prev, reservation_time: time })); if (errors.reservation_time) setErrors(prev => ({ ...prev, reservation_time: '' })); }}
                      ampm={true} 
                      views={['hours', 'minutes']} 
                      minutesStep={15} 
                      disabled={isReadOnly}
                      slotProps={{ 
                        textField: { 
                          fullWidth: true, 
                          required: true, 
                          variant: "outlined", 
                          error: !!errors.reservation_time, 
                          helperText: errors.reservation_time || "Select time",
                          InputProps: { 
                            readOnly: isReadOnly, 
                            style: { color: '#ffffff' }, // Add this to force white text
                            startAdornment: (<InputAdornment position="start"><AccessTimeIcon sx={styles.inputAdornmentIcon()} /></InputAdornment>),
                            // Add this sx prop to target the end adorment icon (clock icon)
                            sx: {
                              '& .MuiSvgIcon-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                              },
                              '&:hover .MuiSvgIcon-root': {
                                color: ACCENT_COLOR,
                              }
                            }
                          },
                          sx: {
                            ...styles.input,
                            '& input': { color: '#ffffff !important' }, // Force white text with !important
                            '& .MuiInputBase-input': { color: '#ffffff !important' },
                            // This targets all SVG icons in the input
                            '& .MuiSvgIcon-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: ACCENT_COLOR,
                              }
                            },
                            // Change color on focus
                            '&:focus-within .MuiSvgIcon-root': {
                              color: ACCENT_COLOR,
                            }
                          }
                        },
                        desktopPaper: { sx: styles.dateTimePickerPaper }
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required disabled={isReadOnly} sx={styles.input}>
                      <InputLabel>Duration</InputLabel>
                      <Select name="duration" value={formData.duration} onChange={handleSelectChange} label="Duration" readOnly={isReadOnly}
                        startAdornment={<InputAdornment position="start"><HourglassBottomIcon sx={{ ...styles.inputAdornmentIcon(), mr:1 }} /></InputAdornment>}
                        MenuProps={{ PaperProps: { sx: styles.selectMenuPaper } }} >
                        {['01:00:00', '01:30:00', '02:00:00', '03:00:00'].map(d => (
                            <MenuItem key={d} value={d} sx={styles.menuItem}>{d.substring(0,2)}h {d.substring(3,5) !== "00" ? `${d.substring(3,5)}m` : ''}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Length of reservation</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Room Type" value={displayRoomType(formData.room_type)} variant="outlined"
                      InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><ChairIcon sx={styles.inputAdornmentIcon()} /></InputAdornment>)}}
                      disabled helperText="Room type cannot be changed" sx={styles.input} />
                  </Grid>
                </Grid>
              </Paper>
              
              <Paper elevation={0} sx={{...styles.sectionPaper, borderStyle: isConfirmationFlow ? 'dashed' : 'solid', borderColor: isConfirmationFlow ? ACCENT_COLOR : alpha('#fff', 0.08) }}>
                <Typography sx={styles.sectionHeader}>
                  <MeetingRoomIcon /> Room Assignment & Status
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required={isConfirmationFlow || formData.status === 'CONFIRMED'} error={!!errors.room_id} disabled={isReadOnly} sx={styles.input}>
                      <InputLabel>Room Assignment</InputLabel>
                      <Select name="room_id" value={formData.room_id} onChange={handleSelectChange} label="Room Assignment" readOnly={isReadOnly}
                        startAdornment={<InputAdornment position="start"><MeetingRoomIcon sx={{ ...styles.inputAdornmentIcon(!!formData.room_id), mr:1 }} /></InputAdornment>}
                        MenuProps={{ PaperProps: { sx: styles.selectMenuPaper } }} >
                        <MenuItem value="" sx={styles.menuItem}><em>Unassigned</em></MenuItem>
                        {getAvailableRooms().map((room) => (
                          <MenuItem key={room.id} value={room.id.toString()} sx={styles.menuItem}>{room.room_name}</MenuItem>
                        ))}
                      </Select>
                      {errors.room_id && <FormHelperText error>{errors.room_id}</FormHelperText>}
                      {!errors.room_id && formData.status === 'CONFIRMED' && <FormHelperText>Required for confirmed reservations</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!errors.status} disabled={isReadOnly} sx={styles.input}>
                      <InputLabel>Status</InputLabel>
                      <Select name="status" value={formData.status} onChange={handleSelectChange} label="Status" readOnly={isReadOnly}
                        startAdornment={<InputAdornment position="start"><CheckCircleOutlineIcon sx={{ ...styles.inputAdornmentIcon(true), mr:1 }} /></InputAdornment>}
                        MenuProps={{ PaperProps: { sx: styles.selectMenuPaper } }}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(selected).text, mr: 1 }} />
                                {selected.charAt(0).toUpperCase() + selected.slice(1).toLowerCase()}
                            </Box>
                        )}
                      >
                        {['PENDING', 'CONFIRMED', 'CANCELLED'].map(statusValue => (
                          <MenuItem key={statusValue} value={statusValue} sx={{ ...styles.menuItem, color: getStatusColor(statusValue).text }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(statusValue).text, mr: 1 }} />
                            {statusValue.charAt(0).toUpperCase() + statusValue.slice(1).toLowerCase()}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.status && <FormHelperText error>{errors.status}</FormHelperText>}
                      {!errors.status && <FormHelperText>Current reservation status</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
              
              <Paper elevation={0} sx={styles.sectionPaper}>
                <Typography sx={styles.sectionHeader}> <NoteIcon /> Special Requests </Typography>
                <TextField fullWidth name="special_requests" value={formData.special_requests} onChange={handleInputChange}
                  placeholder="e.g., dietary restrictions, birthday celebration" multiline rows={3} variant="outlined"
                  InputProps={{ readOnly: isReadOnly, startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <NoteIcon sx={styles.inputAdornmentIcon(!!formData.special_requests)} />
                      </InputAdornment>)}}
                  disabled={isReadOnly} sx={styles.input} />
              </Paper>

              {mode === 'edit' && (
                <Paper elevation={0} sx={{ ...styles.sectionPaper, background: alpha('#000', 0.1), mb:1.5 }}>
                  <Typography sx={{...styles.sectionHeader, color: alpha('#fff', 0.7), fontSize:'1rem', mb:1.5}}>
                    Reservation History
                  </Typography>
                  {[
                    {label: 'Created', value: reservation?.created_at ? format(new Date(reservation.created_at), 'MMM d, yyyy, h:mm a') : 'N/A'},
                    {label: 'Last Updated', value: reservation?.updated_at ? format(new Date(reservation.updated_at), 'MMM d, yyyy, h:mm a') : 'N/A'}
                  ].map(item => (
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', mb: 0.5 }}>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">{item.label}</Typography>
                      <Typography variant="body2" fontWeight="500" color="#ffffff">{item.value}</Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </form>
          </LocalizationProvider>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.07)' }} />
      
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
         <Box>
          {mode === 'edit' && (
            <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.9 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(formData.status).text, mr: 1 }} />
              <Typography variant="body2" sx={{ color: getStatusColor(formData.status).text, fontWeight: 500 }}>
                {formData.status.charAt(0).toUpperCase() + formData.status.slice(1).toLowerCase()}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={onClose} variant="outlined" sx={styles.secondaryButton} startIcon={<CloseIcon/>}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isLoading} sx={styles.primaryButton}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : (isReadOnly ? <CloseIcon/> : <SaveIcon />)}
          >
            {getSaveButtonText()}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationFormDialog;