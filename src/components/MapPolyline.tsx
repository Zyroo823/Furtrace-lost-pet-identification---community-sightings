import React, { useEffect, useRef } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface MapPolylineProps {
  path: { lat: number; lng: number }[];
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  geodesic?: boolean;
}

export const MapPolyline: React.FC<MapPolylineProps> = ({
  path,
  strokeColor = '#F59E0B',
  strokeOpacity = 0.8,
  strokeWeight = 2,
  geodesic = true
}) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const lineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !mapsLib || path.length < 2) return;

    const polyline = new mapsLib.Polyline({
      map,
      path,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      geodesic
    });

    lineRef.current = polyline;

    return () => {
      polyline.setMap(null);
    };
  }, [map, mapsLib, path, strokeColor, strokeOpacity, strokeWeight, geodesic]);

  return null;
};
