import { apiKey, YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapZoomControl, YMapContainer,
  YMapListener, YMapDefaultMarker,
reactify, YMapClusterer, clusterByGrid, YMapHint, YMapHintContext } from "./helpers";

// Словарь названий
const NAMES = {
  'адмиралтейская': 'Адмиралтейская',
  'невский проспект': 'Невский проспект',
  'чёрная речка': 'Чёрная речка',
  'купчино': 'Купчино',
  'приморская': 'Приморская',
  'петроградская': 'Петроградская',
};

// Функция для подсветки при наведении
function useHover() {
}

function MyHint() {
  const ctx = React.useContext(YMapHintContext);
  return <div className="my-hint">{ctx && ctx.hint}</div>;
}

export default function HomePage() {
    const [mounted, setMounted] = useState(false);
  const { hoveredId, onMouseOver, onMouseOut } = useHover();
  const [hoverMarkers, setHoverMarkers] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!apiKey) {
    return <div>Ошибка: API-ключ не задан</div>;
  }

  // Функция отрисовки метки
  const marker = (feature) => {
    if (!feature?.geometry?.coordinates) return null;

    const id = feature.id;
    const isHovered = hoveredId === id;

    return (
      <YMapMarker 
        key={feature.id} 
        coordinates={feature.geometry.coordinates}
        properties={{ id: feature.id }}
        onMouseOver={() => markerMouseOver(id)}
        onMouseOut={() => markerMouseOut(id)} 
      >
        <div
          className="marker-container"
                   
          style={{
            cursor: 'pointer',
          }}
        >
          <div
            className={`marker-text ${hoverMarkers[id] ? 'visible' : 'hidden'}`}
            style={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s',
              backgroundColor: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              position: 'absolute',
              top: '-28px',
              whiteSpace: 'nowrap',
            }}
          >
            {NAMES[feature.id]}
          </div>
          <div
            className="marker"
            style={{
              width: '16px',
              height: '16px',
              background: isHovered ? 'red' : 'blue',
              borderRadius: '50%',
              border: '2px solid white',
              transition: 'background 0.2s',
            }}
          />
        </div>
      </YMapMarker>
    );
  };

  // Функция отрисовки кластера
  const cluster = (coordinates, clusterFeatures) => (
    <YMapMarker coordinates={coordinates}>
      <div
        style={{
          background: 'red',
          color: 'white',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 0 4px rgba(0,0,0,0.4)',
        }}
      >
        {clusterFeatures.length}
      </div>
    </YMapMarker>
  );

  const features = [
    { type: 'Feature', id: 'адмиралтейская', geometry: { type: 'Point', coordinates: [30.315096, 59.935979] }, properties: { name: 'marker', description: '' } },
    { type: 'Feature', id: 'невский проспект', geometry: { type: 'Point', coordinates: [30.327107, 59.935481] }, properties: { name: 'marker', description: '' } },
    { type: 'Feature', id: 'чёрная речка', geometry: { type: 'Point', coordinates: [30.300838, 59.985512] }, properties: { name: 'marker', description: '' } },
    { type: 'Feature', id: 'купчино', geometry: { type: 'Point', coordinates: [30.375456, 59.829807] }, properties: { name: 'marker', description: '' } },
    { type: 'Feature', id: 'приморская', geometry: { type: 'Point', coordinates: [30.234639, 59.948458] }, properties: { name: 'marker', description: '' } },
    { type: 'Feature', id: 'петроградская', geometry: { type: 'Point', coordinates: [30.311509, 59.966398] }, properties: { name: 'marker', description: '' } },
  ];

  const gridSizedMethod = useMemo(() => clusterByGrid({gridSize: 64}), []);
  const getHint = useCallback((object) => object && object.properties && object.properties.hint, []);

  const markerMouseOver = useCallback((id) => {
    console.log('Наведение на:', id);
    setHoverMarkers((state) => ({
        ...state,
        [id]: true
    }));
}, []);

const markerMouseOut = useCallback((id) => {
    setHoverMarkers((state) => ({
        ...state,
        [id]: false
    }));
}, []);

const markersGeoJsonSource = [
  { coordinates: [30.315096, 59.935979], title: 'Адмиралтейская', subtitle: '',
    color: 'red',
    size: 'normal',
    iconName: 'fallback' },
  { coordinates: [30.327107, 59.935481], title: 'Невский проспект', subtitle: '',
    color: 'red',
    size: 'normal',
    iconName: 'fallback' },
  { coordinates: [30.300838, 59.985512], title: 'Чёрная речка', subtitle: '',
    color: 'red',
    size: 'normal',
    iconName: 'fallback' },
  { coordinates: [30.375456, 59.829807], title: 'Купчино', subtitle: '',
    color: 'red',
    size: 'normal',
    iconName: 'fallback' },
  { coordinates: [30.234639, 59.948458], title: 'Приморская', subtitle: '',
    color: 'red',
    size: 'normal',
    iconName: 'fallback' },
  { coordinates: [30.311509, 59.966398], title: 'Петроградская', subtitle: '',
    color: 'red',
    size: 'normal',
    iconName: 'fallback' }
];

  return (
    <div className="App">
      {/*<MapLocation location={{center: [30.3158, 59.9343], zoom: 12}} />*/}
    
        {mounted && (
          
            <YMap location={{ center: [30.3158, 59.9343], zoom: 12 }} showScaleInCopyrights={true}>
              <YMapDefaultSchemeLayer />
              <YMapDefaultFeaturesLayer />

              <YMapClusterer marker={marker} cluster={cluster} method={ gridSizedMethod } features={features} />

              <YMapHint hint={getHint}>
                123
              </YMapHint>

              {markersGeoJsonSource.map((markerSource) => (
                <YMapDefaultMarker {...markerSource} />
              ))}
              
              {/*<YMapMarker coordinates={[reactify.useDefault([30.3158, 59.9343])]} />
              <YMapMarker coordinates={reactify.useDefault([59.983375, 30.248967])} draggable={true}  />*/}
            </YMap>

        )}

    </div>
  );
}