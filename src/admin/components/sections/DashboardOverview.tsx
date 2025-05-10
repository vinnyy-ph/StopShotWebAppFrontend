import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Grid,
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Avatar,
  CircularProgress,
  Tooltip
} from '@mui/material';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MicIcon from '@mui/icons-material/Mic';
import TableBarIcon from '@mui/icons-material/TableBar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import '../../../../src/utils/chartConfig';
import { chartOptions } from '../../../../src/utils/chartConfig';
import { Reservation, Employee } from '../dashboard';

// Define the feedback data structure based on the API response
interface FeedbackUser {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_num: string | null;
  role: string;
}

interface FeedbackItem {
  feedback_id: number;
  user: FeedbackUser;
  feedback_text: string;
  response_text: string | null;
  experience_rating: number;
  created_at: string;
  updated_at: string;
}

// Define a new interface for room
interface Room {
  id: number;
  room_name: string;
  room_description: string;
  room_can_be_booked: boolean;
  max_number_of_people: number;
  room_type: string;
}

// Extended reservation interface to include actual room data
interface ExtendedReservation extends Reservation {
  room?: Room;
  duration?: string;
  special_requests?: string;
}

interface DashboardOverviewProps {
  reservations: Reservation[];
  feedback: any[]; // Changed to any[] since we'll use our own state
  employees: Employee[];
  onSectionChange: (section: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  reservations: propReservations,
  feedback: propsFeedback,
  employees,
  onSectionChange
}) => {
  // State for API feedback data
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackChartLoading, setFeedbackChartLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]);
  const [reservations, setReservations] = useState<ExtendedReservation[]>([]);
  
  // Add state for additional metrics
  const [reservationConversionRate, setReservationConversionRate] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);
  const [avgPartySize, setAvgPartySize] = useState(0);
  const [feedbackResponseRate, setFeedbackResponseRate] = useState(0);
  const [timeSlotData, setTimeSlotData] = useState<{labels: string[], data: number[]}>({
    labels: [], 
    data: []
  });

  // Add new state for reservation chart data
  const [reservationChartData, setReservationChartData] = useState({
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Reservations',
        data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros
        backgroundColor: 'rgba(211, 130, 54, 0.4)',
        borderColor: '#d38236',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });
  
  // New state for reservation status chart
  const [statusChartData, setStatusChartData] = useState({
    labels: ['Confirmed', 'Pending', 'Cancelled', 'Rejected'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          '#4CAF50',  // Green for confirmed
          '#f5b74e',  // Yellow for pending
          '#f44336',  // Red for cancelled
          '#757575',  // Grey for rejected
        ],
      },
    ],
  });
  
  // New state for reservation type distribution
  const [roomTypeChartData, setRoomTypeChartData] = useState({
    labels: ['Karaoke Room', 'Table', 'Other'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          '#8eccff',  // Blue for Karaoke Room
          '#d38236',  // Orange for Table
          '#757575',  // Grey for Other
        ],
      }
    ],
  });
  
  // New state for feedback sentiment timeline
  const [feedbackTimelineData, setFeedbackTimelineData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Average Rating',
        data: [] as number[],
        backgroundColor: 'rgba(245, 183, 78, 0.4)',
        borderColor: '#f5b74e',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#f5b74e',
      }
    ]
  });
  
  const [chartLoading, setChartLoading] = useState(false);

  // Fetch feedback data
  const fetchFeedback = async () => {
    setFeedbackChartLoading(true);
    try {
      const response = await axios.get('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/feedback/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });
      
      const feedbackData: FeedbackItem[] = response.data;
      setFeedback(feedbackData);
      
      // Calculate average rating
      if (feedbackData.length > 0) {
        const totalRating = feedbackData.reduce((sum, item) => sum + item.experience_rating, 0);
        setAvgRating(parseFloat((totalRating / feedbackData.length).toFixed(1)));
        
        // Calculate distribution
        const distribution = [0, 0, 0, 0, 0]; // Index 0 for 1 star, 4 for 5 stars
        feedbackData.forEach(item => {
          const index = item.experience_rating - 1;
          if (index >= 0 && index < 5) {
            distribution[index]++;
          }
        });
        setRatingDistribution(distribution.reverse()); // Reverse to match chart order (5 stars first)
        
        // Calculate feedback response rate
        const respondedFeedback = feedbackData.filter(item => item.response_text !== null).length;
        setFeedbackResponseRate(parseFloat(((respondedFeedback / feedbackData.length) * 100).toFixed(1)));
        
        // Process feedback timeline data
        processFeedbackTimelineData(feedbackData);
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    } finally {
      setFeedbackChartLoading(false);
    }
  };
  
  // Initialize feedback data on component mount
  useEffect(() => {
    setLoading(true);
    fetchFeedback().finally(() => setLoading(false));
  }, []);
  
  // Function to process feedback timeline data
  const processFeedbackTimelineData = (feedbackData: FeedbackItem[]) => {
    // Group feedback by date
    const grouped = feedbackData.reduce((acc: {[date: string]: {total: number, count: number}}, item) => {
      const date = item.created_at.split('T')[0]; // Get just the date part
      if (!acc[date]) {
        acc[date] = { total: 0, count: 0 };
      }
      acc[date].total += item.experience_rating;
      acc[date].count += 1;
      return acc;
    }, {});
    
    // Sort dates and get the last 10 days with data
    const sortedDates = Object.keys(grouped).sort();
    const recentDates = sortedDates.slice(-10); // Take the last 10 dates
    
    // Calculate the average rating for each day
    const labels = recentDates.map(date => formatDateShort(date));
    const data = recentDates.map(date => Number((grouped[date].total / grouped[date].count).toFixed(1)));
    
    setFeedbackTimelineData({
      labels,
      datasets: [
        {
          label: 'Average Rating',
          data,
          backgroundColor: 'rgba(245, 183, 78, 0.4)',
          borderColor: '#f5b74e',
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: '#f5b74e',
        }
      ]
    });
  };

  // New effect to fetch reservation chart data
  useEffect(() => {
    const fetchReservationData = async () => {
      setChartLoading(true);
      try {
        const response = await axios.get('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/reservations/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        });
        
        const reservationData: ExtendedReservation[] = response.data;
        setReservations(reservationData);
        
        // Process the data for chart
        processReservationChartData(reservationData);
        
        // Process status distribution
        processStatusChart(reservationData);
        
        // Process room type distribution
        processRoomTypeChart(reservationData);
        
        // Process time slot popularity
        processTimeSlotData(reservationData);
        
        // Calculate additional metrics
        calculateReservationMetrics(reservationData);
      } catch (error) {
        console.error('Error fetching reservation data for chart:', error);
      } finally {
        setChartLoading(false);
      }
    };
    
    fetchReservationData();
  }, []);

  // Function to process reservations and count by day of week
  const processReservationChartData = (reservationData: ExtendedReservation[]) => {
    // Initialize counts for each day (0 = Monday, 6 = Sunday)
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    
    reservationData.forEach(reservation => {
      if (!reservation.reservation_date) return;
      
      // Parse the reservation date
      const date = new Date(reservation.reservation_date);
      // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      let dayOfWeek = date.getDay();
      // Adjust to make Monday = 0, Sunday = 6
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      
      // Only count confirmed reservations
      if (reservation.status === 'CONFIRMED') {
        dayCounts[dayOfWeek]++;
      }
    });
    
    // Update chart data
    setReservationChartData({
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
        {
          label: 'Confirmed Reservations',
          data: dayCounts,
          backgroundColor: 'rgba(211, 130, 54, 0.4)',
          borderColor: '#d38236',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    });
  };
  
  // Function to process status distribution
  const processStatusChart = (reservationData: ExtendedReservation[]) => {
    // Count reservations by status
    let confirmed = 0, pending = 0, cancelled = 0, rejected = 0;
    
    reservationData.forEach(reservation => {
      switch (reservation.status?.toUpperCase()) {
        case 'CONFIRMED':
          confirmed++;
          break;
        case 'PENDING':
          pending++;
          break;
        case 'CANCELLED':
          cancelled++;
          break;
        case 'REJECTED':
          rejected++;
          break;
      }
    });
    
    // Update chart data
    setStatusChartData({
      labels: ['Confirmed', 'Pending', 'Cancelled', 'Rejected'],
      datasets: [
        {
          data: [confirmed, pending, cancelled, rejected],
          backgroundColor: [
            '#4CAF50',  // Green for confirmed
            '#f5b74e',  // Yellow for pending
            '#f44336',  // Red for cancelled
            '#757575',  // Grey for rejected
          ],
        },
      ],
    });
  };
  
  // Function to process room type distribution
  const processRoomTypeChart = (reservationData: ExtendedReservation[]) => {
    // Count reservations by room type
    let karaokeRooms = 0, tables = 0, other = 0;
    
    reservationData.forEach(reservation => {
      if (reservation.room_type?.toLowerCase().includes('karaoke')) {
        karaokeRooms++;
      } else if (reservation.room_type?.toLowerCase().includes('table')) {
        tables++;
      } else {
        other++;
      }
    });
    
    // Update chart data
    setRoomTypeChartData({
      labels: ['Karaoke Room', 'Table', 'Other'],
      datasets: [
        {
          data: [karaokeRooms, tables, other],
          backgroundColor: [
            '#8eccff',  // Blue for Karaoke Room
            '#d38236',  // Orange for Table
            '#757575',  // Grey for Other
          ],
        }
      ],
    });
  };
  
  // Function to process time slot popularity
  const processTimeSlotData = (reservationData: ExtendedReservation[]) => {
    // Group reservations by hour
    const hourCounts: {[hour: string]: number} = {};
    
    // Initialize all hours (we'll use 12-hour format for display)
    for (let i = 10; i <= 23; i++) { // Assuming 10 AM to 11 PM operating hours
      const hour12 = i > 12 ? i - 12 : i;
      const ampm = i >= 12 ? 'PM' : 'AM';
      hourCounts[`${hour12} ${ampm}`] = 0;
    }
    
    // Count reservations by hour
    reservationData.forEach(reservation => {
      if (!reservation.reservation_time) return;
      
      // Parse the reservation time
      const timeParts = reservation.reservation_time.split(':');
      if (timeParts.length < 2) return;
      
      const hour = parseInt(timeParts[0], 10);
      const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const timeKey = `${hour12} ${ampm}`;
      
      // Only count if within our display range
      if (hourCounts[timeKey] !== undefined) {
        hourCounts[timeKey]++;
      }
    });
    
    // Convert to arrays for chart
    const labels = Object.keys(hourCounts);
    const data = Object.values(hourCounts);
    
    setTimeSlotData({ labels, data });
  };
  
  // Function to calculate additional reservation metrics
  const calculateReservationMetrics = (reservationData: ExtendedReservation[]) => {
    // Calculate pending reservations
    const pending = reservationData.filter(r => r.status === 'PENDING').length;
    setPendingReservations(pending);
    
    // Calculate conversion rate
    const total = reservationData.length;
    const confirmed = reservationData.filter(r => r.status === 'CONFIRMED').length;
    const rate = total > 0 ? (confirmed / total) * 100 : 0;
    setReservationConversionRate(parseFloat(rate.toFixed(1)));
    
    // Calculate average party size
    if (total > 0) {
      const totalGuests = reservationData.reduce((sum, r) => sum + (r.number_of_guests || 0), 0);
      setAvgPartySize(parseFloat((totalGuests / total).toFixed(1)));
    }
  };
  
  // Updated feedback chart to use real data
  const feedbackChartData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        data: ratingDistribution,
        backgroundColor: [
          '#4CAF50',
          '#8BC34A',
          '#FFC107',
          '#d38236',
          '#F44336'
        ],
        hoverOffset: 4
      },
    ],
  };
  
  // Create popular time slots chart data
  const timeSlotChartData = useMemo(() => ({
    labels: timeSlotData.labels,
    datasets: [
      {
        label: 'Reservations',
        data: timeSlotData.data,
        backgroundColor: 'rgba(142, 204, 255, 0.7)',
        borderColor: '#8eccff',
        borderWidth: 1,
      }
    ]
  }), [timeSlotData]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Helper function for shorter date format
  const formatDateShort = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Get employee full name
  const getEmployeeName = (employee: Employee) => {
    if (employee.first_name && employee.last_name) {
      return `${employee.first_name} ${employee.last_name}`;
    } else if (employee.first_name) {
      return employee.first_name;
    } else if (employee.username) {
      return employee.username;
    } else {
      return 'Unnamed Employee';
    }
  };

  // Get first letter for avatar
  const getAvatarInitial = (employee: Employee) => {
    if (employee.first_name) {
      return employee.first_name.charAt(0);
    } else if (employee.username) {
      return employee.username.charAt(0);
    } else {
      return 'E';
    }
  };
  
  // Get user's full name from feedback
  const getFeedbackUserName = (item: FeedbackItem) => {
    if (item.user && item.user.first_name && item.user.last_name) {
      return `${item.user.first_name} ${item.user.last_name}`;
    } else if (item.user && item.user.first_name) {
      return item.user.first_name;
    } else if (item.user && item.user.username) {
      return item.user.username;
    }
    return 'Anonymous';
  };

  // Truncate long text with ellipsis
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Convert 24-hour time to 12-hour format
  const formatTime12Hour = (time24: string) => {
    if (!time24) return '';
    
    // If it's already in the right format or invalid, return as is
    if (!time24.includes(':')) return time24;
    
    try {
      const [hours, minutes] = time24.split(':');
      const hoursNum = parseInt(hours, 10);
      const period = hoursNum >= 12 ? 'PM' : 'AM';
      const hours12 = hoursNum % 12 || 12; // Convert to 12-hour format
      
      return `${hours12}:${minutes} ${period}`;
    } catch (error) {
      return time24; // Return original if conversion fails
    }
  };

  // Normalize role titles
  const formatRoleTitle = (role: string) => {
    if (!role) return '';
    
    // Convert from formats like "BAR_MANAGER" to "Bar Manager"
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={3}>
        {/* Enhanced Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="stats-card">
            <Box className="stats-header">
              <Typography className="stats-title" sx={{ color: '#e0e0e0' }}>Total Reservations</Typography>
              <BookOnlineIcon className="stats-icon" sx={{ color: '#d38236' }} />
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ color: '#ffffff' }}>{reservations.length || 0}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 14, mr: 0.5 }} />
              <Typography variant="body2" sx={{ color: '#4caf50' }}>
                {reservations.filter(r => r.status === 'CONFIRMED').length || 0} confirmed
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="stats-card">
            <Box className="stats-header">
              <Typography className="stats-title" sx={{ color: '#e0e0e0' }}>Avg. Feedback</Typography>
              <StarIcon className="stats-icon" sx={{ color: '#f5b74e' }} />
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ color: '#ffffff' }}>{avgRating}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
                From {feedback.length} reviews 
              </Typography>
              <Rating 
                value={avgRating} 
                readOnly 
                size="small" 
                sx={{ 
                  ml: 0.5,
                  '& .MuiRating-iconFilled': { color: '#f5b74e' },
                  '& .MuiRating-iconEmpty': { color: '#666666' }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="stats-card">
            <Box className="stats-header">
              <Typography className="stats-title" sx={{ color: '#e0e0e0' }}>Conversion Rate</Typography>
              <TrendingUpIcon className="stats-icon" sx={{ color: '#8eccff' }} />
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ color: '#ffffff' }}>{reservationConversionRate}%</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <HourglassTopIcon sx={{ color: '#f5b74e', fontSize: 14, mr: 0.5 }} />
              <Typography variant="body2" sx={{ color: '#f5b74e' }}>
                {pendingReservations} pending reservations
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="stats-card">
            <Box className="stats-header">
              <Typography className="stats-title" sx={{ color: '#e0e0e0' }}>Avg. Group Size</Typography>
              <GroupIcon className="stats-icon" sx={{ color: '#4caf50' }} />
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ color: '#ffffff' }}>{avgPartySize}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <PeopleIcon sx={{ color: '#e0e0e0', fontSize: 14, mr: 0.5 }} />
              <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
                Guests per reservation
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Main Charts Row */}
        <Grid item xs={12} md={8}>
          <Paper className="chart-paper">
            <Box className="chart-header">
              <Typography variant="h6" className="chart-title" sx={{ color: '#e0e0e0' }}>Reservation Trends</Typography>
              <IconButton 
                size="small" 
                className="refresh-btn" 
                sx={{ color: '#8eccff' }}
                disabled={chartLoading}
                onClick={async () => {
                  try {
                    setChartLoading(true);
                    const response = await axios.get('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/reservations/', {
                      headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                      }
                    });
                    processReservationChartData(response.data);
                  } catch (error) {
                    console.error('Error refreshing reservation data:', error);
                  } finally {
                    setChartLoading(false);
                  }
                }}
              >
                {chartLoading ? <CircularProgress size={16} sx={{ color: '#8eccff' }} /> : <RefreshIcon fontSize="small" />}
              </IconButton>
            </Box>
            <Box className="chart-container">
              <Line 
                data={reservationChartData} 
                options={chartOptions}
                id="reservations-chart"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="chart-paper">
            <Box className="chart-header">
              <Typography variant="h6" className="chart-title" sx={{ color: '#e0e0e0' }}>Feedback Ratings</Typography>
              <IconButton 
                size="small" 
                className="refresh-btn" 
                sx={{ color: '#8eccff' }}
                disabled={feedbackChartLoading}
                onClick={() => fetchFeedback()}
              >
                {feedbackChartLoading ? <CircularProgress size={16} sx={{ color: '#8eccff' }} /> : <RefreshIcon fontSize="small" />}
              </IconButton>
            </Box>
            <Box className="chart-container doughnut-container">
              <Doughnut 
                data={feedbackChartData}
                options={{
                  ...chartOptions,
                  cutout: '70%'
                }}
                id="distribution-chart"
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* New Row: Feedback Timeline */}
        <Grid item xs={12}>
          <Paper className="chart-paper">
            <Box className="chart-header">
              <Typography variant="h6" className="chart-title" sx={{ color: '#e0e0e0' }}>Feedback Trend</Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0', flexGrow: 1, ml: 1 }}>
                Average rating over time
              </Typography>
            </Box>
            <Box className="chart-container" sx={{ height: 200 }}>
              <Line 
                data={feedbackTimelineData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      min: 0,
                      max: 5,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: '#b0b0b0',
                        callback: function(value) {
                          return value + '⭐';
                        }
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: '#b0b0b0',
                      }
                    }
                  },
                }}
                id="feedback-timeline-chart"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Secondary Charts Row */}
        <Grid item xs={12} md={4}>
          <Paper className="chart-paper">
            <Box className="chart-header">
              <Typography variant="h6" className="chart-title" sx={{ color: '#e0e0e0' }}>Reservation Status</Typography>
            </Box>
            <Box className="chart-container" sx={{ height: 250 }}>
              <Pie 
                data={statusChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#b0b0b0',
                        padding: 10,
                        usePointStyle: true,
                      }
                    }
                  }
                }}
                id="status-chart"
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className="chart-paper">
            <Box className="chart-header">
              <Typography variant="h6" className="chart-title" sx={{ color: '#e0e0e0' }}>Room Type Distribution</Typography>
            </Box>
            <Box className="chart-container" sx={{ height: 250 }}>
              <Pie 
                data={roomTypeChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#b0b0b0',
                        padding: 10,
                        usePointStyle: true,
                      }
                    }
                  }
                }}
                id="room-type-chart"
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className="chart-paper">
            <Box className="chart-header">
              <Typography variant="h6" className="chart-title" sx={{ color: '#e0e0e0' }}>Popular Time Slots</Typography>
              <Tooltip title="Most popular reservation hours">
                <AccessTimeIcon sx={{ color: '#8eccff', ml: 1, fontSize: 18 }} />
              </Tooltip>
            </Box>
            <Box className="chart-container" sx={{ height: 250 }}>
              <Bar 
                data={timeSlotChartData}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: '#b0b0b0',
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: '#b0b0b0',
                      }
                    }
                  }
                }}
                id="time-slot-chart"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Reservations */}
        <Grid item xs={12} md={6}>
          <Paper className="table-paper">
            <Box className="table-header">
              <Typography variant="h6" className="table-title" sx={{ color: '#e0e0e0' }}>Recent Reservations</Typography>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => onSectionChange('reservations')}
                className="view-all-btn"
                sx={{ 
                  color: '#e0e0e0',
                  borderColor: '#555555',
                  '&:hover': { borderColor: '#8eccff', backgroundColor: 'rgba(142, 204, 255, 0.1)' }
                }}
              >
                View All
              </Button>
            </Box>
            <TableContainer className="table-container">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Name</TableCell>
                    <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Date</TableCell>
                    <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Time</TableCell>
                    <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Guests</TableCell>
                    <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservations.slice(0, 5).map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{reservation.guest_name}</TableCell>
                      <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{reservation.reservation_date}</TableCell>
                      <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{formatTime12Hour(reservation.reservation_time)}</TableCell>
                      <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>
                        {reservation.number_of_guests} 
                        {reservation.room_type && (
                          <Tooltip title={reservation.room_type}>
                            {reservation.room_type?.toLowerCase().includes('karaoke') ? 
                              <MicIcon fontSize="small" sx={{ ml: 0.5, color: '#8eccff', opacity: 0.7 }} /> : 
                              <TableBarIcon fontSize="small" sx={{ ml: 0.5, color: '#d38236', opacity: 0.7 }} />
                            }
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottomColor: '#333333' }}>
                        <Chip 
                          label={reservation.status_display || reservation.status} 
                          size="small"
                          sx={{
                            bgcolor: 'transparent',
                            border: '1px solid',
                            borderColor: reservation.status?.toLowerCase() === 'confirmed' ? '#4caf50' : 
                                    reservation.status?.toLowerCase() === 'pending' ? '#f5b74e' : 
                                    reservation.status?.toLowerCase() === 'rejected' ? '#f44336' : 
                                    reservation.status?.toLowerCase() === 'cancelled' ? '#f44336' : '#757575',
                            color: reservation.status?.toLowerCase() === 'confirmed' ? '#4caf50' : 
                                  reservation.status?.toLowerCase() === 'pending' ? '#f5b74e' : 
                                  reservation.status?.toLowerCase() === 'rejected' ? '#f44336' : 
                                  reservation.status?.toLowerCase() === 'cancelled' ? '#f44336' : '#757575',
                            fontWeight: 500,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Feedback - Using Real API Data */}
        <Grid item xs={12} md={6}>
          <Paper className="table-paper">
            <Box className="table-header">
              <Typography variant="h6" className="table-title" sx={{ color: '#e0e0e0' }}>Recent Feedback</Typography>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => onSectionChange('feedback')}
                className="view-all-btn"
                sx={{ 
                  color: '#e0e0e0',
                  borderColor: '#555555',
                  '&:hover': { borderColor: '#8eccff', backgroundColor: 'rgba(142, 204, 255, 0.1)' }
                }}
              >
                View All
              </Button>
            </Box>
            <TableContainer className="table-container">
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={24} sx={{ color: '#d38236' }} />
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Name</TableCell>
                      <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Date</TableCell>
                      <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Rating</TableCell>
                      <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Comment</TableCell>
                      <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333', width: 80 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedback.slice(0, 5).map((item) => (
                      <TableRow key={item.feedback_id}>
                        <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{getFeedbackUserName(item)}</TableCell>
                        <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{formatDate(item.created_at)}</TableCell>
                        <TableCell sx={{ borderBottomColor: '#333333' }}>
                          <Rating 
                            value={item.experience_rating} 
                            readOnly 
                            size="small" 
                            sx={{ 
                              '& .MuiRating-iconFilled': { color: '#f5b74e' },
                              '& .MuiRating-iconEmpty': { color: '#666666' }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>
                          <Tooltip title={item.feedback_text}>
                            <Typography variant="body2" className="ellipsis" sx={{ color: '#e0e0e0' }}>
                              {truncateText(item.feedback_text, 60)}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ borderBottomColor: '#333333' }}>
                          <Chip 
                            label={item.response_text ? "Responded" : "Pending"}
                            size="small"
                            sx={{
                              bgcolor: 'transparent',
                              border: '1px solid',
                              borderColor: item.response_text ? '#4caf50' : '#f5b74e',
                              color: item.response_text ? '#4caf50' : '#f5b74e',
                              fontWeight: 500,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>
        </Grid>

        {/* Active Staff - updated to filter out admin/owner roles */}
        <Grid item xs={12}>
          <Paper className="table-paper">
            <Box className="table-header">
              <Typography variant="h6" className="table-title" sx={{ color: '#e0e0e0' }}>Active Staff</Typography>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => onSectionChange('employees')}
                className="view-all-btn"
                sx={{ 
                  color: '#e0e0e0',
                  borderColor: '#555555',
                  '&:hover': { borderColor: '#8eccff', backgroundColor: 'rgba(142, 204, 255, 0.1)' }
                }}
              >
                View All
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
              {employees
                .filter(e => 
                  e.is_active && 
                  (!e.role?.toLowerCase().includes('admin') && !e.role?.toLowerCase().includes('owner'))
                )
                .slice(0, 5)
                .map((employee) => (
                  <Paper key={employee.user_id} sx={{ p: 2, width: 200, textAlign: 'center', bgcolor: '#222222' }}>
                    <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1, bgcolor: '#2e4a66' }}>
                      {getAvatarInitial(employee)}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                      {getEmployeeName(employee)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {formatRoleTitle(employee.role)}
                    </Typography>
                  </Paper>
                ))
              }
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default DashboardOverview;