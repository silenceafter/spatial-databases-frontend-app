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
  ListItemText, ListItemButton, Toolbar, Typography, Collapse,
  CircularProgress} from '@mui/material';
/*import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';*/
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { YMaps, Map, Placemark, Polyline } from '@pbe/react-yandex-maps';
import { fetchRoutesList, fetchRouteDetail, fetchRouteGeometry } from '../store/slices/routesSlice';
import { alpha } from '@mui/material/styles';

const drawerWidth = 360;

export default function HomePage() {
  const dispatch = useDispatch();

  //стейты
  const [expandedId, setExpandedId] = useState(null);

  //селекторы
  const routesList = useSelector((state) => state.routes.list);
  const routesListStatus = useSelector((state) => state.routes.routesListStatus);
  //const routesListError = useSelector((state) => state.routes.routesListError);
  const selectedRoute = useSelector((state) => state.routes.selectedRoute);
  const routeDetailStatus = useSelector((state) => state.routes.routeDetailStatus);
  //const routeDetailError = useSelector((state) => state.routes.routeDetailError);
  const routeGeometry = useSelector((state) => state.routes.geometry);
  const routeGeometryStatus = useSelector((state) => state.routes.geometryStatus);

  //эффекты
  // загрузка маршрутов
  useEffect(() => {
    dispatch(fetchRoutesList(1));
  }, [dispatch]);

  // первый маршрут выбран по умолчанию
  useEffect(() => {
    if (routesListStatus === 'succeeded') {
      dispatch(fetchRouteDetail(routesList[0].id));      
    }
  }, [dispatch, routesListStatus, routesList]);

  // получить координаты для polyline
  useEffect(() => {
    if (routeDetailStatus === 'succeeded') {
      dispatch(fetchRouteGeometry(selectedRoute.stops));
    }
  }, [dispatch, routeDetailStatus, selectedRoute]);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  //
  return (
    <>
    {console.log(routeGeometry)}
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
                  {routeDetailStatus === 'succeeded' &&
                   selectedRoute.stops.map((stop, index) => (
                    <Placemark 
                      key={`${stop.pointOfInterest.id}-${index}`}
                      geometry={[stop.pointOfInterest.latitude, stop.pointOfInterest.longitude]} 
                      properties={{
                        iconContent: `${index + 1}`,
                        hintContent: `${stop.note}`,
                        balloonContent: `<b>${stop.pointOfInterest.name}</b><br>${stop.note}`
                      }}
                      options={{
                        preset: 'islands#blueStretchyIcon',
                      }}
                      modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                    />                    
                    ))
                  }
                  {routeGeometryStatus === 'succeeded' && routeGeometry && routeGeometry.length > 2 &&
                   <Polyline
                    geometry={routeGeometry}
                    options={{
                      balloonCloseButton: false,
                      strokeColor: "#000",
                      strokeWidth: 4,
                      strokeOpacity: 0.5,
                    }}
                  />}
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
              opacity: 0.9,
            }}
          >
            {routesListStatus === 'loading' && <CircularProgress size={40}></CircularProgress>}
              {routesList && routesListStatus === 'succeeded' && (
                <List disablePadding component="nav" sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      textAlign: 'left',
                      mb: 1,
                      pl: 2,
                      borderBottom: '2px solid',
                      borderColor: 'primary.main',
                      pb: 0.5,
                    }}
                  >
                    Маршруты
                  </Typography>

                  {routesList.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="Нет маршрутов" />
                    </ListItem>
                  ) : (
                    routesList.map((route) => {
                      const isExpanded = expandedId === route.id;
                      const isSelected = selectedRoute?.id === route.id;

                      return (
                        <React.Fragment key={route.id}>
                          <ListItem
                            button
                            alignItems="flex-start"
                            onClick={() => {
                              // 1. Загружаем детали для карты (всегда)
                              dispatch(fetchRouteDetail(route.id));
                              // 2. Переключаем аккордеон локально
                              setExpandedId((prev) => (prev === route.id ? null : route.id));
                            }}
                            sx={(theme) => ({
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease',
                              '&:hover': { bgcolor: 'action.hover' },
                              '&.Mui-selected, &:hover': {
                                // Выделение при hover/selected — для удобства
                                bgcolor: isExpanded || isSelected 
                                  ? alpha(theme.palette.primary.main, 0.08) 
                                  : undefined,
                              },
                            })}
                          >
                            <ListItemAvatar>
                              <Avatar
                                alt={route.title}
                                sx={{
                                  bgcolor:
                                    route.difficulty === 'Легкий'
                                      ? 'green'
                                      : route.difficulty === 'Средний'
                                      ? 'orange'
                                      : 'red',
                                }}
                              >
                                {route.durationHours}ч
                              </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                              primary={route.title}
                              secondary={
                                <React.Fragment>
                                  <Typography component="span" variant="body2" sx={{ color: 'text.primary', display: 'inline' }}>
                                    {route.durationHours} часов • {route.difficulty}
                                  </Typography>
                                  {route.description && ` — ${route.description}`}
                                </React.Fragment>
                              }
                            />

                            {/* Иконка раскрытия */}
                            {isExpanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon />}
                          </ListItem>

                          {/* === Аккордеон: детали маршрута === */}
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ pl: 9, pr: 2, pb: 2 }}>
                              <Divider sx={{ my: 1 }} />

                              {/* Показываем, пока грузятся детали */}
                              {routeDetailStatus === 'loading' && selectedRoute?.id === route.id && (
                                <Box display="flex" justifyContent="center" my={2}>
                                  <CircularProgress size={24} />
                                </Box>
                              )}

                              {/* Готовые детали */}
                              {routeDetailStatus === 'succeeded' && selectedRoute?.id === route.id && (
                                <>
                                  {selectedRoute.description && (
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                      {selectedRoute.description}
                                    </Typography>
                                  )}

                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    📍 Этапы ({selectedRoute.stops.length}):
                                  </Typography>

                                  {selectedRoute.stops.length > 0 ? (
                                    <List dense disablePadding>
                                      {selectedRoute.stops.map((stop, i) => (
                                        <ListItem key={i} sx={{ py: 0.5 }}>
                                          <ListItemIcon>
                                            <Box
                                              sx={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                fontSize: '0.75rem',
                                                flexShrink: 0,
                                              }}
                                            >
                                              {i + 1}
                                            </Box>
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={stop.pointOfInterest?.name || `Точка ${i + 1}`}
                                            secondary={stop.note}
                                          />
                                        </ListItem>
                                      ))}
                                    </List>
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      Этапы отсутствуют.
                                    </Typography>
                                  )}

                                  {/* Можно добавить кнопку "Начать маршрут" и т.д. */}
                                </>
                              )}
                            </Box>
                          </Collapse>
                        </React.Fragment>
                      );
                    })
                  )}
                </List>
              )}
          </Box>
        </Box>
      </Box>
    </>
  );
}