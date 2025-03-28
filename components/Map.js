"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { DEFAULT_CENTER } from "@/util/constants";

const Map = ({
  onPositionChanged,
  draggable = true,
  markers = null,
  location = null,
}) => {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState(DEFAULT_CENTER);

  useEffect(() => {
    setMounted(true);
  }, []);

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend: () => {
        const marker = markerRef.current;
        if (marker != null) {
          onPositionChanged(marker.getLatLng());
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  if (!mounted) return null;

  const {
    Circle,
    MapContainer,
    Marker,
    TileLayer,
    Tooltip,
  } = require("react-leaflet");

  let theMarkers = [
    <Marker
      key="marker"
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />,
  ];
  if (markers != null) {
    theMarkers = markers.map((guess) => (
      <Circle
        key={JSON.stringify(guess)}
        center={JSON.parse(guess.coords)}
        pathOptions={{ fillColor: "blue" }}
        radius={1}
      >
        <Tooltip direction="top" opacity={1} permanent>
          {guess.teamNum}
        </Tooltip>
      </Circle>
    ));
    if (location != null) {
      theMarkers.push(
        <Circle
          key="sln"
          center={JSON.parse(location)}
          pathOptions={{ fillColor: "blue" }}
          radius={1}
        >
          <Tooltip direction="top" opacity={1} permanent>
            <div style={{ color: "gold", fontSize: 20 }}>★</div>
          </Tooltip>
        </Circle>
      );
    }
  }

  return (
    <>
      <MapContainer
        style={{ height: "400px" }}
        center={DEFAULT_CENTER}
        zoom={2}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {theMarkers}
      </MapContainer>
    </>
  );
};

export default Map;
