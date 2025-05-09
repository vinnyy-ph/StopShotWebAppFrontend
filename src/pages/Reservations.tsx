import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import '../styles/pages/reservations.css';

const ReservationsPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(1); // 0=January, 1=February, etc.
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Adjust the number of days based on the selected month (and a fixed year 2025)
  const daysInCurrentMonth = new Date(2025, currentMonth + 1, 0).getDate();
  const daysInMonth = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handleClose = () => {
    // Future logic to close modal/page
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
    setSelectedDay(null);
  };

  const handleSubmit = () => {
    // Future logic for form submission
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }} className="reservation-container">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Book a Reservation
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Main Content: Form & Calendar */}
        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={5}>
            <Box component="form" noValidate autoComplete="off">
              <Box mb={2}>
                <Typography variant="body1">Name - Required</Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter your name"
                  size="small"
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <Typography variant="body1">Number of People - Required</Typography>
                <TextField
                  variant="outlined"
                  placeholder="How many seats?"
                  size="small"
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <Typography variant="body1">Date - Required</Typography>
                <TextField
                  variant="outlined"
                  placeholder="MM/DD/YYYY"
                  size="small"
                  fullWidth
                  value={
                    selectedDay 
                      ? `${String(currentMonth + 1).padStart(2, '0')}/${
                          selectedDay < 10 ? '0' + selectedDay : selectedDay
                        }/2025`
                      : ''
                  }
                />
              </Box>
              <Box mb={2}>
                <Typography variant="body1">Contact Number - Required</Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter your contact number"
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>
          </Grid>

          {/* Calendar Section */}
          <Grid item xs={12} md={7}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <IconButton onClick={handlePrevMonth}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6">
                {months[currentMonth].toUpperCase()}
              </Typography>
              <IconButton onClick={handleNextMonth}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
              {daysOfWeek.map((day) => (
                <Box key={day} textAlign="center">
                  <Typography variant="subtitle2">{day}</Typography>
                </Box>
              ))}
              {daysInMonth.map((day) => (
                <Box
                  key={day}
                  onClick={() => handleDayClick(day)}
                  sx={{
                    cursor: 'pointer',
                    py: 1,
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: selectedDay === day ? '#d38236' : 'transparent'
                  }}
                  textAlign="center"
                  className={`calendar-day-box ${selectedDay === day ? 'selected-day' : ''}`}
                >
                  {day}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box mt={3} display="flex" flexDirection="column" alignItems="center">
          <Button variant="contained" onClick={handleSubmit} sx={{ mb: 1 }}>
            Submit
          </Button>
          <Typography variant="body2" color="success.main">
            Successfully submitted! Reservation status will be sent within an hour via SMS
          </Typography>
          <Typography variant="body2" color="error.main">
            *Selected date unavailable
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReservationsPage;