import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';

const center = {
    lat: 51.505,
    lng: -0.09,
};

const Map = ({onPositionChanged, draggable=true, markers=null, location=null }) => {
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState(center);

    useEffect(() => {
        setMounted(true);
    }, []);

    const markerRef = useRef(null);
    const eventHandlers = useMemo(() => ({
        dragend: () => {
            const marker = markerRef.current;
            if (marker != null) {
                onPositionChanged(marker.getLatLng());
                setPosition(marker.getLatLng());
            }
        },
    }), []);

    if (!mounted) return null;

    const { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } = require('react-leaflet');

    let theMarkers = [
        <Marker
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    ];
    if (markers != null) {
        theMarkers = markers.map(guess => (
            <Circle key={JSON.stringify(guess)} center={JSON.parse(guess.coords)} pathOptions={{ fillColor: 'blue' }} radius={1}>
                <Tooltip direction="top" opacity={1} permanent>
                    {guess.teamNum}
                </Tooltip>
            </Circle>
        ))
        if (location != null) {
            theMarkers.push(
                <Circle center={JSON.parse(location)} pathOptions={{ fillColor: 'blue' }} radius={1}>
                    <Tooltip direction="top" opacity={1} permanent>
                        <div style={{color: 'gold', fontSize: 20}}>★</div>
                    </Tooltip>
                </Circle>
            )
        }
    }

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                    crossorigin=""/>
                <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
                    crossorigin="" />
            </Head>
            <MapContainer style={{height: '400px'}} center={[51.505, -0.09]} zoom={2}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {theMarkers}
            </MapContainer>
        </>
    );
};

export default Map;
