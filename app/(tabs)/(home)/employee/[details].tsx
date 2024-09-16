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

type Props = {};

const EmployeeDetails = (props: Props) => {
  const { details } = useLocalSearchParams();
  const [currentDate, setCurrentDate] = useState(moment());
  const [employeeId, setEmployeeId] = useState("");
  // State to track which section is expanded
  const [selectedTab, setSelectedTab] = useState(null); // State to track selected tab

  const [employee, setEmployee] = useState<any>([]);
  const [attendance, setAttendance] = useState<any>([]);
  const [advanceOrLoan, setAdvanceOrLoan] = useState<any>([]);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/employee/${details}`); // Use the id to fetch employee data
        setEmployee(response.data.employee);
        setEmployeeId(response.data.employee.employeeId);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    const fetchAttendanceReoportById = async () => {
      try {
        const response = await axios.get(
          `${ApiUrl}/attendance/report/${employeeId}`,
          {
            params: {
              month: currentDate.month() + 1,
              year: 2024,
            },
          }
        );
        setAttendance(response.data.report);
      } catch (error) {
        console.error("Error fetching attendance report:", error);
      }
    };
    const fetchAttendanceReoportAdvanceOrLoan = async () => {
      try {
        const response = await axios.get(
          `${ApiUrl}/attendance/advance/${employeeId}`
        );
        setAdvanceOrLoan(response.data.advance);
      } catch (error) {
        console.error("Error fetching attendance report:", error);
      }
    };

    if (details) {
      fetchEmployeeDetails();
    }
    if (employeeId) {
      fetchAttendanceReoportById();
      fetchAttendanceReoportAdvanceOrLoan();
    }
  }, [details, employeeId]);

  if (!employee) {
    return <Text>Loading...</Text>;
  }

  // Toggle section expansion

  const toggleTab = (tabName: any) => {
    // If the same tab is clicked, toggle it off, else set the new tab
    setSelectedTab((prevTab) => (prevTab === tabName ? null : tabName));
  };

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
            <Text className="text-lg">{employee.employeeName}</Text>
            <Text className="text-gray text-sm">
              {employee.designation} ({employee.employeeId})
            </Text>
          </View>
        </View>
        <Ionicons name="settings-outline" size={24} color="black" />
      </View>
      {/* details of employee  */}
      <View>
        {/* Top Tab Section */}
        <View className="mb-5 p-5 flex flex-row justify-between items-center bg-gray-200 mx-5 rounded-b-md">
          <Pressable onPress={() => toggleTab("Detail")}>
            <View className="flex flex-cols items-center">
              <Ionicons name="list-outline" size={24} color="black" />
              <Text>Detail</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => toggleTab("Attendance")}>
            <View className="flex flex-cols items-center">
              <Ionicons name="stats-chart-outline" size={24} color="black" />
              <Text>Attendance</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => toggleTab("Advance")}>
            <View className="flex flex-cols items-center">
              <Ionicons name="card-outline" size={24} color="black" />
              <Text>Advance</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => toggleTab("Location")}>
            <View className="flex flex-cols items-center">
              <Ionicons name="locate-outline" size={24} color="black" />
              <Text>Location</Text>
            </View>
          </Pressable>
        </View>

        {/* Toggleable Content */}
        {selectedTab === "Detail" && (
          <ScrollView className="mb-52 mx-5 p-4 bg-white rounded-md shadow-md">
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
                value={employee.email}
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
                  value={employee.employeeName}
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
                  value={employee.employeeId}
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
                  value={employee.designation}
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
                  value={employee.phoneNumber}
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
                  value={employee.dateOfBirth}
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
                  value={employee.joiningDate}
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
                  value={employee.salary}
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
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  Address
                </Text>
                <TextInput
                  value={employee.address}
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
        )}

        {selectedTab === "Attendance" && (
          <>
            <View className="mx-5 p-4 bg-white rounded-md shadow-md">
              <View style={{ marginHorizontal: 5 }}>
                {attendance?.map((item, index) => (
                  <View key={index} style={{ marginVertical: 2 }}>
                    <View
                      style={{
                        marginTop: 15,
                        margin: 5,
                        padding: 5,
                        backgroundColor: "#DEF7EC",
                        borderRadius: 5,
                      }}
                    >
                      <DataTable>
                        <DataTable.Header>
                          <DataTable.Title>P</DataTable.Title>
                          <DataTable.Title>A</DataTable.Title>
                          <DataTable.Title>HD</DataTable.Title>
                          <DataTable.Title>H</DataTable.Title>
                          <DataTable.Title>NW</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Row>
                          <DataTable.Cell>{item?.present}</DataTable.Cell>
                          <DataTable.Cell>{item?.absent}</DataTable.Cell>
                          <DataTable.Cell>{item?.halfday}</DataTable.Cell>
                          <DataTable.Cell>1</DataTable.Cell>
                          <DataTable.Cell>8</DataTable.Cell>
                        </DataTable.Row>
                      </DataTable>
                    </View>
                  </View>
                ))}
              </View>

              <View>
                <Text>Salary</Text>
                <Text>
                  {(attendance[0].present * attendance[0].salary) / 30}
                </Text>
                <Text>Base Salary</Text>
                <Text>{attendance[0].salary}</Text>
              </View>
            </View>
          </>
        )}

        {selectedTab === "Advance" && (
          <View className="mx-5 p-4 bg-white rounded-md shadow-md">
            {advanceOrLoan.length > 0 ? (
              advanceOrLoan.map((item, index) => (
                <View key={index} style={{ marginVertical: 2 }}>
                  {item?.advanceOrLoan === 0 ? (
                    <Text>{item.advanceOrLoan}</Text>
                  ) : (
                    <Text>No loan or advance</Text>
                  )}
                </View>
              ))
            ) : (
              <Text>No Advance</Text>
            )}
          </View>
        )}

        {selectedTab === "Location" && (
          <View className="mx-5 p-4 bg-white rounded-md shadow-md">
            <Text>
              Location: Here you can show employee location or tracking
              information.
            </Text>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default EmployeeDetails;
