import * as Location from "expo-location";
import { Alert } from "react-native";
import { useEffect } from "react";
import axios from "axios";
import { ApiUrl } from "@/config/ServerConnection";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_LOCATION_TASK = "background-location-task"; // Task name for background updates

// Function to update location on server
const updateLocationOnServer = async (user: any, latitude: number, longitude: number) => {
  try {
    const response = await axios.post(
      `${ApiUrl}/location/create/${user?.id}`,
      {
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      }
    );
    console.log("Location updated to server successfully", response.data);
  } catch (error) {
    console.error("Error updating location on server", error);
  }
};

// Function to request permission and start background location updates
const trackUserLocation = (user: any) => {
  const getLocation = async () => {
    // Request foreground location permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Cannot access location.");
      return;
    }

    // Request background location permissions
    let { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== "granted") {
      Alert.alert("Permission Denied", "Cannot access background location.");
      return;
    }

    // Start background location updates
    Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.High,
      timeInterval: 30000, // Every 30 seconds
      distanceInterval: 10, // Every 10 meters
    });
  };

  // Register the background location task
  useEffect(() => {
    // Request permissions and start tracking
    getLocation();

    // Cleanup: stop background location updates when the component unmounts
    return () => {
      Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    };
  }, []);

  // Define the background task that will be triggered by location updates
  TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
    if (error) {
      console.error("Error in background task", error);
      return;
    }

    if (data) {
      const { latitude, longitude } = data.locations[0].coords;
      console.log("Background Location Update:", latitude, longitude);
      // Call the function to send the location data to the server
      updateLocationOnServer(user, latitude, longitude);
    }
  });
};

export default trackUserLocation;
