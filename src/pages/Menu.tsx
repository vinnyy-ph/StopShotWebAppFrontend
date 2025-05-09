// src/pages/MenuPage.tsx

import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import '../styles/pages/menupage.css'; // Import custom CSS

// Example data structure for your menu
// Replace or extend these placeholders with your actual menu items
const menuData = [
  {
    category: 'Appetizers',
    items: [
      {
        name: 'Nachos Supreme',
        description: 'Crispy tortilla chips topped with melted cheese, jalapenos, salsa, and sour cream.',
        price: '$8.99',
        image: 'https://placehold.co/300x200' // 300x200 placeholder
      },
      {
        name: 'Nachos Supreme',
        description: 'Crispy tortilla chips topped with melted cheese, jalapenos, salsa, and sour cream.',
        price: '$8.99',
        image: 'https://placehold.co/300x200' // 300x200 placeholder
      },
      {
        name: 'Nachos Supreme',
        description: 'Crispy tortilla chips topped with melted cheese, jalapenos, salsa, and sour cream.',
        price: '$8.99',
        image: 'https://placehold.co/300x200' // 300x200 placeholder
      },
      {
        name: 'Nachos Supreme',
        description: 'Crispy tortilla chips topped with melted cheese, jalapenos, salsa, and sour cream.',
        price: '$8.99',
        image: 'https://placehold.co/300x200' // 300x200 placeholder
      },
    ]
  },
  {
    category: 'Mains',
    items: [
      {
        name: 'Classic Burger',
        description: 'Juicy beef patty, lettuce, tomatoes, cheese, and our special sauce.',
        price: '$11.99',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Classic Burger',
        description: 'Juicy beef patty, lettuce, tomatoes, cheese, and our special sauce.',
        price: '$11.99',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Classic Burger',
        description: 'Juicy beef patty, lettuce, tomatoes, cheese, and our special sauce.',
        price: '$11.99',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Classic Burger',
        description: 'Juicy beef patty, lettuce, tomatoes, cheese, and our special sauce.',
        price: '$11.99',
        image: 'https://placehold.co/300x200'
      }
    ]
  },
  {
    category: 'Drinks',
    items: [
      {
        name: 'Signature Cocktail',
        description: 'Our special mix of fruit juices and spirits.',
        price: '$7.99',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Craft Beer',
        description: 'Locally brewed beer with a smooth, crisp finish.',
        price: '$5.99',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Craft Beer',
        description: 'Locally brewed beer with a smooth, crisp finish.',
        price: '$5.99',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Craft Beer',
        description: 'Locally brewed beer with a smooth, crisp finish.',
        price: '$5.99',
        image: 'https://placehold.co/300x200'
      }
    ]
  },
  {
    category: 'Specials',
    items: [
      {
        name: 'Steak and Fries',
        description: 'Tender steak served with a side of golden fries.',
        price: '$14.99',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Surf and Turf',
        description: 'Grilled steak paired with succulent shrimp and seasonal veggies.',
        price: '$18.99',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Surf and Turf',
        description: 'Grilled steak paired with succulent shrimp and seasonal veggies.',
        price: '$18.99',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Surf and Turf',
        description: 'Grilled steak paired with succulent shrimp and seasonal veggies.',
        price: '$18.99',
        image: 'https://placehold.co/300x200'
      }
    ]
  }
];

const MenuPage: React.FC = () => {
  return (
    <Box className="menu-page">
      {/* Main Page Heading */}
      <Typography variant="h3" className="menu-heading">
        Our Menu
      </Typography>

      {/* Render each category */}
      {menuData.map((category) => (
        <Box key={category.category} className="menu-category-section">
          {/* Category Title */}
          <Typography variant="h4" className="category-title">
            {category.category}
          </Typography>

          {/* Grid of Cards */}
          <Grid container spacing={3}>
            {category.items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card className="menu-card">
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    className="menu-card-image"
                  />
                  <CardContent>
                    <Typography variant="h6" className="menu-item-name">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" className="menu-item-description">
                      {item.description}
                    </Typography>
                    <Typography variant="body1" className="menu-item-price">
                      {item.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default MenuPage;
