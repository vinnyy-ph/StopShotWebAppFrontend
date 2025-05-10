import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Rating,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Fade,
  Divider,
  Badge,
  alpha,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

import FeedbackResponseDialog from '../dialogs/FeedbackResponseDialog';
import { mockFeedbackData } from '../dashboard'; // Keep for type reference

// Orange accent color
const ACCENT_COLOR = '#d38236';

interface FeedbackProps {
  feedback: typeof mockFeedbackData;
  onDeleteFeedback: (id: number) => void;
}

const Feedback: React.FC<FeedbackProps> = ({
  feedback: propsFeedback, // Renamed to avoid confusion with state variable
  onDeleteFeedback: propsDeleteFeedback
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackResponseDialog, setFeedbackResponseDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  
  // Add new state variables for API integration
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  // Add state variables for filter functionality
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [starFilter, setStarFilter] = useState<number | null>(null);

  // Fetch feedback data from the backend
  const fetchFeedback = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/feedback/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });
      
      const feedbackData = response.data;
      setFeedback(feedbackData);
      
      // Calculate statistics
      if (feedbackData.length > 0) {
        const totalRating = feedbackData.reduce((sum: number, item: any) => sum + item.experience_rating, 0);
        const avgRating = totalRating / feedbackData.length;
        
        // Count distribution
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        feedbackData.forEach((item: any) => {
          if (item.experience_rating >= 1 && item.experience_rating <= 5) {
            distribution[item.experience_rating as keyof typeof distribution]++;
          }
        });
        
        setStats({
          averageRating: parseFloat(avgRating.toFixed(1)),
          totalReviews: feedbackData.length,
          distribution
        });
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete feedback
  const handleDeleteFeedback = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/feedback/${id}/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        });
        
        // Update local state
        setFeedback(feedback.filter((item) => item.feedback_id !== id));
        
        // Call the parent component's delete handler to maintain compatibility
        propsDeleteFeedback(id);
        
        // Show success message
        alert('Feedback deleted successfully');
      } catch (err: any) {
        console.error('Error deleting feedback:', err);
        
        // More detailed error message with status code
        const status = err.response?.status;
        const errorMsg = err.response?.data?.detail || 
                        err.response?.data?.message || 
                        `Failed to delete feedback (${status || 'unknown error'}). Please try again.`;
        
        alert(errorMsg);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRespondToFeedback = (feedbackItem: any) => {
    setSelectedFeedback(feedbackItem);
    setFeedbackResponseDialog(true);
  };

  // Filter menu handlers
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (rating: number | null) => {
    setStarFilter(rating);
    handleFilterClose();
  };

  // Fetch feedback on component mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  // Calculate percentages for distribution bars
  const getPercentage = (rating: number) => {
    if (stats.totalReviews === 0) return 0;
    return (stats.distribution[rating as keyof typeof stats.distribution] / stats.totalReviews) * 100;
  };

  // Filter feedback based on search query and star filter
  const filteredFeedback = feedback.filter((item: any) => {
    const userName = `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim();
    const matchesSearch = (
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.feedback_text || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Apply star rating filter if set
    const matchesStarFilter = starFilter === null || item.experience_rating === starFilter;
    
    return matchesSearch && matchesStarFilter;
  });

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to get user's name
  const getUserName = (item: any) => {
    if (item.user) {
      return `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || item.user.email;
    }
    return 'Anonymous';
  };

  // Helper function to get first letter of name for avatar
  const getNameInitial = (item: any) => {
    if (item.user && item.user.first_name) {
      return item.user.first_name.charAt(0);
    }
    if (item.user && item.user.email) {
      return item.user.email.charAt(0);
    }
    return 'A';
  };

  return (
    <motion.div
      key="feedback"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Paper className="content-paper">
        <Box className="content-header">
          <Typography variant="h5" className="content-title">Customer Feedback</Typography>
          <Box className="content-actions" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search feedback"
              value={searchQuery}
              onChange={handleSearch}
              className="search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="search-icon" />
                  </InputAdornment>
                ),
              }}
            />
            
            {/* Star Rating Filter Button with Badge */}
            <Tooltip title="Filter by star rating">
              <Badge 
                color="warning" 
                variant="dot" 
                invisible={starFilter === null} 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    backgroundColor: ACCENT_COLOR 
                  }
                }}
              >
                <IconButton 
                  size="small" 
                  className="filter-btn"
                  onClick={handleFilterClick}
                  sx={{ 
                    border: starFilter !== null ? `1px solid ${ACCENT_COLOR}` : 'none',
                    background: starFilter !== null ? alpha(ACCENT_COLOR, 0.1) : 'transparent'
                  }}
                >
                  <TuneIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            
            {/* Filter Menu */}
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              TransitionComponent={Fade}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  borderRadius: '12px',
                  minWidth: 180,
                  overflow: 'visible',
                  bgcolor: '#1a1a1a',
                  backgroundImage: `linear-gradient(145deg, #1e1e1e 0%, #121212 100%)`,
                  color: '#ffffff',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: '#1a1a1a',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                  Filter by Rating
                </Typography>
                {starFilter !== null && (
                  <IconButton size="small" onClick={() => handleFilterChange(null)} sx={{ color: 'rgba(255,255,255,0.6)', p: 0.5 }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 0.5 }} />
              
              {[5, 4, 3, 2, 1].map((rating) => (
                <MenuItem
                  key={rating}
                  onClick={() => handleFilterChange(rating)}
                  sx={{
                    py: 1,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    color: '#ffffff',
                    bgcolor: starFilter === rating ? alpha(ACCENT_COLOR, 0.15) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(ACCENT_COLOR, 0.1),
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating
                      value={rating}
                      readOnly
                      size="small"
                      precision={1}
                      sx={{ 
                        color: ACCENT_COLOR,
                        '& .MuiRating-iconEmpty': {
                          color: alpha(ACCENT_COLOR, 0.3),
                        }
                      }}
                    />
                    <Typography>
                      {rating} {rating === 1 ? 'star' : 'stars'}
                    </Typography>
                    {starFilter === rating && (
                      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: ACCENT_COLOR }} />
                      </Box>
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress sx={{ color: ACCENT_COLOR }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <>
            <Box className="feedback-summary">
              <Paper className="summary-card">
                <Box className="summary-content">
                  <Typography className="summary-title">Average Rating</Typography>
                  <Typography variant="h4" className="summary-value">{stats.averageRating}</Typography>
                </Box>
                <Rating 
                  value={stats.averageRating} 
                  precision={0.1} 
                  readOnly 
                  sx={{ 
                    '& .MuiRating-iconFilled': { color: ACCENT_COLOR },
                    '& .MuiRating-iconEmpty': { color: '#666666' }
                  }}
                />
              </Paper>
              
              <Paper className="summary-card">
                <Box className="summary-content">
                  <Typography className="summary-title">Total Reviews</Typography>
                  <Typography variant="h4" className="summary-value">{stats.totalReviews}</Typography>
                </Box>
                <Box className="rating-breakdown">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Box key={rating} className="rating-bar" sx={{ cursor: 'pointer' }} onClick={() => handleFilterChange(rating)}>
                      <Typography variant="caption" sx={{ color: '#e0e0e0' }}>{rating}★</Typography>
                      <Box className="bar-container">
                        <Box 
                          className="bar-fill" 
                          sx={{ 
                            width: `${getPercentage(rating)}%`,
                            bgcolor: starFilter === rating ? ACCENT_COLOR : undefined
                          }}
                        ></Box>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#e0e0e0' }}>
                        {Math.round(getPercentage(rating))}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* Active filter indicator */}
            {starFilter !== null && (
              <Box sx={{ display: 'flex', px: 2, mb: 2 }}>
                <Chip 
                  label={`${starFilter} Star Rating`} 
                  onDelete={() => handleFilterChange(null)}
                  deleteIcon={<CloseIcon fontSize="small" />}
                  size="small"
                  sx={{ 
                    bgcolor: alpha(ACCENT_COLOR, 0.15),
                    color: '#ffffff',
                    borderRadius: '16px',
                    '& .MuiChip-deleteIcon': {
                      color: '#ffffff',
                      '&:hover': {
                        color: ACCENT_COLOR,
                      }
                    }
                  }}
                  icon={<StarIcon sx={{ color: ACCENT_COLOR }} fontSize="small" />}
                />
              </Box>
            )}
            
            {filteredFeedback.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1">No feedback found</Typography>
                {(searchQuery || starFilter !== null) && (
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      mt: 2, 
                      borderColor: alpha(ACCENT_COLOR, 0.5),
                      color: ACCENT_COLOR,
                      '&:hover': {
                        borderColor: ACCENT_COLOR,
                        bgcolor: alpha(ACCENT_COLOR, 0.1)
                      }
                    }} 
                    onClick={() => {
                      setSearchQuery('');
                      setStarFilter(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            ) : (
              <Box className="feedback-grid">
                {filteredFeedback.map((item: any) => (
                  <Paper key={item.feedback_id} className="feedback-card">
                    <Box className="feedback-card-header">
                      <Box className="feedback-user">
                        <Avatar className="feedback-avatar" sx={{ bgcolor: '#2e4a66' }}>{getNameInitial(item)}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#ffffff' }}>{getUserName(item)}</Typography>
                          <Typography variant="caption" className="feedback-date" sx={{ color: '#b0b0b0' }}>
                            {formatDate(item.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      <Rating 
                        value={item.experience_rating} 
                        readOnly 
                        size="small" 
                        sx={{ 
                          '& .MuiRating-iconFilled': { color: ACCENT_COLOR },
                          '& .MuiRating-iconEmpty': { color: '#666666' }
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" className="feedback-message">
                      <FormatQuoteIcon className="quote-icon" />
                      {item.feedback_text}
                    </Typography>

                    {item.response_text && (
                      <Box sx={{ 
                        backgroundColor: alpha(ACCENT_COLOR, 0.15), 
                        p: 1, 
                        borderRadius: 1, 
                        mb: 2,
                        borderLeft: `3px solid ${ACCENT_COLOR}`
                      }}>
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: ACCENT_COLOR }}>
                          Our Response:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
                          {item.response_text}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box className="feedback-actions">
                      {!item.response_text && (
                        <Button 
                          size="small" 
                          startIcon={<CheckCircleIcon sx={{ color: '#4caf50' }} />}
                          className="btn-respond"
                          onClick={() => handleRespondToFeedback(item)}
                          sx={{ 
                            color: '#e0e0e0',
                            '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' }
                          }}
                        >
                          Respond
                        </Button>
                      )}
                      <IconButton 
                        size="small" 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteFeedback(item.feedback_id)}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: '#ff7043' }} />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </>
        )}
      </Paper>

      <FeedbackResponseDialog
        open={feedbackResponseDialog}
        feedbackItem={selectedFeedback}
        onClose={() => setFeedbackResponseDialog(false)}
        onResponseSent={fetchFeedback} // Refresh data after responding
      />
    </motion.div>
  );
};

export default Feedback;