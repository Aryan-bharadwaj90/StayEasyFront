import { useEffect, useRef } from "react";

const DAY_THEME = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [{ visibility: "on" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4d4d4d" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ lightness: 100 }, { visibility: "simplified" }]
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

export default function Map({ center, draggable = false, onDragEnd }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps JS API not loaded");
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      styles: DAY_THEME
    });

    const marker = new window.google.maps.Marker({
      position: center,
      map,
      draggable
    });

    if (draggable && onDragEnd) {
      marker.addListener("dragend", () => {
        const pos = marker.getPosition();
        onDragEnd({ lat: pos.lat(), lng: pos.lng() });
      });
    }

    markerRef.current = marker;

    return () => {
      // Clean up map & marker
      window.google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    };
  }, [center.lat, center.lng]);

  return <div ref={mapRef} style={{ width: "100%", height: "300px" }} />;
}
