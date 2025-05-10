import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  Divider,
  Paper,
  alpha,
  useTheme,
  Avatar,
  Zoom // Added Zoom for transition
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
// import PhoneIcon from '@mui/icons-material/Phone'; // Not used in current selection, can be added if needed
import GroupIcon from '@mui/icons-material/Group';
import ChairIcon from '@mui/icons-material/Chair'; // Or MeetingRoomIcon if more appropriate
import NoteIcon from '@mui/icons-material/Note';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; // For Confirmed
import PendingActionsIcon from '@mui/icons-material/PendingActions'; // For Pending
import EventBusyIcon from '@mui/icons-material/EventBusy'; // For Cancelled
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // For Default status

import { Reservation } from '../dashboard';
import { format } from 'date-fns';

// Orange accent color
const ACCENT_COLOR = '#d38236';

interface ReservationDialogProps {
  open: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onEdit: () => void;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
  open,
  reservation,
  onClose,
  onEdit
}) => {
  const theme = useTheme();
  
  if (!reservation) return null;
  
  const formatDate = (dateString: string | null | undefined, includeTime = false) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (includeTime) {
        return format(date, 'MMMM d, yyyy, h:mm a');
      }
      return format(date, 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return 'N/A';
    try {
      // Assuming timeString is in "HH:mm:ss" format
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return format(date, 'h:mm a');
    } catch (e) {
      return timeString;
    }
  };

  const getStatusChipProps = (status: string) => {
    const statusLower = status.toLowerCase();
    let icon = <HelpOutlineIcon />;
    let chipColor: "success" | "warning" | "error" | "default" = "default";
    let styles = {
      color: alpha(theme.palette.text.primary, 0.7),
      backgroundColor: alpha(theme.palette.text.primary, 0.08),
      border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
    };

    if (statusLower.includes('confirmed')) {
      icon = <EventAvailableIcon />;
      chipColor = "success";
      styles = {
        color: theme.palette.success.main,
        backgroundColor: alpha(theme.palette.success.main, 0.1),
        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
      };
    } else if (statusLower.includes('pending')) {
      icon = <PendingActionsIcon />;
      chipColor = "warning";
      styles = {
        color: theme.palette.warning.main,
        backgroundColor: alpha(theme.palette.warning.main, 0.1),
        border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
      };
    } else if (statusLower.includes('cancelled') || statusLower.includes('canceled')) {
      icon = <EventBusyIcon />;
      chipColor = "error";
      styles = {
        color: theme.palette.error.main,
        backgroundColor: alpha(theme.palette.error.main, 0.1),
        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
      };
    }
    
    return { icon, chipColor, styles };
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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
    dialogTitleContainer: {
      backgroundColor: alpha(ACCENT_COLOR, 0.9), // Darker accent for title bg
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px', // Adjusted padding
      borderBottom: `1px solid ${alpha(ACCENT_COLOR, 0.7)}`
    },
    avatar: {
      bgcolor: alpha('#fff', 0.2), // Lighter accent for avatar
      color: '#fff',
      width: 40,
      height: 40,
      mr: 1.5,
      fontWeight: 'bold',
      fontSize: '1rem'
    },
    closeButton: {
      color: alpha('#fff', 0.8),
      '&:hover': { bgcolor: alpha('#fff', 0.15) }
    },
    content: {
      pt: 0, // No top padding as title has bottom border
      pb: 2,
      '&::-webkit-scrollbar': { width: '6px' },
      '&::-webkit-scrollbar-thumb': { bgcolor: alpha(ACCENT_COLOR, 0.5), borderRadius: '3px' },
      '&::-webkit-scrollbar-track': { bgcolor: alpha('#000', 0.1) },
    },
    statusBanner: {
      p: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: alpha('#000', 0.1), // Subtle background for banner
      borderBottom: `1px solid ${alpha('#fff', 0.07)}`,
    },
    section: {
      mb: 2.5,
      p: 2,
      borderRadius: '8px',
      background: alpha('#000', 0.15),
      border: `1px solid ${alpha('#fff', 0.05)}`,
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: ACCENT_COLOR,
      fontWeight: 'bold',
      mb: 2,
      fontSize: '1.1rem'
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      mb: 1.5,
    },
    detailIconContainer: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: alpha(ACCENT_COLOR, 0.15),
      mr: 1.5,
      flexShrink: 0,
    },
    detailIcon: {
      color: ACCENT_COLOR,
      fontSize: 18
    },
    detailLabel: {
      color: alpha('#fff', 0.6),
      fontSize: '0.8rem',
      lineHeight: 1.2
    },
    detailValue: {
      fontWeight: 500,
      color: '#ffffff',
      lineHeight: 1.3
    },
    actions: {
      px: 3, py: 2,
      backgroundColor: alpha('#000', 0.2),
      borderTop: `1px solid ${alpha('#fff', 0.07)}`,
    },
    primaryButton: {
      background: `linear-gradient(45deg, ${ACCENT_COLOR} 30%, ${alpha(ACCENT_COLOR, 0.8)} 90%)`,
      color: 'white', fontWeight: 600, padding: '6px 18px', borderRadius: '8px',
      boxShadow: `0 3px 10px ${alpha(ACCENT_COLOR, 0.3)}`,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: `0 5px 14px ${alpha(ACCENT_COLOR, 0.4)}`,
        transform: 'translateY(-1px)',
        background: `linear-gradient(45deg, ${alpha(ACCENT_COLOR, 1)} 30%, ${alpha(ACCENT_COLOR, 0.9)} 90%)`,
      },
    },
    secondaryButton: {
      color: alpha('#fff', 0.8),
      borderColor: alpha('#fff', 0.3),
      borderRadius: '8px',
      padding: '6px 18px',
      '&:hover': {
        borderColor: alpha('#fff', 0.5),
        backgroundColor: alpha('#fff', 0.05)
      }
    }
  };

  const statusProps = getStatusChipProps(reservation.status);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md" // Adjusted for better content density
      fullWidth
      TransitionComponent={Zoom}
      transitionDuration={300}
      PaperProps={{
        elevation: 8,
        sx: styles.paper
      }}
    >
      <DialogTitle sx={styles.dialogTitleContainer}>
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <Avatar sx={styles.avatar}>
            {getInitials(reservation.guest_name)}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="h6" fontWeight="600" noWrap sx={{lineHeight: 1.3}}>
              {reservation.guest_name || 'Guest'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
              Reservation ID: {reservation.id}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={styles.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={styles.content}>
        <Box sx={styles.statusBanner}>
          <Chip 
            icon={statusProps.icon}
            label={reservation.status_display || reservation.status} 
            size="medium"
            sx={{ 
              ...statusProps.styles,
              fontWeight: 500,
              p: '0 4px',
              height: 30,
              '& .MuiChip-icon': { ml: '8px', fontSize: '18px', color: statusProps.styles.color },
              '& .MuiChip-label': { pr: '8px'}
            }}
          />
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.6), display: 'flex', alignItems: 'center' }}>
            <WatchLaterIcon fontSize="inherit" sx={{ mr: 0.5, fontSize: 14 }} />
            Created: {formatDate(reservation.created_at)}
          </Typography>
        </Box>
        
        <Box sx={{ p: '16px 20px' }}> {/* Main content padding */}
          <Box sx={styles.section}>
            <Typography sx={styles.sectionHeader}>
              <EventIcon /> Reservation Details
            </Typography>
            <Grid container spacing={1.5}> {/* Reduced spacing */}
              {[
                { icon: <EventIcon sx={styles.detailIcon}/>, label: 'Date', value: formatDate(reservation.reservation_date) },
                { icon: <AccessTimeIcon sx={styles.detailIcon}/>, label: 'Time', value: formatTime(reservation.reservation_time) },
                { icon: <GroupIcon sx={styles.detailIcon}/>, label: 'Guests', value: `${reservation.number_of_guests} ${reservation.number_of_guests === 1 ? 'person' : 'people'}` },
                { icon: <ChairIcon sx={styles.detailIcon}/>, label: 'Type', value: reservation.room?.room_name || reservation.room_type?.replace(/_/g, ' ') || 'N/A' }
              ].map(item => (
                <Grid item xs={12} sm={6} key={item.label}>
                  <Box sx={styles.detailItem}>
                    <Box sx={styles.detailIconContainer}>{item.icon}</Box>
                    <Box>
                      <Typography sx={styles.detailLabel}>{item.label}</Typography>
                      <Typography sx={styles.detailValue}>{item.value}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Box sx={styles.section}>
            <Typography sx={styles.sectionHeader}>
              <PersonIcon /> Customer Information
            </Typography>
            <Grid container spacing={1.5}>
              {[
                { icon: <PersonIcon sx={styles.detailIcon}/>, label: 'Name', value: reservation.guest_name || 'N/A' },
                { icon: <EmailIcon sx={styles.detailIcon}/>, label: 'Email', value: reservation.guest_email || 'N/A' }
              ].map(item => (
                <Grid item xs={12} sm={6} key={item.label}>
                  <Box sx={styles.detailItem}>
                    <Box sx={styles.detailIconContainer}>{item.icon}</Box>
                    <Box>
                      <Typography sx={styles.detailLabel}>{item.label}</Typography>
                      <Typography sx={styles.detailValue}>{item.value}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {reservation.special_requests && (
            <Box sx={styles.section}>
              <Typography sx={styles.sectionHeader}>
                <NoteIcon /> Special Requests
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.9), pl: 0.5, whiteSpace: 'pre-wrap' }}>
                {reservation.special_requests}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={styles.actions}>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
          Last Updated: {formatDate(reservation.updated_at, true)}
        </Typography>
        <Box>
          <Button onClick={onClose} variant="outlined" sx={styles.secondaryButton}>
            Close
          </Button>
          {(reservation.status.toLowerCase().includes('pending') || reservation.status.toLowerCase().includes('confirmed')) && ( // Allow edit for pending and confirmed
            <Button 
              onClick={onEdit} 
              variant="contained" 
              startIcon={<EditIcon />}
              sx={{ ...styles.primaryButton, ml: 1.5 }}
            >
              Edit
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDialog;