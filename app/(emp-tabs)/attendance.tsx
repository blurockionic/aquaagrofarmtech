import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { images } from "@/constants";
import { ApiUrl } from "@/config/ServerConnection";
import AttendanceInCalender from "@/components/attendance/AttendanceInCalender";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Attendance = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]); // Initialize as an array
  const router = useRouter();
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
    if (user) {
      fetchEmployeeDetails();
    }
  }, [user]);

  console.log(user.id);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/employee/${user.id}`);

      console.log(response.data, "hiii");

      const employeeData = response.data?.employee || [];
      setEmployees(employeeData);

      if (employeeData.length > 0) {
        setEmployeeId(employeeData[0].employeeId);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AttendanceInCalender employeeId={employeeId} />
    </View>
  );
};

export default Attendance;

const styles = StyleSheet.create({});
