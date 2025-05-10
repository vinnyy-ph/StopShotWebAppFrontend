import React, { useState, useEffect, ReactNode } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Container,
  Tab, 
  Tabs,
  Divider,
  CircularProgress,
  Paper,
  Chip,
  Badge,
  Tooltip,
  Zoom,
  useMediaQuery,
  useTheme
} from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import TapasIcon from '@mui/icons-material/Tapas';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import SetMealIcon from '@mui/icons-material/SetMeal';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';
import EggIcon from '@mui/icons-material/Egg';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import IcecreamIcon from '@mui/icons-material/Icecream';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import GrassIcon from '@mui/icons-material/Grass';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { RiBilliardsFill } from "react-icons/ri";
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import '../styles/pages/menupage.css';

// Menu item type
interface MenuItem {
  menu_id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  image_url: string | null;
}

// Category with its items
interface MenuCategory {
  category: string;
  icon: ReactNode;
  description: string;
  items: MenuItem[];
}

interface CategoryWithIcon {
  name: string;
  icon: ReactNode;
}

const MenuPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch menu data on component mount
  useEffect(() => {
    fetchMenuItems();
    
    // Add neon animation effect
    const neonElements = document.querySelectorAll('.neon-glow');
    neonElements.forEach(element => {
      element.classList.add('neon-active');
    });
    
    // Clean up animation on unmount
    return () => {
      neonElements.forEach(element => {
        element.classList.remove('neon-active');
      });
    };
  }, []);

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/menus/list');
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      
      const data: MenuItem[] = await response.json();
      
      // Group menu items by category
      const categorizedMenu = processCategorizedData(data);
      setMenuCategories(categorizedMenu);
      
      // Set featured items (popular or staff picks)
      const featured = data.filter(item => 
        (item.category === 'COCKTAILS' || item.category === 'APPETIZERS' || item.category === 'BEER') && 
        item.is_available
      ).slice(0, 6);
      
      setFeaturedItems(featured);
      
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setError('Unable to load menu. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get icon based on category
  const getCategoryIcon = (category: string): ReactNode => {
    switch (category) {
      case 'APPETIZERS':
        return <TapasIcon />;
      case 'BEEF':
        return <LocalDiningIcon />;
      case 'SEAFOOD':
        return <SetMealIcon />;
      case 'PORK':
        return <LunchDiningIcon />;
      case 'CHICKEN':
        return <BrunchDiningIcon />;
      case 'SOUP':
        return <RamenDiningIcon />;
      case 'VEGGIES':
        return <GrassIcon />;
      case 'RICE':
        return <RiceBowlIcon />;
      case 'SIZZLERS':
        return <LocalFireDepartmentIcon />;
      case 'BURGER':
        return <LunchDiningIcon />;
      case 'SILOG MEALS':
        return <EggIcon />;
      case 'BEER':
        return <SportsBarIcon />;
      case 'SOFTDRINKS':
        return <LocalCafeIcon />;
      case 'COCKTAILS':
        return <LocalBarIcon />;
      case 'TOWER':
        return <CelebrationIcon />;
      case 'DESSERT':
        return <IcecreamIcon />;
      case 'PIZZA':
        return <LocalPizzaIcon />;
      case 'PASTA':
        return <BakeryDiningIcon />;
      default:
        return <EmojiFoodBeverageIcon />;
    }
  };

  // Function to get category description
  const getCategoryDescription = (category: string): string => {
    switch (category) {
      case 'APPETIZERS':
        return 'Perfect for sharing while watching the game or between billiards rounds';
      case 'BEEF':
        return 'Premium beef selections to fuel your late-night competitions';
      case 'SEAFOOD':
        return 'Fresh catches perfect with cold beer and hot karaoke sessions';
      case 'PORK':
        return 'Savory pork dishes to satisfy your midnight cravings';
      case 'CHICKEN':
        return 'Delicious chicken options for the whole crew to share';
      case 'SOUP':
        return 'Comforting broths to keep the night going';
      case 'VEGGIES':
        return 'Fresh vegetable options for a balanced late-night meal';
      case 'RICE':
        return 'Filling rice dishes to power your billiards tournament';
      case 'SIZZLERS':
        return 'Sizzling hot plates that match the energy of your night';
      case 'BURGER':
        return 'Juicy burgers perfect for one-handed eating between shots';
      case 'SILOG MEALS':
        return 'Filipino breakfast classics served all night long';
      case 'BEER':
        return 'Cold brews to celebrate your winning streak';
      case 'SOFTDRINKS':
        return 'Refreshing non-alcoholic options for designated drivers';
      case 'COCKTAILS':
        return 'Signature mixed drinks crafted by our expert bartenders';
      case 'TOWER':
        return 'Beer towers for the whole karaoke party to share';
      case 'DESSERT':
        return 'Sweet treats to end your night on a high note';
      case 'PIZZA':
        return 'Shareable pies that pair perfectly with billiards and beer';
      case 'PASTA':
        return 'Italian-inspired dishes for a satisfying late night meal';
      default:
        return 'Delicious options to enhance your StopShot experience';
    }
  };

  // Process and categorize the data
  const processCategorizedData = (data: MenuItem[]): MenuCategory[] => {
    // Get unique categories
    const categories = [...new Set(data.map(item => item.category))];
    
    // Prioritize these categories to appear first
    const priorityOrder = ['COCKTAILS', 'BEER', 'APPETIZERS', 'TOWER', 'PIZZA', 'BURGER'];
    
    // Sort categories with priority categories first
    const sortedCategories = [...categories].sort((a, b) => {
      const indexA = priorityOrder.indexOf(a);
      const indexB = priorityOrder.indexOf(b);
      
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
    
    // Create category objects with their items
    return sortedCategories.map(category => {
      return {
        category,
        icon: getCategoryIcon(category),
        description: getCategoryDescription(category),
        items: data.filter(item => item.category === category && item.is_available)
      };
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Format price to Philippine Peso
  const formatPrice = (price: string) => {
    return `₱${parseFloat(price).toFixed(2)}`;
  };
  
  // Check if an item is a recommended choice based on some criteria
  const isRecommended = (item: MenuItem): boolean => {
    // Example logic - perhaps items with specific keywords or higher prices
    return item.name.toLowerCase().includes('signature') || 
           item.description.toLowerCase().includes('premium') ||
           parseFloat(item.price) > 300;
  };
  
  // Get drink pairing suggestion based on food category
  const getDrinkSuggestion = (category: string): string | null => {
    switch(category) {
      case 'APPETIZERS': return 'Pairs well with our Craft Beer Flight';
      case 'PIZZA': return 'Try with our Signature Sangria';
      case 'BURGER': return 'Perfect with an Ice Cold Draft Beer';
      case 'BEEF': return 'Enhances with our House Red Wine';
      case 'PORK': return 'Great with our Apple Cider Cocktail';
      case 'CHICKEN': return 'Delicious with our White Wine Selection';
      default: return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#121212',
        gap: 2
      }}>
        <CircularProgress sx={{ color: '#d38236' }} />
        <Typography sx={{ color: '#d38236', fontWeight: 500 }}>
          Loading menu options...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#121212', 
        color: 'white',
        flexDirection: 'column',
        gap: 2
      }}>
        <SportsBasketballIcon sx={{ fontSize: 40, color: '#d38236' }} />
        <Typography variant="h5" sx={{ textAlign: 'center', maxWidth: '600px' }}>{error}</Typography>
        <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
          Please check your connection and try again
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="menu-page" sx={{ backgroundColor: '#121212', pt: 2, pb: 8 }}>
      {/* Enhanced Hero Section with Nightlife Theme */}
      <Box 
        className="menu-hero" 
        sx={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 8,
          mb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated neon underline effect */}
        <Box className="neon-underline"></Box>
        
        {/* Ambient lighting effect */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at top, rgba(211, 130, 54, 0.2), transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              position: 'relative',
              zIndex: 2
            }}
          >
            <Typography 
              variant="overline" 
              sx={{ 
                color: '#d38236', 
                letterSpacing: '4px',
                fontWeight: 600,
                mb: 1
              }}
              className="neon-glow"
            >
              STOP SHOT PRESENTS
            </Typography>
            
            <Typography 
              variant="h2" 
              className="menu-heading neon-text"
              sx={{ 
                color: 'white',
                fontWeight: 800,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textAlign: 'center',
                textShadow: '0 0 10px rgba(211, 130, 54, 0.8), 0 0 20px rgba(211, 130, 54, 0.5)',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}
            >
              LATE NIGHT MENU
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RiBilliardsFill style={{ color: '#d38236', fontSize: 24, marginRight: '8px' }} />
                <Typography variant="body1" sx={{ color: '#bbb' }}>
                  BILLIARDS
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalBarIcon sx={{ color: '#d38236', mr: 1 }} />
                <Typography variant="body1" sx={{ color: '#bbb' }}>
                  COCKTAILS
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MicExternalOnIcon sx={{ color: '#d38236', mr: 1 }} />
                <Typography variant="body1" sx={{ color: '#bbb' }}>
                  KARAOKE
                </Typography>
              </Box>
            </Box>
            
            <Typography 
              variant="subtitle1" 
              align="center"
              sx={{ 
                color: '#eee',
                maxWidth: '700px',
                mx: 'auto',
                fontStyle: 'italic',
                textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
              }}
            >
              From signature cocktails to mouthwatering appetizers, 
              our menu is designed to fuel your billiards battles and karaoke sessions until 2AM
            </Typography>
            
            <Box 
              sx={{ 
                mt: 5,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                borderRadius: '50px',
                backgroundColor: 'rgba(211, 130, 54, 0.2)',
                border: '1px solid rgba(211, 130, 54, 0.3)',
                boxShadow: '0 0 15px rgba(211, 130, 54, 0.2)'
              }}
            >
              <AccessTimeIcon sx={{ color: '#d38236', mr: 1 }} />
              <Typography variant="body2" sx={{ color: '#fff' }}>
                FULL MENU AVAILABLE UNTIL 1:30AM DAILY
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Featured Menu Section */}
      {featuredItems.length > 0 && (
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <WhatshotIcon sx={{ color: '#d38236', mr: 1, fontSize: 28 }} />
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                color: '#fff',
                fontWeight: 700,
                position: 'relative'
              }}
            >
              NIGHT OWL FAVORITES
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '60px',
                  height: '3px',
                  backgroundColor: '#d38236'
                }}
              />
            </Typography>
          </Box>
          
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              backgroundColor: 'rgba(26, 26, 26, 0.7)',
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(/backgrounds/bar-pattern.png)',
              backgroundBlendMode: 'overlay',
              borderRadius: '12px',
              border: '1px solid rgba(211, 130, 54, 0.2)'
            }}
          >
            <Grid container spacing={3}>
              {featuredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={`featured-${item.menu_id}`}>
                  <Paper
                    elevation={4}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#1E1E1E',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #333',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3), 0 0 15px rgba(211, 130, 54, 0.2)'
                      },
                      height: '100px'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: '100px',
                        height: '100%',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image_url || 'https://placehold.co/300x300?text=Menu+Item'}
                        alt={item.name}
                        sx={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.7))'
                        }}
                      />
                    </Box>
                    <Box sx={{ p: 2, flexGrow: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#fff',
                          fontSize: '0.9rem',
                          mb: 0.5
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#d38236',
                          display: 'block',
                          fontWeight: 600,
                          mb: 0.5
                        }}
                      >
                        {formatPrice(item.price)}
                      </Typography>
                      <Chip 
                        label="Pool Side Favorite" 
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(211, 130, 54, 0.2)',
                          color: '#d38236',
                          height: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      )}
      
      {/* Enhanced Tab Navigation */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '12px',
            backgroundColor: 'rgba(26, 26, 26, 0.7)',
            border: '1px solid #333',
            overflow: 'hidden'
          }}
        >
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="menu categories"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#d38236',
                height: '3px'
              }
            }}
            sx={{
              '& .MuiTab-root': {
                color: '#999',
                minHeight: '64px',
                textTransform: 'none',
                fontSize: '0.95rem',
                '&.Mui-selected': {
                  color: '#d38236',
                }
              },
              '& .MuiTabs-scrollButtons': {
                color: '#d38236'
              },
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {menuCategories.map((category, index) => (
              <Tab 
                key={index} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <Box
                      sx={{
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: currentTab === index ? 'rgba(211, 130, 54, 0.15)' : 'transparent',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {typeof category.icon === 'object' && category.icon !== null ? 
                        React.isValidElement(category.icon) ?
                          React.cloneElement(category.icon, {}) : 
                          category.icon 
                        : null}
                    </Box>
                    <span style={{ fontWeight: currentTab === index ? 600 : 400 }}>
                      {category.category}
                    </span>
                  </Box>
                }
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'rgba(211, 130, 54, 0.8)',
                    backgroundColor: 'rgba(255,255,255,0.03)'
                  }
                }}
              />
            ))}
          </Tabs>
        </Paper>
      </Container>

      {/* Current Category Section with Enhanced Design */}
      <Container maxWidth="lg">
        {menuCategories.map((category, categoryIndex) => (
          <Zoom in={categoryIndex === currentTab} key={category.category} style={{ transitionDelay: categoryIndex === currentTab ? '100ms' : '0ms' }}>
            <Box 
              sx={{ 
                display: categoryIndex === currentTab ? 'block' : 'none',
                mb: 6
              }}
            >
              {/* Category Info with Enhanced Styling */}
              <Paper
                elevation={0}
                sx={{ 
                  mb: 4,
                  p: 3,
                  backgroundColor: 'rgba(26, 26, 26, 0.9)',
                  borderRadius: '12px',
                  backgroundImage: 'linear-gradient(to right, rgba(211, 130, 54, 0.1), transparent)',
                  border: '1px solid rgba(211, 130, 54, 0.2)'
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                  }}
                >
                  <Box 
                    sx={{ 
                      backgroundColor: 'rgba(211, 130, 54, 0.2)', 
                      borderRadius: '50%',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 15px rgba(211, 130, 54, 0.2)',
                      border: '1px solid rgba(211, 130, 54, 0.3)'
                    }}
                  >
                    {typeof category.icon === 'object' && category.icon !== null ? 
                      React.isValidElement(category.icon) ?
                        React.cloneElement(category.icon, { style: { color: '#d38236', fontSize: 36 } }) : 
                        category.icon 
                      : null}
                  </Box>
                  
                  <Box>
                    <Typography 
                      variant="h4" 
                      className="category-title"
                      sx={{ 
                        color: 'white', 
                        fontWeight: 700,
                        mb: 1,
                        textShadow: '0 0 10px rgba(211, 130, 54, 0.4)'
                      }}
                    >
                      {category.category}
                    </Typography>
                    
                    <Typography 
                      variant="body1"
                      sx={{ 
                        color: '#aaa',
                        fontStyle: 'italic'
                      }}
                    >
                      {category.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Menu Items Grid with Improved Cards */}
              <Grid container spacing={3}>
                {category.items.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.menu_id}>
                    <Card 
                      className="menu-card"
                      sx={{
                        backgroundColor: '#1E1E1E',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.5), 0 0 25px rgba(211, 130, 54, 0.2)'
                        },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {isRecommended(item) && (
                        <Badge
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 10,
                            '& .MuiBadge-badge': {
                              backgroundColor: '#d38236',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              borderRadius: '4px',
                              padding: '2px 8px',
                              boxShadow: '0 0 10px rgba(211, 130, 54, 0.5)'
                            }
                          }}
                          badgeContent="STAFF PICK"
                        />
                      )}
                      
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          image={item.image_url || `https://placehold.co/600x400?text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          className="menu-card-image"
                          sx={{ 
                            height: 360,
                            width: "100%",
                            objectFit: 'cover'
                          }}
                        />
                        
                        {/* Gradient overlay */}
                        <Box 
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '80px',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            pointerEvents: 'none'
                          }}
                        />
                      </Box>
                      
                      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Chip 
                              label={category.category} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(211, 130, 54, 0.2)', 
                                color: '#d38236', 
                                mb: 1,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                height: '22px'
                              }}
                            />
                            <Typography 
                              variant="h6" 
                              className="menu-item-name"
                              sx={{ 
                                fontWeight: 600, 
                                color: 'white',
                                fontSize: '1.1rem'
                              }}
                            >
                              {item.name}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body1" 
                            className="menu-item-price"
                            sx={{ 
                              color: '#d38236', 
                              fontWeight: 700,
                              fontSize: '1.2rem',
                              textShadow: '0 0 10px rgba(211, 130, 54, 0.3)'
                            }}
                          >
                            {formatPrice(item.price)}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          className="menu-item-description"
                          sx={{ 
                            color: '#bbb',
                            fontSize: '0.9rem',
                            lineHeight: 1.5,
                            mb: 2
                          }}
                        >
                          {item.description || 'A delicious dish prepared by our expert chefs for your enjoyment'}
                        </Typography>
                        
                        {/* Drink pairing recommendation */}
                        {(getDrinkSuggestion(category.category) && !['BEER', 'COCKTAILS', 'TOWER', 'SOFTDRINKS'].includes(category.category)) && (
                          <Tooltip title="Bartender's Recommendation" arrow placement="top">
                            <Box 
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mt: 'auto',
                                backgroundColor: 'rgba(211, 130, 54, 0.1)',
                                borderRadius: '4px',
                                py: 0.5,
                                px: 1
                              }}
                            >
                              <LocalBarIcon sx={{ color: '#d38236', fontSize: 16 }} />
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: '#d38236',
                                  fontStyle: 'italic',
                                  fontWeight: 500
                                }}
                              >
                                {getDrinkSuggestion(category.category)}
                              </Typography>
                            </Box>
                          </Tooltip>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Zoom>
        ))}
      </Container>
      
      {/* Footer Info Section */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />
        
        <Grid container spacing={3} sx={{ px: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <RiBilliardsFill style={{ color: '#d38236', fontSize: 18, marginRight: 8 }} />
              <Typography variant="subtitle2" sx={{ color: '#d38236', fontWeight: 600 }}>
                BILLIARDS MENU
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
              Special snacks and finger foods available at all billiards tables! Order directly from your server.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MicExternalOnIcon sx={{ color: '#d38236', fontSize: 18, mr: 1 }} />
              <Typography variant="subtitle2" sx={{ color: '#d38236', fontWeight: 600 }}>
                KARAOKE ROOM SERVICE
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
              All karaoke rooms include dedicated service buttons and special party platters available on request.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTimeIcon sx={{ color: '#d38236', fontSize: 18, mr: 1 }} />
              <Typography variant="subtitle2" sx={{ color: '#d38236', fontWeight: 600 }}>
                LATE NIGHT HOURS
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
              Full menu available until 1:30AM. Limited bar menu available until 2AM closing time.
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />
      </Container>
    </Box>
  );
};

// Custom AccessTimeIcon component if not already imported
const AccessTimeIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" {...props}>
    <path d="M0 0h24v24H0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

export default MenuPage;