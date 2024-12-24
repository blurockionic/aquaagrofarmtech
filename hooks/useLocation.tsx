import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

type UseLocationProps = {};

const useLocation = (props: UseLocationProps) => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [longitude, setLongitude] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);

  const getUserLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get the current location
      const location = await Location.getCurrentPositionAsync({});
      if (location.coords) {
        setLongitude(location.coords.longitude);
        setLatitude(location.coords.latitude);
      }

      // Reverse geocode the current location
      const response = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

    //   console.log("Reverse Geocode Response:", response);
    } catch (error) {
      console.error("Error fetching user location:", error);
      setErrorMsg("An error occurred while fetching location data");
    }
  };

  useEffect(() => {
    // Initial fetch
    getUserLocation();

    // Set interval to update location every 30 seconds
    const intervalId = setInterval(() => {
      getUserLocation();
    }, 30000); // 30 seconds

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return { latitude, longitude, errorMsg };
};

export default useLocation;
