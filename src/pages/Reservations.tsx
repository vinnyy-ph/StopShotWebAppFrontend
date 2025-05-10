import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Paper, 
  FormControl, 
  Select, 
  MenuItem, 
  InputAdornment, 
  CircularProgress, 
  TableCell,
  Fade,
  Chip,
  Tooltip,
  Divider
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import MicIcon from '@mui/icons-material/Mic';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { RiBilliardsFill } from "react-icons/ri";
import '../styles/pages/reservations.css';

const API_BASE_URL = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';

// Availability types
interface DayAvailability {
  isAvailable: boolean;
  isBusy: boolean;
  isSpecialEvent: boolean;
}

// Form data
interface ReservationFormData {
  guest_name: string;
  guest_email: string;
  reservation_date: string;
  reservation_time: string;
  duration: string;
  number_of_guests: number;
  room_type: string;
  special_requests: string;
}

// Define the interfaces locally if needed
interface Reservation {
  id: number;
  customer_name: string;
  contact_email: string;
  contact_phone: string;
  date: string;
  time: string;
  duration: string;
  room_type: string;
  number_of_people: number;
  special_requests?: string;
  status: string;
}

const ReservationsPage: React.FC = () => {
  // Basic state
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [reservationType, setReservationType] = useState('table');
  const [timeSlot, setTimeSlot] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<ReservationFormData>({
    guest_name: '',
    guest_email: '',
    reservation_date: '',
    reservation_time: '',
    duration: '01:00:00', // Default 1 hour
    number_of_guests: 1,
    room_type: 'TABLE', // Default to TABLE type
    special_requests: ''
  });
  
  // Availability state
  const [isLoading, setIsLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [dayAvailability, setDayAvailability] = useState<{[key: number]: DayAvailability}>({});
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate days in month
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const blankDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Fetch month availability when month/year changes
  useEffect(() => {
    fetchMonthAvailability();
  }, [currentMonth, currentYear, reservationType]);
  
  // Fetch time slots when day is selected
  useEffect(() => {
    if (selectedDay) {
      fetchTimeSlotAvailability();
    } else {
      setAvailableTimeSlots([]);
      setTimeSlot('');
    }
  }, [selectedDay]);

  // Fetch month availability from API
  const fetchMonthAvailability = async () => {
    setIsLoading(true);
    try {
      // Create an array of all days in the current month
      const daysToCheck = daysInMonth.map(day => {
        const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return date;
      });
      
      const mockAvailability: {[key: number]: DayAvailability} = {};
      
      // Define business hours (all possible time slots)
      const businessHours = [
        '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', 
        '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM'
      ];
      
      // For each day, check time slot availability
      for (const [index, date] of daysToCheck.entries()) {
        try {
          // Get booked slots for this specific date and room type
          const response = await axios.get(`${API_BASE_URL}/reservations/`, { 
            params: { 
              reservation_date: date,
              status: 'CONFIRMED',
              room__room_type: reservationType === 'table' ? 'TABLE' : 'KARAOKE_ROOM'
            }
          });
          
          // Convert booked slots to our time format
          const bookedSlots = response.data.map((slot: any) => {
            const time = new Date(`1970-01-01T${slot.reservation_time}`);
            const hours = time.getHours();
            const minutes = time.getMinutes();
            
            let formattedHour = hours % 12;
            if (formattedHour === 0) formattedHour = 12;
            
            return `${formattedHour}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
          });
          
          // Calculate available slots
          const availableSlots = businessHours.filter(slot => !bookedSlots.includes(slot));
          const availableSlotCount = availableSlots.length;
          
          const day = index + 1;
          
          // Set availability based on number of available slots
          mockAvailability[day] = {
            isAvailable: availableSlotCount > 0,
            isBusy: availableSlotCount > 0 && availableSlotCount <= 3, // Limited availability if 3 or fewer slots
            isSpecialEvent: false // Keep any existing special event logic
          };
        } catch (err) {
          console.error(`Error fetching availability for date ${date}:`, err);
        }
      }
      
      setDayAvailability(mockAvailability);
    } catch (error) {
      console.error('Error fetching availability:', error);
      
      // Same fallback mock data as before
      const mockAvailability: {[key: number]: DayAvailability} = {};
      const busyDays = [5, 12, 19, 25];
      const specialEventDays = [8, 15, 22];
      
      daysInMonth.forEach(day => {
        mockAvailability[day] = {
          isAvailable: true,
          isBusy: busyDays.includes(day),
          isSpecialEvent: specialEventDays.includes(day)
        };
      });
      
      setDayAvailability(mockAvailability);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch available time slots for selected date
  const fetchTimeSlotAvailability = async () => {
    if (!selectedDay) return;
    
    setIsLoading(true);
    try {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      
      // Using the "Get Specific Booked Time Slots" endpoint from README
      const response = await axios.get(`${API_BASE_URL}/reservations/`, { 
        params: { 
          reservation_date: date,
          status: 'CONFIRMED',
          room__room_type: reservationType === 'table' ? 'TABLE' : 'KARAOKE_ROOM'
        }
      });
      
      // Process booked slots to determine available slots
      const businessHours = [
        '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', 
        '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM'
      ];
      
      // The response contains booked slots, so we need to find available ones
      const bookedSlots = response.data.map((slot: any) => {
        const time = new Date(`1970-01-01T${slot.reservation_time}`);
        const hours = time.getHours();
        const minutes = time.getMinutes();
        
        let formattedHour = hours % 12;
        if (formattedHour === 0) formattedHour = 12;
        
        return `${formattedHour}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
      });
      
      const availableSlots = businessHours.filter(slot => !bookedSlots.includes(slot));
      setAvailableTimeSlots(availableSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      
      // Same fallback mock data as before
      const allTimeSlots = [
        '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', 
        '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM'
      ];
      
      const dayStatus = dayAvailability[selectedDay];
      let availableSlots = [...allTimeSlots];
      
      if (dayStatus?.isBusy) {
        availableSlots = availableSlots.filter((_, index) => index % 3 !== 0);
      }
      
      if (dayStatus?.isSpecialEvent) {
        availableSlots = availableSlots.filter((_, index) => index % 2 !== 0);
      }
      
      setAvailableTimeSlots(availableSlots);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };
  
  // Update validateForm function to check guest limits
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.guest_email.trim()) {
      errors.guest_email = 'Email is required';
    } else {
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.guest_email)) {
        errors.guest_email = 'Enter a valid email address';
      }
    }
    
    if (!formData.guest_name.trim()) {
      errors.guest_name = 'Name is required';
    }
    
    if (formData.number_of_guests < 1) {
      errors.number_of_guests = 'At least 1 guest is required';
    } else if (formData.room_type === 'TABLE' && formData.number_of_guests > 6) {
      errors.number_of_guests = 'Tables can accommodate a maximum of 6 guests';
    } else if (formData.room_type === 'KARAOKE_ROOM' && formData.number_of_guests > 10) {
      errors.number_of_guests = 'Karaoke rooms can accommodate a maximum of 10 guests';
    }
    
    if (!selectedDay) {
      errors.date = 'Please select a date';
    }
    
    if (!timeSlot) {
      errors.time = 'Please select a time slot';
    }
    
    // Add validation for karaoke rooms - must be at least 1 hour
    if (formData.room_type === 'KARAOKE_ROOM') {
      const durationParts = formData.duration.split(':');
      const hours = parseInt(durationParts[0], 10);
      const _ = parseInt(durationParts[1], 10); // Underscore to indicate unused
      
      if (hours < 1) {
        errors.duration = 'Karaoke room bookings must be for at least 1 hour';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update handleReservationTypeChange to adjust guest count if it exceeds the new limit
  const handleReservationTypeChange = (type: string) => {
    setReservationType(type);
    
    // Check if current guest count exceeds the limit for the new type
    let adjustedGuestCount = formData.number_of_guests;
    if (type === 'table' && formData.number_of_guests > 6) {
      adjustedGuestCount = 6;
    } else if (type === 'karaoke' && formData.number_of_guests > 10) {
      adjustedGuestCount = 10;
    }
    
    // Make sure to use the exact enum values from the backend (TABLE or KARAOKE_ROOM)
    setFormData({
      ...formData,
      room_type: type === 'table' ? 'TABLE' : 'KARAOKE_ROOM',
      // Reset the duration for karaoke rooms to meet the minimum requirement
      duration: type === 'karaoke' ? '01:00:00' : formData.duration,
      number_of_guests: adjustedGuestCount
    });
  };

  // Update handleSubmit function
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const reservationDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      
      // Convert time format to 24-hour format that Django will accept
      let formattedTime = '00:00:00';
      if (timeSlot) {
        const [time, period] = timeSlot.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        
        formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
      }
      
      // Format data according to API requirements in README
      const reservationData = {
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        reservation_date: reservationDate,
        reservation_time: formattedTime,
        duration: formData.duration || '01:00:00',
        number_of_guests: formData.number_of_guests,
        room_type: formData.room_type,
        special_requests: formData.special_requests
      };
      
      // Submit to API
      await axios.post(`${API_BASE_URL}/reservations/`, reservationData);
      
      // Show confirmation
      setShowConfirmation(true);
    } catch (error: any) {
      console.error('Error submitting reservation:', error);
      
      // Improved error handling based on backend's error format from README
      if (error.response) {
        console.log('Response data:', error.response.data);
      }
      
      // Handle validation errors from the backend
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const formattedErrors: {[key: string]: string} = {};
        
        // Process different error formats
        Object.keys(backendErrors).forEach(key => {
          if (key === 'non_field_errors') {
            // This could be a booking conflict error, show it in a field that makes sense
            formattedErrors['time'] = Array.isArray(backendErrors[key]) 
              ? backendErrors[key][0] 
              : backendErrors[key];
          } else {
            formattedErrors[key] = Array.isArray(backendErrors[key]) 
              ? backendErrors[key][0] 
              : backendErrors[key];
          }
        });
        
        setFormErrors(formattedErrors);
      } else {
        alert('Failed to submit reservation. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a day is marked as busy
  const isDayBusy = (day: number) => {
    return dayAvailability[day]?.isBusy || false;
  };

  // Check if a day has special events
  const isDaySpecialEvent = (day: number) => {
    return dayAvailability[day]?.isSpecialEvent || false;
  };
  
  // Check if a day is unavailable
  const isDayUnavailable = (day: number) => {
    return dayAvailability[day]?.isAvailable === false || false;
  };

  return (
    <Box className="reservations-page dark-theme" sx={{ pb: 10, pt: 6, backgroundColor: '#121212' }}>
      {/* Neon background effect */}
      <Box 
        className="neon-glow-bg" 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at top center, rgba(211, 130, 54, 0.15), transparent 70%)',
          pointerEvents: 'none',
          opacity: 0.6,
          zIndex: 1
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Enhanced Header with Night Vibes */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 5,
          position: 'relative',
          textAlign: 'center'
        }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 1
            }}
          >
            <NightlifeIcon
              className="neon-icon"
              sx={{ 
                color: '#d38236', 
                fontSize: 30, 
                mr: 1.5,
                filter: 'drop-shadow(0 0 8px rgba(211, 130, 54, 0.8))',
                animation: 'neonPulse 2s infinite alternate'
              }} 
            />
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#fff',
                fontWeight: 800,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textShadow: '0 0 10px rgba(211, 130, 54, 0.5), 0 0 20px rgba(211, 130, 54, 0.3)',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              RESERVE YOUR <span style={{ color: '#d38236' }}>NIGHT</span>
            </Typography>
          </Box>

          <Typography 
            variant="h6" 
            sx={{ 
              color: '#aaa',
              fontWeight: 400,
              maxWidth: '700px',
              mx: 'auto',
              mb: 3,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Book your billiards table or private karaoke room & make your night legendary
          </Typography>

          {/* Late Night Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 1 }}>
            <Chip 
              icon={<AccessTimeIcon sx={{ color: '#333' }} />} 
              label="4PM - 2AM DAILY" 
              size="small"
              sx={{ 
                bgcolor: 'rgba(211, 130, 54, 0.9)', 
                color: '#222',
                fontWeight: 600,
                '& .MuiChip-icon': { color: '#333' }
              }}
            />
            <Chip 
              icon={<CelebrationIcon sx={{ color: '#333' }} />} 
              label="SPECIAL EVENT PACKAGES" 
              size="small"
              sx={{ 
                bgcolor: 'rgba(211, 130, 54, 0.9)', 
                color: '#222',
                fontWeight: 600,
                '& .MuiChip-icon': { color: '#333' }
              }}
            />
          </Box>
        </Box>

        {/* Main Content Container with Enhanced Styling */}
        <Paper 
          elevation={6} 
          sx={{ 
            backgroundColor: '#1a1a1a', 
            color: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid rgba(211, 130, 54, 0.2)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 30px rgba(211, 130, 54, 0.2)',
            backgroundImage: 'linear-gradient(rgba(20, 20, 20, 0.9), rgba(26, 26, 26, 0.95))'
          }} 
          className="reservation-container"
        >
          {/* Ambient lighting effect */}
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(ellipse at center top, rgba(211, 130, 54, 0.05), transparent 70%)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* Top Accent Bar */}
          <Box sx={{ 
            height: '6px', 
            background: 'linear-gradient(90deg, rgba(211, 130, 54, 1) 0%, rgba(211, 130, 54, 0.7) 50%, rgba(211, 130, 54, 0.3) 100%)', 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0,
            zIndex: 5
          }} />
          
          <Box sx={{ p: { xs: 2, md: 4 }, pt: 6, position: 'relative', zIndex: 2 }}>
            {/* Enhanced Reservation Type Selector */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
              <Box 
                className="reservation-type-selector"
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  backgroundColor: 'rgba(25,25,25,0.9)',
                  p: 0.5,
                  borderRadius: '50px',
                  border: '1px solid rgba(211, 130, 54, 0.3)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.3), 0 0 10px rgba(211, 130, 54, 0.1)'
                }}
              >
                <Button 
                  variant={reservationType === 'table' ? 'contained' : 'text'}
                  onClick={() => handleReservationTypeChange('table')}
                  startIcon={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RiBilliardsFill style={{ fontSize: 20 }} />
                    </Box>
                  }
                  sx={{ 
                    borderRadius: '50px',
                    px: 3,
                    backgroundColor: reservationType === 'table' ? '#d38236' : 'transparent',
                    color: reservationType === 'table' ? '#fff' : '#bbb',
                    '&:hover': {
                      backgroundColor: reservationType === 'table' ? '#b05e1d' : 'rgba(211, 130, 54, 0.1)'
                    }
                  }}
                >
                  Table
                </Button>
                <Button 
                  variant={reservationType === 'karaoke' ? 'contained' : 'text'}
                  onClick={() => handleReservationTypeChange('karaoke')}
                  startIcon={<MicIcon />}
                  sx={{ 
                    borderRadius: '50px',
                    px: 3,
                    backgroundColor: reservationType === 'karaoke' ? '#d38236' : 'transparent',
                    color: reservationType === 'karaoke' ? '#fff' : '#bbb',
                    '&:hover': {
                      backgroundColor: reservationType === 'karaoke' ? '#b05e1d' : 'rgba(211, 130, 54, 0.1)'
                    }
                  }}
                >
                  Karaoke Room
                </Button>
              </Box>
            </Box>

            <Divider sx={{ 
              my: 3, 
              opacity: 0.3,
              '&::before, &::after': {
                borderColor: 'rgba(211, 130, 54, 0.3)',
              }
            }}>
              <Chip 
                label={reservationType === 'table' ? "BILLIARDS RESERVATION" : "KARAOKE RESERVATION"} 
                sx={{ 
                  backgroundColor: 'rgba(211, 130, 54, 0.15)',
                  color: '#d38236',
                  fontWeight: 600,
                  border: '1px solid rgba(211, 130, 54, 0.3)'
                }}
              />
            </Divider>

            {/* Main Content Grid - Rearranged for Better Flow */}
            <Grid container spacing={4}>
              {/* Calendar Section - Now First for Better Mobile Experience */}
              <Grid item xs={12} md={7}>
                <Box sx={{ 
                  backgroundColor: 'rgba(30, 30, 30, 0.6)',
                  borderRadius: '12px',
                  p: 3,
                  border: '1px solid rgba(211, 130, 54, 0.15)',
                  position: 'relative',
                  backdropFilter: 'blur(5px)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                }}>
                  {isLoading && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      zIndex: 10,
                      borderRadius: '12px',
                    }}>
                      <CircularProgress sx={{ color: '#d38236' }} />
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Box 
                      sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.15)',
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        mr: 2
                      }}
                    >
                      <EventIcon sx={{ color: '#d38236', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: '#d38236', 
                          fontWeight: 700,
                          mb: 0.5
                        }}
                      >
                        Select Your Date
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>
                        {reservationType === 'table' 
                          ? 'Billiards tables are available from 4PM to 2AM daily'
                          : 'Karaoke rooms require minimum 1-hour bookings'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    mb={3}
                    sx={{
                      borderBottom: '1px solid rgba(211, 130, 54, 0.2)',
                      pb: 2
                    }}
                  >
                    <IconButton 
                      onClick={handlePrevMonth}
                      sx={{ 
                        color: '#d38236',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 130, 54, 0.1)'
                        }
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <Typography 
                      variant="h6"
                      sx={{ 
                        fontWeight: 600,
                        color: '#fff',
                        letterSpacing: '1px',
                        textShadow: '0 0 5px rgba(0,0,0,0.5)'
                      }}
                    >
                      {months[currentMonth].toUpperCase()} {currentYear}
                    </Typography>
                    <IconButton 
                      onClick={handleNextMonth}
                      sx={{ 
                        color: '#d38236',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 130, 54, 0.1)'
                        }
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                  
                  <Box className="calendar-wrapper">
                    <Box 
                      display="grid" 
                      gridTemplateColumns="repeat(7, 1fr)" 
                      gap={1}
                      mb={2}
                    >
                      {daysOfWeek.map((day) => (
                        <Box 
                          key={day} 
                          className="day-of-week"
                          sx={{
                            textAlign: 'center',
                            py: 1,
                            fontWeight: 600,
                            color: day === 'SA' || day === 'SU' ? '#d38236' : '#999',
                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                          }}
                        >
                          <Typography variant="body2">{day}</Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Box 
                      display="grid" 
                      gridTemplateColumns="repeat(7, 1fr)" 
                      gap={1}
                      sx={{ mb: 3 }}
                    >
                      {/* Empty cells for days before the month starts */}
                      {blankDays.map(blank => (
                        <Box key={`blank-${blank}`} className="calendar-day-blank"></Box>
                      ))}
                      
                      {/* Actual days of the month */}
                      {daysInMonth.map((day) => {
                        const isBusy = isDayBusy(day);
                        const isSpecial = isDaySpecialEvent(day);
                        const isUnavailable = isDayUnavailable(day);
                        const isPastDate = new Date(currentYear, currentMonth, day) < new Date(new Date().setHours(0,0,0,0));
                        const isToday = new Date(currentYear, currentMonth, day).toDateString() === new Date().toDateString();
                        
                        return (
                          <Box
                            key={day}
                            onClick={() => {
                              if (!isUnavailable && !isPastDate) {
                                handleDayClick(day);
                              }
                            }}
                            sx={{
                              cursor: isUnavailable || isPastDate ? 'not-allowed' : 'pointer',
                              py: 1,
                              border: `1px solid ${selectedDay === day ? '#d38236' : isToday ? 'rgba(211, 130, 54, 0.4)' : '#333'}`,
                              borderRadius: '8px',
                              backgroundColor: 
                                isUnavailable || isPastDate ? 'rgba(50,50,50,0.3)' :
                                selectedDay === day ? 'rgba(211, 130, 54, 0.3)' : 
                                isToday ? 'rgba(211, 130, 54, 0.15)' :
                                isSpecial ? 'rgba(211, 130, 54, 0.08)' :
                                'rgba(40,40,40,0.4)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              transition: 'all 0.2s ease-in-out',
                              opacity: isUnavailable || isPastDate ? 0.5 : 1,
                              '&:hover': (!isUnavailable && !isPastDate) ? {
                                backgroundColor: selectedDay === day 
                                  ? 'rgba(211, 130, 54, 0.4)' 
                                  : 'rgba(211, 130, 54, 0.15)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 3px 10px rgba(0,0,0,0.2), 0 0 15px rgba(211, 130, 54, 0.1)'
                              } : {},
                              boxShadow: selectedDay === day ? '0 0 0 1px #d38236, 0 0 10px rgba(211, 130, 54, 0.3)' : 'none'
                            }}
                            className={`calendar-day-box ${selectedDay === day ? 'selected-day' : ''}`}
                          >
                            <Typography
                              variant="body2" 
                              sx={{ 
                                fontWeight: selectedDay === day ? 700 : isToday ? 600 : 400,
                                color: selectedDay === day ? '#d38236' : 
                                       isToday ? '#d38236' :
                                       isUnavailable || isPastDate ? '#999' : '#fff',
                                fontSize: '1rem',
                                textDecoration: isPastDate ? 'line-through' : 'none'
                              }}
                            >
                              {day}
                            </Typography>
                            
                            {isBusy && !isUnavailable && !isPastDate && (
                              <Tooltip title="Limited availability">
                                <Box 
                                  className="busy-indicator"
                                  sx={{
                                    position: 'absolute',
                                    bottom: '4px',
                                    height: '3px',
                                    width: '16px',
                                    backgroundColor: 'rgba(255, 87, 34, 0.7)',
                                    borderRadius: '2px'
                                  }}
                                />
                              </Tooltip>
                            )}
                            {isSpecial && !isUnavailable && !isPastDate && (
                              <Tooltip title="Special event">
                                <Box 
                                  className="special-indicator"
                                  sx={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    height: '8px',
                                    width: '8px',
                                    backgroundColor: '#d38236',
                                    borderRadius: '50%',
                                    animation: 'pulse 1.5s infinite'
                                  }}
                                />
                              </Tooltip>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                    
                    {/* Enhanced Legend */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-around',
                        flexWrap: 'wrap',
                        gap: { xs: 1, sm: 2 },
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid rgba(211, 130, 54, 0.2)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: '16px', 
                          height: '3px', 
                          backgroundColor: 'rgba(255, 87, 34, 0.7)',
                          mr: 1
                        }} />
                        <Typography variant="caption" sx={{ color: '#999' }}>Limited Availability</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: '10px', 
                          height: '10px', 
                          backgroundColor: 'rgba(211, 130, 54, 0.15)',
                          borderRadius: '50%',
                          mr: 1
                        }} />
                        <Typography variant="caption" sx={{ color: '#999' }}>Today</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: '10px', 
                          height: '10px', 
                          backgroundColor: 'rgba(50,50,50,0.5)',
                          borderRadius: '50%',
                          mr: 1
                        }} />
                        <Typography variant="caption" sx={{ color: '#999' }}>Unavailable</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Available Time Slots - Now Shows Up Below Calendar */}
                  {selectedDay && (
                    <Fade in={true} timeout={500}>
                      <Box sx={{ mt: 3 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 2, 
                            color: '#d38236',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <AccessTimeIcon fontSize="small" /> 
                          Available Time Slots
                        </Typography>

                        <Box 
                          sx={{ 
                            display: 'flex',
                            flexWrap: 'wrap', 
                            gap: 1,
                            background: 'rgba(25,25,25,0.5)',
                            p: 2,
                            borderRadius: '8px'
                          }}
                        >
                          {availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((time) => (
                              <Chip
                                key={time}
                                label={time}
                                onClick={() => setTimeSlot(time)}
                                sx={{
                                  bgcolor: timeSlot === time ? '#d38236' : 'rgba(255,255,255,0.05)',
                                  color: timeSlot === time ? '#fff' : '#ccc',
                                  '&:hover': {
                                    bgcolor: timeSlot === time ? '#c77730' : 'rgba(211, 130, 54, 0.15)',
                                  },
                                  transition: 'all 0.2s ease',
                                  fontWeight: timeSlot === time ? 600 : 400,
                                  border: `1px solid ${timeSlot === time ? '#d38236' : 'rgba(255,255,255,0.1)'}`,
                                }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" sx={{ color: '#aaa', p: 1, width: '100%', textAlign: 'center' }}>
                              No available time slots for the selected date
                            </Typography>
                          )}
                        </Box>
                        {formErrors.time && (
                          <Typography className="error-text" sx={{ color: '#f44336', fontSize: '0.75rem', mt: 1 }}>
                            {formErrors.time}
                          </Typography>
                        )}
                      </Box>
                    </Fade>
                  )}
                </Box>
              </Grid>

              {/* Form Section with Night Mode Styling */}
              <Grid item xs={12} md={5}>
                <Box sx={{ 
                  backgroundColor: 'rgba(30, 30, 30, 0.6)',
                  borderRadius: '12px',
                  p: 3,
                  border: '1px solid rgba(211, 130, 54, 0.15)',
                  backdropFilter: 'blur(5px)',
                  height: '100%',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Box 
                      sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.15)',
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        mr: 2
                      }}
                    >
                      <PersonIcon sx={{ color: '#d38236', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: '#d38236', 
                          fontWeight: 700,
                          mb: 0.5
                        }}
                      >
                        Your Details
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>
                        {reservationType === 'table' 
                          ? 'Tables accommodate up to 6 people'
                          : 'Karaoke rooms fit up to 10 people'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box 
                    component="form" 
                    noValidate 
                    autoComplete="off"
                    sx={{
                      '& .MuiFormControl-root': {
                        mb: 3,
                      },
                      '& .MuiInputBase-root': {
                        backgroundColor: 'rgba(25,25,25,0.7)',
                        borderRadius: '8px',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(35,35,35,0.7)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(40,40,40,0.7)',
                          boxShadow: '0 0 0 2px rgba(211, 130, 54, 0.3)',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#aaa'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: formErrors.guest_name ? '#f44336' : 'rgba(211, 130, 54, 0.2)',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#777',
                        opacity: 1
                      },
                      '& .error-text': {
                        color: '#f44336',
                        fontSize: '0.75rem',
                        marginTop: '-12px',
                        marginBottom: '8px'
                      }
                    }}
                  >
                    <TextField
                      variant="outlined"
                      placeholder="Enter your name"
                      fullWidth
                      name="guest_name"
                      value={formData.guest_name}
                      onChange={handleInputChange}
                      error={!!formErrors.guest_name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: formErrors.guest_name ? '#f44336' : '#d38236' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    {formErrors.guest_name && <Typography className="error-text">{formErrors.guest_name}</Typography>}
                    
                    <TextField
                      variant="outlined"
                      placeholder="Enter your email address"
                      fullWidth
                      type="email"
                      name="guest_email"
                      value={formData.guest_email}
                      onChange={handleInputChange}
                      error={!!formErrors.guest_email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: formErrors.guest_email ? '#f44336' : '#d38236' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    {formErrors.guest_email && <Typography className="error-text">{formErrors.guest_email}</Typography>}

                    <TextField
                      variant="outlined"
                      placeholder={`How many people? (Max: ${formData.room_type === 'TABLE' ? 6 : 10})`}
                      fullWidth
                      type="number"
                      name="number_of_guests"
                      value={formData.number_of_guests}
                      onChange={handleInputChange}
                      error={!!formErrors.number_of_guests}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <GroupIcon sx={{ color: formErrors.number_of_guests ? '#f44336' : '#d38236' }} />
                          </InputAdornment>
                        ),
                        inputProps: { 
                          min: 1, 
                          max: formData.room_type === 'TABLE' ? 6 : 10 
                        }
                      }}
                    />
                    {formErrors.number_of_guests && <Typography className="error-text">{formErrors.number_of_guests}</Typography>}

                    <TextField
                      variant="outlined"
                      placeholder="Your selected date"
                      fullWidth
                      error={!!formErrors.date}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon sx={{ color: formErrors.date ? '#f44336' : '#d38236' }} />
                          </InputAdornment>
                        ),
                        readOnly: true,
                      }}
                      value={
                        selectedDay 
                          ? `${String(currentMonth + 1).padStart(2, '0')}/${
                              selectedDay < 10 ? '0' + selectedDay : selectedDay
                            }/${currentYear}`
                          : ''
                      }
                    />
                    {formErrors.date && <Typography className="error-text">{formErrors.date}</Typography>}

                    <TextField
                      variant="outlined"
                      placeholder="Optional: Special requests or notes"
                      fullWidth
                      multiline
                      rows={3}
                      name="special_requests"
                      value={formData.special_requests}
                      onChange={handleInputChange}
                      sx={{ 
                        mt: 1,
                        '& .MuiInputBase-root': {
                          backgroundColor: 'rgba(25,25,25,0.7)',
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Footer with Submit Button and Night Options */}
            <Box 
              sx={{ 
                mt: 5, 
                display: 'flex', 
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center' 
              }}
            >
              {/* Package Promotions */}
              {!showConfirmation && (
                <Paper sx={{ 
                  p: 2, 
                  mb: 4, 
                  width: '100%',
                  backgroundImage: 'linear-gradient(to right, rgba(211, 130, 54, 0.15), transparent)',
                  backgroundColor: 'rgba(30, 30, 30, 0.6)',
                  borderRadius: '8px',
                  border: '1px solid rgba(211, 130, 54, 0.15)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CelebrationIcon sx={{ color: '#d38236', mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ color: '#d38236', fontWeight: 600 }}>
                      {reservationType === 'table' ? 'BILLIARDS PACKAGES' : 'KARAOKE PACKAGES'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {reservationType === 'table' ? (
                      <>
                        <Chip label="₱200/hr per table" size="small" sx={{ bgcolor: 'rgba(40,40,40,0.7)', color: '#fff' }} />
                        <Chip label="BYOB ₱500 corkage" size="small" sx={{ bgcolor: 'rgba(40,40,40,0.7)', color: '#fff' }} />
                        <Chip label="Happy Hour: 4PM-7PM" size="small" sx={{ bgcolor: 'rgba(40,40,40,0.7)', color: '#fff' }} />
                      </>
                    ) : (
                      <>
                        <Chip label="₱500/hr (Small Room)" size="small" sx={{ bgcolor: 'rgba(40,40,40,0.7)', color: '#fff' }} />
                        <Chip label="₱750/hr (Large Room)" size="small" sx={{ bgcolor: 'rgba(40,40,40,0.7)', color: '#fff' }} />
                        <Chip label="50,000+ songs" size="small" sx={{ bgcolor: 'rgba(40,40,40,0.7)', color: '#fff' }} />
                      </>
                    )}
                  </Box>
                </Paper>
              )}
              
              {showConfirmation ? (
                <Fade in={showConfirmation}>
                  <Box 
                    sx={{ 
                      backgroundColor: 'rgba(46, 125, 50, 0.1)',
                      p: 3,
                      borderRadius: '12px',
                      border: '1px solid rgba(46, 125, 50, 0.3)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      maxWidth: '600px',
                      width: '100%',
                      mb: 2,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Success background effect */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at center, rgba(46, 125, 50, 0.1), transparent 70%)',
                      pointerEvents: 'none'
                    }} />
                    
                    <CheckCircleIcon sx={{ color: '#66bb6a', mr: 2, fontSize: 30 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: '#66bb6a', fontWeight: 600, mb: 1 }}>
                        Reservation Confirmed!
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#66bb6a' }}>
                        Thank you for your reservation! We've sent a confirmation to your email. 
                        {reservationType === 'table' 
                          ? " Your table will be ready at your scheduled time."
                          : " Your private karaoke room will be prepared for your arrival."
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  sx={{ 
                    py: 2, 
                    px: 8, 
                    mb: 2,
                    backgroundColor: '#d38236',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    letterSpacing: '1px',
                    '&:hover': {
                      backgroundColor: '#b05e1d',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 15px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.3)'
                    },
                    transition: 'all 0.3s ease',
                    '&.Mui-disabled': {
                      backgroundColor: '#555',
                      color: '#999'
                    },
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3), 0 0 20px rgba(211, 130, 54, 0.2)',
                    textTransform: 'uppercase'
                  }}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Reserve Now'}
                </Button>
              )}
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  backgroundColor: 'rgba(25,25,25,0.7)',
                  p: 1.5,
                  px: 3,
                  borderRadius: '50px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <InfoIcon sx={{ color: '#d38236', fontSize: 20 }} />
                <Typography 
                  variant="body2" 
                  sx={{ color: '#aaa' }}
                >
                  Need immediate assistance? Call us at (555) 123-4567
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

// Add this CSS to your existing reservations.css file
const injectCSS = document.createElement('style');
injectCSS.innerHTML = `
@keyframes neonPulse {
  0% {
    filter: drop-shadow(0 0 5px rgba(211, 130, 54, 0.7)) drop-shadow(0 0 8px rgba(211, 130, 54, 0.5));
  }
  100% {
    filter: drop-shadow(0 0 7px rgba(211, 130, 54, 0.8)) drop-shadow(0 0 12px rgba(211, 130, 54, 0.6));
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(211, 130, 54, 0.6);
    opacity: 1;
  }
  70% {
    box-shadow: 0 0 0 6px rgba(211, 130, 54, 0);
    opacity: 0.8;
  }
  100% {
    box-shadow: 0 0 0 0 rgba(211, 130, 54, 0);
    opacity: 1;
  }
}
`;
document.head.appendChild(injectCSS);

export default ReservationsPage;