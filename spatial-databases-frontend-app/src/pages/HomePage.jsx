import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
/*import { apiKey, YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapZoomControl, YMapContainer,
  YMapListener, YMapDefaultMarker,
reactify, YMapClusterer, clusterByGrid, YMapHint, YMapHintContext } from '../helpers';*/
import { Box, Drawer, Grid, Avatar, List, ListItem, Divider, ListItemAvatar,
  ListItemIcon,
  ListItemText, Toolbar, Typography } from '@mui/material';
/*import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';*/

import { YMaps, Map, Panorama } from '@pbe/react-yandex-maps';
import { fetchData } from '../store/slices/routesSlice';

const drawerWidth = 360;

export default function HomePage() {
  const dispatch = useDispatch();

  //селекторы
  const routes = useSelector((state) => state.routes.routes);
  const loading = useSelector((state) => state.routes.loading);
  const error = useSelector((state) => state.routes.error);

  //эффекты
  useEffect(() => {
    dispatch(fetchData(1));
  }, []);

  return (
    <>
    {console.log(routes)}
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
        width: 400,
        padding: '10px',
        bgcolor: 'white',
        borderRadius: 1,
        boxShadow: 3,
        zIndex: 100,    // выше карты
        color: 'black',
        overflow: 'auto',
        maxHeight: `calc(100vh - 100px)`,
        opacity: 0.85,
      }}
    >
    {routes && (<List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
      {routes.length === 0 ? (
        <ListItem>
          <ListItemText primary="Нет маршрутов" />
        </ListItem>
      ) : (
        routes.map((route, index) => (
          <React.Fragment key={route.id}>
            {index > 0 && <Divider variant="inset" component="li" />}
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={route.title}
                  // Можно использовать иконку по сложности:
                  sx={{
                    bgcolor:
                      route.difficulty === 'easy' ? 'green' :
                      route.difficulty === 'medium' ? 'orange' : 'red'
                  }}
                >
                  {route.durationHours}ч
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={route.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: 'text.primary', display: 'inline' }}
                    >
                      {route.durationHours} часов • {route.difficulty}
                    </Typography>
                    {route.description && ` — ${route.description}`}
                  </React.Fragment>
                }
              />
            </ListItem>
          </React.Fragment>
        ))
      )}
    </List>)}
  </Box>
          </Box>
      </Box>
    </>
  );
}