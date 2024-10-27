import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useLocation } from "../../context/LocationContext";

delete L.Icon.Default.prototype._getIconUrl;

const customIcon = new L.Icon({
  iconUrl: "/marker.png",
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const AddPin = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const LeafletMap = ({ pins, handleMapClick, selectedPin, setSelectedPin }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (selectedPin && mapRef.current) {
      mapRef.current.setView([selectedPin.lat, selectedPin.lng], 15, {animate: true});
    }
  }, [selectedPin]);

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={6}
      style={{ height: "91dvh", width: "100%" }}
      //   whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <AddPin onClick={handleMapClick} />
      {pins.map((pin, index) => (
        <Marker
          key={index}
          position={[pin.lat, pin.lng]}
          icon={customIcon}
          eventHandlers={{
            click: () => {
              setSelectedPin(pin);
            },
          }}
        />
      ))}
    </MapContainer>
  );
};

const MapWithPins = () => {
  const { pins, setPins, selectedPin, setSelectedPin } = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPin, setNewPin] = useState(null);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("pins", JSON.stringify(pins));
  }, [pins]);

  const handleMapClick = (latlng) => {
    setNewPin({ lat: latlng.lat, lng: latlng.lng });
    setDialogOpen(true);
  };

  const handleDialogSubmit = async () => {
    if (newPin && remark) {
      let address = "";
      setLoading(true);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${newPin.lat}&lon=${newPin.lng}&format=json`
        );
        address = response.data.display_name || "Address not found";
      } catch (error) {
        console.error("Error fetching address:", error);
        address = "Address not found";
      }

      setPins((prevPins) => [...prevPins, { ...newPin, remark, address }]);
    }
    setDialogOpen(false);
    setNewPin(null);
    setRemark("");
    setLoading(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <LeafletMap
        pins={pins}
        handleMapClick={handleMapClick}
        selectedPin={selectedPin}
        setSelectedPin={setSelectedPin}
      />

      <Dialog open={dialogOpen} onClose={() => {if(!loading) setDialogOpen(false)}}>
        <DialogTitle>Add a Remark</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Remark"
            type="text"
            fullWidth
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDialogSubmit}
            color="primary"
            disabled={loading}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MapWithPins;
