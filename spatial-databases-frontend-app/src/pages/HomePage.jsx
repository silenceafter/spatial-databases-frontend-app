import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
/*import { apiKey, YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapZoomControl, YMapContainer,
  YMapListener, YMapDefaultMarker,
reactify, YMapClusterer, clusterByGrid, YMapHint, YMapHintContext } from '../helpers';*/
import { Box, Button, Drawer, Grid, Avatar, List, ListItem, Divider, ListItemAvatar, Tab, Tabs, TextField, FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio,
  ListItemIcon, Autocomplete, 
  ListItemText, ListItemButton, Toolbar, Typography, Collapse, Slider,
  CircularProgress,
  FormControl,
  FormLabel} from '@mui/material';
/*import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';*/
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { YMaps, Map, Placemark, Polyline } from '@pbe/react-yandex-maps';
import { fetchRoutesList, fetchRouteDetail, fetchRouteGeometry } from '../store/slices/routesSlice';
import { fetchPoisList } from '../store/slices/poisSlice';
import { alpha } from '@mui/material/styles';

import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const drawerWidth = 360;

function pluralizeHours(n) {
  // Берём остаток от деления на 100, чтобы отсечь сотни (111 → 11, 213 → 13)
  const num = Math.abs(n) % 100;
  // Если 11–14 — всегда "часов"
  if (num >= 11 && num <= 14) {
    return 'часов';
  }
  // Смотрим последнюю цифру
  const lastDigit = num % 10;
  if (lastDigit === 1) {
    return 'час';
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'часа';
  }
  return 'часов';
}

export default function HomePage() {
  const dispatch = useDispatch();

  //стейты
  const [expandedId, setExpandedId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selected, setSelected] = useState([]);
  const [poiMode, setPoiMode] = useState(false);
  const [routeMode, setRouteMode] = useState(true);
  const [tabValue, setTabValue] = useState(0); // 0 = "Маршруты", 1 = "Фильтры"

  //селекторы
  const routesList = useSelector((state) => state.routes.list);
  const routesListStatus = useSelector((state) => state.routes.routesListStatus);
  //const routesListError = useSelector((state) => state.routes.routesListError);
  const selectedRoute = useSelector((state) => state.routes.selectedRoute);
  const routeDetailStatus = useSelector((state) => state.routes.routeDetailStatus);
  //const routeDetailError = useSelector((state) => state.routes.routeDetailError);
  const routeGeometry = useSelector((state) => state.routes.geometry);
  const routeGeometryStatus = useSelector((state) => state.routes.geometryStatus);

  const poisList = useSelector((state) => state.pois.list);
  const poisListStatus = useSelector((state) => state.pois.poisListStatus);

  //рефы
  const mapRef = useRef(null);

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

  useEffect(() => {
    if (
      routeDetailStatus === 'succeeded' &&
      selectedRoute?.stops.length > 0 &&
      mapRef.current
    ) {
      const first = selectedRoute.stops[0].pointOfInterest;
      mapRef.current.setCenter(
        [first.latitude, first.longitude],
        14, // zoom
        { duration: 500, flying: true }
      );
    }
  }, [routeDetailStatus, selectedRoute]);

  useEffect(() => {
    if (tabValue === 0) {
      setPoiMode(false);
      setRouteMode(true);
    } else if (tabValue === 1) {
      setPoiMode(true);
      setRouteMode(false);
    }
  }, [tabValue]);

const handleTabChange = (event, newValue) => {
  setTabValue(newValue);
};

const toggle = (cat) => {
  setSelected(prev =>
    prev.includes(cat)
      ? prev.filter(c => c !== cat)   // удалить
      : [...prev, cat]                 // добавить
  );
};
const categories = [
  'Арт-объект', 'Археологический памятник', 'Дворец', 'Дворец/замок',
  'Достопримечательность', 'Крепость', 'Мост', 'Музей',
  'Объект наследия', 'Памятник', 'Парк', 'Смотровая площадка',
  'Усадьба', 'Храм'
];


  //
  return (
    <>
    {console.log(poiMode)}
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
          <Tabs
            value={tabValue}
            variant="fullWidth"
            onChange={handleTabChange}
            aria-label="simple tabs"
          >
            <Tab label="Маршруты" />
            <Tab label="Карта" />            
          </Tabs>

        {tabValue === 0 && (
          <>
            <Accordion defaultExpanded 
              elevation={3} 
              sx={{ bgcolor: 'white', color: 'white', width: '100%', overflow: 'hidden', flexShrink: 0 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ backgroundColor: "primary.main", }}
              >
                <Typography component="span">Рекомендации</Typography>
              </AccordionSummary>
              <AccordionDetails 
                sx={{ 
                  padding: 0, 
                  overflow: 'auto', 
                  minHeight: '360px', 
                  maxHeight: '625px', 
                  color: 'black', 
                  m:0,
                  p:3,
                  paddingBottom: 0 
                }}
              >
                {routesList && routesListStatus === 'succeeded' && (
                  <>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={routesList?.[0]?.title || ''}
                        name="radio-buttons-group"
                        sx={{ gap: 1 }}
                      >                      
                        {routesList.map((route) => {                  
                          return (
                            <FormControlLabel 
                              control={<Radio size="small" />}
                              onChange={() => {
                                dispatch(fetchRouteDetail(route.id));
                              }}
                              value={route.title} 
                              label={route.title} 
                              sx={{ textAlign: 'left' }} 
                            />
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <Button variant="contained" fullWidth sx={{ mt: 2}}>Показать</Button>
                  </>
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded 
              elevation={3} 
              sx={{ bgcolor: 'white', color: 'white', width: '100%', overflow: 'hidden', flexShrink: 0 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ backgroundColor: "primary.main", }}
              >
                <Typography component="span">Мой маршрут</Typography>
              </AccordionSummary>
              <AccordionDetails 
                sx={{ 
                  padding: 0, 
                  overflow: 'auto', 
                  minHeight: '360px', 
                  maxHeight: '625px', 
                  color: 'black', 
                  m:0,
                  p:3,
                  paddingBottom: 0 
                }}
              >
                <Autocomplete
                  disablePortal
                  options={[{code: 1, label: '123'}, {code: 2, label: '456'}]}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Объект" size="small" />}
                />
                <Button variant="contained" fullWidth sx={{ mt: 2}}>Добавить точку</Button>
              </AccordionDetails>
            </Accordion>
          </>
        )}
        {tabValue === 1 && (<>
          <Accordion defaultExpanded 
            elevation={3} 
            sx={{ bgcolor: 'white', color: 'white', width: '100%', overflow: 'hidden', flexShrink: 0 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{ backgroundColor: "primary.main", }}
            >
              <Typography component="span">Категории объектов</Typography>
            </AccordionSummary>
            <AccordionDetails 
              sx={{ 
                padding: 0, 
                overflow: 'auto', 
                minHeight: '360px', 
                maxHeight: '625px', 
                color: 'black', 
                m:0,
                p:3,
                paddingBottom: 0 
              }}
            >
              <FormGroup>
                {categories.map(cat => (
                  <FormControlLabel 
                    key={cat}
                    control={
                      <Checkbox 
                        size="small"
                        checked={selected.includes(cat)}
                        onChange={() => toggle(cat)}
                      />
                    } 
                    label={cat} 
                  />
                ))}                                
              </FormGroup>
            </AccordionDetails>
          </Accordion>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'flex-start',
              pt: 2,
              pl: 4,
              pr: 4, 
              gap: 1,
            }}
          >
            <Typography   
              variant="body1"
              component="label"
              sx={{
                textAlign: 'left',
                fontWeight: 500,
                mb: 1,            
                display: 'block',   
              }}
            >
              Количество точек
            </Typography>
            <Slider
              aria-label="QuantityPoints"
              defaultValue={10}              
              valueLabelDisplay="auto"
              shiftStep={30}
              step={10}
              marks
              min={10}
              max={110}
              sx={{ mb: 0 }}
            />
            <Button 
              variant="contained"
              onClick={() => {
                dispatch(fetchPoisList({ categories: selected, limit: 10 }));
              }}
            >
              Показать
            </Button>
          </Box></>
        )}
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
                <Map 
                  defaultState={{ center: [59.9386, 30.3141], zoom: 12 }} 
                  height="100vh" 
                  width="100vw" 
                  instanceRef={(map) => { 
                    mapRef.current = map; 
                  }}
                >
                  {routeDetailStatus === 'succeeded' && routeMode &&
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
                      onClick={() => {
                        if (mapRef.current) {
                          [stop.pointOfInterest.latitude, stop.pointOfInterest.longitude],
                          { duration: 300, flying: true }
                        }
                      }}
                    />                    
                    ))
                  }
                  {routeGeometryStatus === 'succeeded' && routeMode && routeGeometry && routeGeometry.length > 2 &&
                   <Polyline
                    geometry={routeGeometry}
                    options={{
                      balloonCloseButton: false,
                      strokeColor: "#000",
                      strokeWidth: 4,
                      strokeOpacity: 0.5,
                    }}
                  />}

                  {poisListStatus === 'succeeded' && poiMode && poisList?.length > 0 && (
                    poisList.map((poi, index) => (
                      <Placemark 
                        key={`${poi.id}-${index}`}
                        geometry={[poi.latitude, poi.longitude]} 
                        properties={{
                          iconContent: `${index + 1}`,
                          hintContent: `${poi.name}`,
                          balloonContent: `<b>${poi.name}</b><br>`
                        }}
                        options={{
                          preset: 'islands#blueStretchyIcon',
                        }}
                        modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                        onClick={() => {
                          if (mapRef.current) {
                            [poi.latitude, poi.longitude],
                            { duration: 300, flying: true }
                          }
                        }}
                      />
                    ))
                  )}

                  {/*routeGeometryStatus === 'succeeded' && 
                    routeDetailStatus === 'succeeded' &&
                    routeGeometry?.length > 2 && (
                      <Polyline
                        geometry={routeGeometry}
                        options={{
                          strokeColor: "#000",
                          strokeWidth: 4,
                          strokeOpacity: 0.5,
                        }}
                      />
                  )*/}
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
              overflow: isExpanded ? 'auto' : 'hidden',
              maxHeight: isExpanded ? `calc(100vh - 100px)` : 40, 
              opacity: isExpanded ? 1: 0.9,
            }}
          >
             <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                zIndex: 10,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {isExpanded ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            {routesListStatus === 'loading' && <CircularProgress size={40}></CircularProgress>}
              {routesList && routesListStatus === 'succeeded' && (
                <List disablePadding component="nav" sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', transition: 'opacity 0.2s' }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    onClick={() => setIsExpanded(prev => !prev)}
                    sx={{
                      cursor: 'pointer',
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
                    Маршрут
                  </Typography>

                  {routesList.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="Нет маршрутов" />
                    </ListItem>
                  ) : (
                        selectedRoute && <React.Fragment key={selectedRoute.id}>
                          <ListItem
                            button
                            alignItems="flex-start"
                            onClick={() => {
                              // 1. Загружаем детали для карты (всегда)
                              /*dispatch(fetchRouteDetail(selectedRoute.id));
                              // 2. Переключаем аккордеон локально
                              setExpandedId((prev) => (prev === selectedRoute.id ? null : selectedRoute.id));*/
                              setIsExpanded(prev => !prev);
                            }}
                            sx={(theme) => ({
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease',
                              '&:hover': { bgcolor: 'action.hover' },
                              '&.Mui-selected, &:hover': {
                                // Выделение при hover/selected — для удобства
                                bgcolor: isExpanded 
                                  ? alpha(theme.palette.primary.main, 0.08) 
                                  : undefined,
                              },
                            })}
                            selected={true}
                          >
                            <ListItemAvatar>
                              <Avatar
                                alt={selectedRoute.title}
                                sx={{
                                  bgcolor:
                                    selectedRoute.durationHours < 2
                                      ? 'green'
                                      : selectedRoute.durationHours >= 2
                                      ? 'orange'
                                      : 'red',
                                }}
                              >
                                {selectedRoute.durationHours}ч
                              </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                              primary={selectedRoute.title}
                              secondary={
                                <React.Fragment>
                                  <Typography component="span" variant="body2" sx={{ color: 'text.primary', display: 'inline' }}>
                                    {selectedRoute.durationHours} {pluralizeHours(selectedRoute.durationHours)}
                                  </Typography>
                                  {selectedRoute.description && ` — ${selectedRoute.description}`}
                                </React.Fragment>
                              }
                            />

                            {isExpanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon />}
                          </ListItem>

                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ pl: 9, pr: 2, pb: 2 }}>
                              <Divider sx={{ my: 1 }} />

                              {routeDetailStatus === 'loading' && (
                                <Box display="flex" justifyContent="center" my={2}>
                                  <CircularProgress size={24} />
                                </Box>
                              )}

                              {routeDetailStatus === 'succeeded' && (
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
                                </>
                              )}
                            </Box>
                          </Collapse>
                        </React.Fragment>
                  )}
                </List>
              )}
          </Box>
        </Box>
      </Box>
    </>
  );
}