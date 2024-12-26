import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";


const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return null; // Render nothing or a loading indicator while determining user state
  }

  return (
    <Redirect
      href={
        user?.role === "admin"
          ? "/(tabs)/home"
          : user?.role === "employee"
          ? "/(emp-tabs)/salary"
          : "/(auth)/sign-in" // Redirect to login if user is null
      }
    />
  );
};

export default Home;

