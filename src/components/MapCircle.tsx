import React, { useEffect, useRef } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface MapCircleProps {
  center: { lat: number; lng: number };
  radius: number;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  onClick?: () => void;
}

export const MapCircle: React.FC<MapCircleProps> = ({
  center,
  radius,
  fillColor = '#10B981',
  fillOpacity = 0.2,
  strokeColor = '#10B981',
  strokeWeight = 2,
  strokeOpacity = 0.8,
  onClick
}) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map || !mapsLib || !center || typeof center.lat !== 'number' || typeof center.lng !== 'number' || isNaN(center.lat) || isNaN(center.lng)) return;

    const circle = new mapsLib.Circle({
      map,
      center: { lat: center.lat, lng: center.lng },
      radius: typeof radius === 'number' && !isNaN(radius) && radius > 0 ? radius : 300,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      clickable: !!onClick
    });

    if (onClick) {
      circle.addListener('click', onClick);
    }

    circleRef.current = circle;

    return () => {
      circle.setMap(null);
    };
  }, [map, mapsLib, center?.lat, center?.lng, radius, fillColor, fillOpacity, strokeColor, strokeWeight, strokeOpacity]);

  return null;
};
