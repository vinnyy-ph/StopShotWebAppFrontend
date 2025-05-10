// admin/components/sections/Analytics.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Grid
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
// Import the chart registration
import '../../../../src/utils/chartConfig';


const Analytics: React.FC = () => {
  // Chart data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Food',
        data: [4200, 5100, 6300, 8100, 7200, 9100],
        backgroundColor: 'rgba(211, 130, 54, 0.6)',
      },
      {
        label: 'Drinks',
        data: [5800, 4800, 7200, 6900, 8500, 10200],
        backgroundColor: 'rgba(65, 105, 225, 0.6)',
      },
    ],
  };

  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Paper className="content-paper">
        <Box className="content-header">
          <Typography variant="h5" className="content-title">Business Analytics</Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className="chart-paper">
              <Box className="chart-header">
                <Typography variant="h6" className="chart-title">Revenue</Typography>
                <IconButton size="small" className="refresh-btn">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box className="chart-container large">
                <Bar 
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: '#bbb'
                        }
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          color: '#aaa',
                          callback: function(value) {
                            return '$' + value;
                          }
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.05)'
                        }
                      },
                      x: {
                        ticks: {
                          color: '#aaa'
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.05)'
                        }
                      }
                    }
                  }} 
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default Analytics;