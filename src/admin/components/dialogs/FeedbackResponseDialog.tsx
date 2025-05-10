import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
  Box,
  Divider,
  Paper,
  Avatar,
  Rating,
  Zoom,
  alpha,
  useTheme,
  Fade,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import CommentIcon from '@mui/icons-material/Comment';
import ReplyIcon from '@mui/icons-material/Reply';
import axios from 'axios';

// Orange accent color
const ACCENT_COLOR = '#d38236';

interface FeedbackResponseDialogProps {
  open: boolean;
  feedbackItem: any;
  onClose: () => void;
  onResponseSent?: () => void; // Optional callback for refreshing the list
}

const FeedbackResponseDialog: React.FC<FeedbackResponseDialogProps> = ({
  open,
  feedbackItem,
  onClose,
  onResponseSent
}) => {
  const theme = useTheme();
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to get user's name from the feedback item
  const getUserName = (item: any) => {
    if (item && item.user) {
      return `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || item.user.email;
    }
    return item?.name || 'Anonymous'; // Fallback to legacy format or anonymous
  };

  const getUserInitials = (name: string) => {
    if (!name || name === 'Anonymous') return 'A';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Call the backend API to send the response
      await axios.post(
        `http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/feedback/${feedbackItem.feedback_id}/response/`, 
        { response_text: responseText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      // Reset form
      setResponseText('');
      
      // Call optional callback to refresh the feedback list
      if (onResponseSent) {
        onResponseSent();
      }
      
      onClose();
    } catch (err) {
      console.error('Error sending feedback response:', err);
      setError('Failed to send response. Please try again.');
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
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: alpha('#fff', 0.7),
      '& svg': {
        color: ACCENT_COLOR,
      },
    },
    avatar: {
      bgcolor: alpha(ACCENT_COLOR, 0.2),
      color: ACCENT_COLOR,
      fontWeight: 'bold',
    },
    divider: {
      borderColor: 'rgba(255, 255, 255, 0.07)',
      my: 2,
    },
    feedbackCard: {
      background: alpha('#000', 0.25),
      borderRadius: '8px',
      p: 2,
      mb: 3,
      border: `1px solid ${alpha('#fff', 0.05)}`,
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
    }
  };

  if (!feedbackItem) return null;

  const customerName = getUserName(feedbackItem);
  const rating = feedbackItem.experience_rating || 0;

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
            <ReplyIcon /> Response to Feedback
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mt: 0.5 }}>
            Send a personal response to customer feedback
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
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.07)' }} />
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {error && (
          <Fade in={!!error}>
            <Box sx={{ 
              bgcolor: alpha('#ff3333', 0.1), 
              borderRadius: '8px', 
              p: 1.5, 
              mb: 2,
              border: `1px solid ${alpha('#ff3333', 0.3)}`
            }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          </Fade>
        )}
        
        <Box sx={styles.feedbackCard}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={styles.avatar}>
              {getUserInitials(customerName)}
            </Avatar>
            <Box sx={{ ml: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {customerName}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Rating 
                  value={rating} 
                  readOnly 
                  size="small"
                  sx={{ 
                    color: ACCENT_COLOR,
                    '& .MuiRating-iconEmpty': {
                      color: alpha(ACCENT_COLOR, 0.3),
                    }
                  }}
                />
                <Typography variant="body2" sx={{ ml: 1, color: alpha('#fff', 0.7) }}>
                  {rating}/5
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.85), mt: 1, fontStyle: 'italic' }}>
            "{feedbackItem.feedback_text}"
          </Typography>
        </Box>
        
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={styles.sectionTitle}>
            <CommentIcon fontSize="small" /> Your Response
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          disabled={loading}
          placeholder="Type your response to the customer here..."
          sx={styles.input}
          InputProps={{
            sx: { color: '#fff' }
          }}
        />
      </DialogContent>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.07)' }} />
      
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
          onClick={handleSendResponse}
          disabled={loading || !responseText.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={styles.primaryButton}
        >
          {loading ? 'Sending...' : 'Send Response'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackResponseDialog;