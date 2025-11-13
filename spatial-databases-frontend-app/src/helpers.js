// src/lib/ymaps.js
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// 🔥 top-level await
const [ymaps3Reactify, clustererModule, hintModule, defaultUITheme] = await Promise.all([
  ymaps3.import('@yandex/ymaps3-reactify'),
  ymaps3.import('@yandex/ymaps3-clusterer@0.0.1'),
  ymaps3.import('@yandex/ymaps3-hint@0.0.1'),
  ymaps3.import('@yandex/ymaps3-markers@0.0.1'),
  ymaps3.ready,
]);

// Передаём React и ReactDOM в reactify
export const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM);

// Экспортируем компоненты
export const {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapZoomControl,
  YMapContainer, 
  YMapListener
} = reactify.module(ymaps3);

export const { YMapClusterer, clusterByGrid } = reactify.module(clustererModule);
export const { YMapHint, YMapHintContext } = reactify.module(hintModule);
export const {YMapDefaultMarker} = reactify.module(defaultUITheme);

export const features = [
  {
    id: "1",
    style: {
      fillRule: "nonZero",
      fill: "var(--map-no-data-color)",
      fillOpacity: 0.6,
      stroke: [
        {
          color: "var(--map-no-data-color)",
          width: 5,
        },
      ],
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [37.8, 55.8],
          [37.8, 55.75],
          [37.9, 55.75],
          [37.9, 55.8],
        ],
      ],
    },
    properties: { hint: "Polygon 1" },
  },
  {
    id: "2",
    style: {
      fillRule: "nonZero",
      fill: "var(--map-success-color)",
      fillOpacity: 0.6,
      stroke: [
        {
          color: "var(--map-success-color)",
          width: 5,
        },
      ],
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [37.9, 55.8],
          [37.9, 55.75],
          [38.0, 55.75],
          [38.0, 55.8],
        ],
      ],
    },
    properties: { hint: "Polygon 2" },
  },
  {
    id: "3",
    style: {
      fillRule: "nonZero",
      fill: "var(--map-danger-color)",
      fillOpacity: 0.6,
      stroke: [
        {
          color: "var(--map-danger-color)",
          width: 5,
        },
      ],
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [38.0, 55.8],
          [38.0, 55.75],
          [38.1, 55.75],
          [38.1, 55.8],
        ],
      ],
    },
    properties: { hint: "Polygon 3" },
  },
];

export const location = { center: [37.95, 55.65], zoom: 7.5 };
// apikey is only for codesandbox.io and xk3d74.csb.app
export const apiKey = "6e7307ec-53ac-494a-991c-644146849367";

export const points = [
  {
    type: "Feature",
    id: "0",
    geometry: {
      type: "Point",
      coordinates: [30.300838, 59.985512],
    },
    properties: {
      name: 'marker',
      description: ''
    }
  },
];