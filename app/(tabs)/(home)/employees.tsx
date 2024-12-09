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

const Employees = () => {
  const [employees, setEmployees] = useState([]); // State to store employee data
  const [input, setInput] = useState(""); // State for the search input
  const router = useRouter(); // Router hook for navigation

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/employee/all`);
        
        const fetchedEmployees = response.data || []; // Fallback to an empty array if undefined
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setEmployees([]); // Ensure state is always defined
      }
    };
    fetchEmployeeData();
  }, []);


  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          marginHorizontal: 10,
        }}
      >
        {/* Search bar and add button */}
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 40,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ marginLeft: 10 }}
            name="search1"
            size={20}
            color="black"
          />
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            style={{ flex: 1 }}
            placeholder="Search"
          />
          {employees.length > 0 && (
            <Pressable onPress={() => router.push("/(home)/adddetails")}>
              <AntDesign name="pluscircle" size={30} color="#0072b1" />
            </Pressable>
          )}
        </Pressable>
      </View>

      {employees.length > 0 ? (
        <View>
          {employees
            .filter((employee) =>
              employee?.userId?.fullName
                ?.toLowerCase()
                .includes(input.toLowerCase())
            )
            .map((employee) => (
              <Pressable
                key={employee._id}
                onPress={() => router.push(`/employee/${employee.userId._id}`)}
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: "#E0E0E0",
                }}
              >
                <View className="p-4 flex flex-row items-center gap-4">
                  <View className="bg-blue-800 px-5 py-4 flex flex-row rounded-md">
                    <Text className="text-white text-lg">
                      {employee.userId.fullName.charAt(0)}
                    </Text>
                  </View>
                  <View className="flex flex-cols">
                    <Text className="text-lg">{employee.userId.fullName}</Text>
                    <Text className="text-gray text-sm">
                      {employee.userId.role} ({employee.userId._id})
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image source={images.noResult} className="w-40 h-40" />
          <Text>No employees found</Text>
          <Text>Press on the plus button and add your Employee</Text>
          <Pressable onPress={() => router.push("/(home)/adddetails")}>
            <AntDesign
              style={{ marginTop: 30 }}
              name="pluscircle"
              size={40}
              color="black"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Employees;

const styles = StyleSheet.create({});
