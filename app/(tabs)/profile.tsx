import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ApiUrl } from "@/config/ServerConnection";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import moment from "moment";
import { DataTable } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";

type Props = {};

const Profile = (props: Props) => {
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState(moment());
  const [employeeId, setEmployeeId] = useState("");
  // State to track which section is expanded
  const [selectedTab, setSelectedTab] = useState(null); // State to track selected tab

  const [employee, setEmployee] = useState<any>([]);

  console.log(user?.id);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/auth/me/${user?.id}`); // Use the id to fetch employee data
        setEmployee(response.data.user);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    if (user?.id) {
      fetchEmployeeDetails();
    }
  }, [user?.id]);

  // if (!employee) {
  //   return <Text>Loading...</Text>;
  // }

  // Toggle section expansion

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex flex-row items-center justify-between pr-5">
        <View className=" p-4 flex  flex-row items-center gap-4">
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              padding: 10,
              backgroundColor: "#4b6cb7",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              {employee?.employeeName?.charAt(0)}
            </Text>
          </View>
          <View className=" flex flex-cols">
            <Text className="text-lg">{employee?.employeeName}</Text>
            <Text className="text-gray text-sm">
              {employee?.designation} ({employee?.employeeId})
            </Text>
          </View>
        </View>
        <Ionicons name="settings-outline" size={24} color="black" />
      </View>
      {/* details of employee  */}
      <View>
        {/* Top Tab Section */}

        {/* Toggleable Content */}

        <ScrollView className="h-screen mb-52 mx-5 p-4 bg-white rounded-md shadow-md">
          <View
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              borderRadius: 10,
              padding: 15,
              marginTop: 20,
            }}
          >
            <Text
              style={{ fontSize: 14, fontWeight: "bold" }}
              className="text-center"
            >
              Login Credential
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Email</Text>

            <TextInput
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="email"
              placeholderTextColor={"black"}
              value={employee?.email}
              editable={false} // Making the field non-editable
            />
          </View>

          {/* Employee Details Section */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              borderRadius: 10,
              padding: 15,
              marginTop: 20,
            }}
            className="mb-10"
          >
            <Text
              style={{ fontSize: 14, fontWeight: "bold" }}
              className="text-center"
            >
              Employee Details
            </Text>

            <View style={{ marginVertical: 14 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Full Name
              </Text>
              <TextInput
                value={employee?.employeeName}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Enter your full name"
                placeholderTextColor={"black"}
                editable={false} // Making the field non-editable
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Employee Id
              </Text>
              <TextInput
                value={employee?.employeeId}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Employee Id"
                placeholderTextColor={"black"}
                editable={false} // Making the field non-editable
              />
            </View>

            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Designation
              </Text>
              <TextInput
                value={employee?.designation}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Designation"
                placeholderTextColor={"black"}
                editable={false} // Making the field non-editable
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Mobile Number
              </Text>
              <TextInput
                value={employee?.phoneNumber}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Mobile No"
                placeholderTextColor={"black"}
                editable={false} // Making the field non-editable
              />
            </View>

            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Date of Birth
              </Text>
              <TextInput
                value={employee?.dateOfBirth}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Enter Date of Birth"
                placeholderTextColor={"black"}
                editable={false} // Making the field non-editable
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Joining Date
              </Text>
              <TextInput
                value={employee?.joiningDate}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Joining Date"
                placeholderTextColor={"black"}
                editable={false} // Making the field non-editable
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text>Active Employee</Text>
              <Text>True</Text>
            </View>

            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>Salary</Text>
              <TextInput
                value={employee?.salary}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Enter Salary"
                placeholderTextColor={"black"}
                editable={false} // Making the field non-editable
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>Address</Text>
              <TextInput
                value={employee?.address}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Enter Address"
                placeholderTextColor={"black"}
                editable={false} // Making the field non-editable
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default Profile;
