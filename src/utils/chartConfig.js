import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, 
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Global chart options
export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          family: 'Inter, sans-serif',
          size: 12
        },
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#e1e1e1',
      borderWidth: 1,
      padding: 10,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      titleFont: {
        family: 'Inter, sans-serif',
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        family: 'Inter, sans-serif',
        size: 13
      },
      footerFont: {
        family: 'Inter, sans-serif',
        size: 12,
        style: 'italic'
      },
      cornerRadius: 4
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Inter, sans-serif',
          size: 12
        },
        padding: 10
      }
    },
    y: {
      grid: {
        borderDash: [3, 3],
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        font: {
          family: 'Inter, sans-serif',
          size: 12
        },
        padding: 10
      }
    }
  }
};

export const chartColors = {
  primary: '#E76F51',
  secondary: '#F4A261',
  tertiary: '#2A9D8F',
  quaternary: '#264653',
  highlight: '#E9C46A',
  background: 'rgba(233, 196, 106, 0.1)'
};