import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import axios from "axios";


const Home = () => {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    fetchUser();
  }, []);


  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startLocationUpdates = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        // Start real-time location tracking
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // Update every second
            distanceInterval: 1, // Update when user moves at least 1 meter
          },
          (loc) => {
            setLocation(loc.coords);
            console.log(
              `Updated Location: ${loc.coords.latitude}, ${loc.coords.longitude}`
            );
          }
        );
      } catch (error) {
        console.error("Error starting location updates:", error);
      }
    };

    startLocationUpdates();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  useEffect(() => {
    const updateLocationToServer = async () => {
      if (location && user) {
        try {
          await axios.put(`${ApiUrl}/location/update/${user.id}`, {
            location: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          });
          console.log("Location updated to server successfully");
        } catch (error) {
          console.error("Error updating location to server:", error);
        }
      }
    };

    // Update location every 15 minutes
    const intervalId = setInterval(() => {
      updateLocationToServer();
    }, 1000); // 1000 ms = 1 second

    return () => clearInterval(intervalId);
  }, [location, user]);

  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Redirect
      href={user.role === "admin" ? "/(tabs)/home" : "/(emp-tabs)/home"}
    />
  );
};

export default Home;
