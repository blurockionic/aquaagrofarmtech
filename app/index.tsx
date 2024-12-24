import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import axios from "axios";
import { ApiUrl } from "@/config/ServerConnection";


const Home = () => {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      console.log("User data:", userData);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    fetchUser();
  }, []);

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
