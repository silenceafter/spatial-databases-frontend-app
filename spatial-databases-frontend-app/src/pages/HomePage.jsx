import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
/*import { apiKey, YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapZoomControl, YMapContainer,
  YMapListener, YMapDefaultMarker,
reactify, YMapClusterer, clusterByGrid, YMapHint, YMapHintContext } from '../helpers';*/
import { Box, Drawer, Grid, Avatar, List, ListItem,
  ListItemIcon,
  ListItemText, Toolbar, Typography } from '@mui/material';
/*import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';*/

import { YMaps, Map, Panorama } from '@pbe/react-yandex-maps';
import { Portal } from 'react-dom';

const drawerWidth = 360;

export default function HomePage() {
  const [tt, setTt] = useState([]);
  const bb = () => {
    let hh = [];
    for(let i = 0; i < 10; i++) {
      hh.push(<Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>);
    }
    return hh;
  };

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex',
          overflow: 'hidden', 
          height: '100%',
        }}
      >
        {<Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#f8f9fa',
            },
          }}
          open
        >
          <Toolbar />
          <List>          
          </List>
        </Drawer>}

        <Box
          sx={{
            flexGrow: 1,
            p: 0,
            display: 'flex', alignItems: 'flex-end',
          flexDirection: 'column', 
          }}
        >
          <Box
            sx={{
              width: '100%',
              flexGrow: 1, 
              
              borderRadius: 1, 
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/*<YMap
              location={{
                center: [30.3141, 59.9386], // СПб: [долгота, широта]
                zoom: 10,
              }}
              // ⬇️ КРИТИЧНО: явно задаём высоту и ширину в %
              style={{ width: '100%', height: '100%' }}
            >
              <YMapDefaultSchemeLayer />
              <YMapDefaultFeaturesLayer />              
            </YMap>*/}
            <YMaps>
              
                <Map defaultState={{ center: [59.9386, 30.3141], zoom: 9 }} height="100vh" width="100vw" />
              
            </YMaps>
            </Box>

    <Box
    sx={{
      position: 'absolute',
      top: 72,        // отступ от AppBar (64px + 8px)
      right: 8,      // отступ от правого края
      width: 200,
      padding: '10px',
      bgcolor: 'white',
      borderRadius: 1,
      boxShadow: 3,
      zIndex: 100,    // выше карты
      color: 'black',
      overflow: 'auto',
      maxHeight: `calc(100vh - 100px)`
    }}
  >
    <Typography variant="h6" gutterBottom>
      Детали поездки
    </Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
    <Typography>Нажмите на метку, чтобы увидеть информацию.</Typography>
  </Box>
          </Box>
      </Box>
    </>
  );
}