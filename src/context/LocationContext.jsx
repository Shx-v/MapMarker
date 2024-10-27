import React, { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [pins, setPins] = useState(
    JSON.parse(localStorage.getItem("pins")) || []
  );
  const [selectedPin, setSelectedPin] = useState(null);

  return (
    <LocationContext.Provider
      value={{ pins, setPins, selectedPin, setSelectedPin }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
