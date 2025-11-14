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
  ListItemText, Toolbar, Typography, 
  CircularProgress} from '@mui/material';
/*import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';*/

import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { fetchRoutesList, fetchRouteDetail } from '../store/slices/routesSlice';

const drawerWidth = 360;

export default function HomePage() {
  const dispatch = useDispatch();

  //селекторы
  const routesList = useSelector((state) => state.routes.list);
  const routesListStatus = useSelector((state) => state.routes.routesListStatus);
  //const routesListError = useSelector((state) => state.routes.routesListError);
  const selectedRoute = useSelector((state) => state.routes.selectedRoute);
  const routeDetailStatus = useSelector((state) => state.routes.routeDetailStatus);
  //const routeDetailError = useSelector((state) => state.routes.routeDetailError);

  //эффекты
  // загрузка маршрутов
  useEffect(() => {
    dispatch(fetchRoutesList(1));
  }, [dispatch]);

  // первый маршрут выбран по умолчанию
  /*useEffect(() => {

  }, [dispatch]);*/
  //
  return (
    <>
    {console.log(routesListStatus)}
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
            <YMaps>              
                <Map defaultState={{ center: [59.9386, 30.3141], zoom: 12 }} height="100vh" width="100vw">
                  <Placemark geometry={[59.9391, 30.3158]} />
                </Map>
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
            {routesListStatus === 'loading' && <CircularProgress size={40}></CircularProgress>}
            {routesList && routesListStatus === 'succeeded' &&
              <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
              { routesList.length === 0 ? (
                <ListItem>
                  <ListItemText primary="Нет маршрутов" />
                </ListItem>
              ) : (
                routesList.map((route, index) => (
                  <React.Fragment key={route.id}>
                    {index > 0 && <Divider variant="inset" component="li" />}
                    <ListItem 
                      alignItems="flex-start" 
                      onClick={() => dispatch(fetchRouteDetail(route.id))}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={route.title}
                          // Можно использовать иконку по сложности:
                          sx={{
                            bgcolor:
                              route.difficulty === 'Легкий' ? 'green' :
                              route.difficulty === 'Средний' ? 'orange' : 'red'
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
              </List>              
            }
          </Box>
        </Box>
      </Box>
    </>
  );
}