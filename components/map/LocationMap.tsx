"use client";

import { useRef, useEffect } from "react";
import type { Map as MapLibreMap, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Future City (المستقبل سيتي), New Cairo — [lng, lat]
const DEFAULT_CENTER: [number, number] = [31.497, 30.019];
const DEFAULT_ZOOM = 13;

// Satellite imagery style (ESRI World Imagery — no API key)
const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "© Esri",
    },
  },
  layers: [
    {
      id: "satellite-layer",
      type: "raster",
      source: "satellite",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

export function LocationMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    async function initMap() {
      const maplibregl = (await import("maplibre-gl")).default;

      if (!containerRef.current) return;
      if (mapRef.current) return; // already initialized

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: SATELLITE_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      mapRef.current = map;
    }

    initMap();
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-navy/10">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
