
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// Custom marker icon
const locationIcon = L.divIcon({
  className: "jansetu-map-marker",
  html: '<div class="jansetu-marker-pin"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Handles map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

// Moves map when coordinates change
function MapCenterUpdater({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== "" && longitude !== "") {
      map.setView([Number(latitude), Number(longitude)], 16);
    }
  }, [latitude, longitude, map]);

  return null;
}

function LocationPicker({ latitude, longitude, onLocationSelect }) {
  const hasCoordinates =
    latitude !== "" &&
    longitude !== "" &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude));

  const markerPosition = hasCoordinates
    ? [Number(latitude), Number(longitude)]
    : null;

  const defaultCenter = [18.5204, 73.8567]; // Pune

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSelect(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        alert("Unable to get your location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="location-picker">
      <div className="location-picker-header">
        <div>
          <h4>Select Complaint Location</h4>
          <p>Click on the map or drag the marker to select a location.</p>
        </div>

        <button
          type="button"
          className="current-location-btn"
          onClick={handleCurrentLocation}
        >
          <span>◎</span> Use My Location
        </button>
      </div>

      <MapContainer
        center={markerPosition || defaultCenter}
        zoom={markerPosition ? 16 : 12}
        scrollWheelZoom={true}
        className="complaint-location-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onLocationSelect={onLocationSelect} />

        <MapCenterUpdater
          latitude={latitude}
          longitude={longitude}
        />

        {markerPosition && (
          <Marker
            position={markerPosition}
            icon={locationIcon}
            draggable={true}
            eventHandlers={{
              dragend: (event) => {
                const position = event.target.getLatLng();
                onLocationSelect(position.lat, position.lng);
              },
            }}
          />
        )}
      </MapContainer>

      <div className="selected-location-info">
        {hasCoordinates ? (
          <>
            <span className="location-selected-dot"></span>
            <span>
              Selected: {Number(latitude).toFixed(6)},{" "}
              {Number(longitude).toFixed(6)}
            </span>
          </>
        ) : (
          <span>Click anywhere on the map to select the complaint location.</span>
        )}
      </div>
    </div>
  );
}

export default LocationPicker;
