import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ApiUrl } from "@/config/ServerConnection";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import trackUserLocation from "@/components/location/trackUserLocation";

type Props = {};

const Profile = (props: Props) => {
  const router = useRouter();
  const [employee, setEmployee] = useState<any>({});
  const [employeeDetails, setEmployeeDetails] = useState<any>({});
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    designation: "",
    address: "",
    joiningDate: "",
    dateOfBirth: "",
    salary: 0,
  });

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setEmployee(user);
      } else {
        console.log("No user data found.");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  const fetchEmployeeDetails = async () => {
    if (!employee?.id) return;
    try {
      const response = await axios.get(`${ApiUrl}/employee/${employee.id}`);
      setEmployeeDetails(response.data.employee || {});
      setFormData({
        phone: response.data.employee.phone || "",
        designation: response.data.employee.designation || "",
        address: response.data.employee.address || "",
        joiningDate: response.data.employee.joiningDate || "",
        dateOfBirth: response.data.employee.dateOfBirth || "",
        salary: response.data.employee.salary || 0,
      });
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const handleOnUpdate = async () => {
    console.log(formData);
    console.log("id", employee.id);
    try {
      setIsEditClicked(false);
      await axios.put(`${ApiUrl}/employee/update/${employee.id}`, formData);
      Alert.alert("Updated Successfully");
      fetchEmployeeDetails();
    } catch (error) {
      console.error("Error updating employee details:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleOnEdit = () => {
    setIsEditClicked(true);
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (employee?.id) fetchEmployeeDetails();
  }, [employee]);

  trackUserLocation(employee);
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.profileContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {employee?.fullName?.charAt(0) || "N/A"}
              </Text>
            </View>
            <View>
              <Text style={styles.employeeName}>
                {employee?.fullName || "N/A"}
              </Text>
              <Text style={styles.employeeRole}>
                {employee?.role || "Role"} ({employee?.id || "ID"})
              </Text>
            </View>
          </View>
        </View>

        {/* Login Credentials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Login Credential</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="black"
            value={employee?.email || ""}
            editable={false}
          />
        </View>

        {/* Employee Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Details</Text>
          {[
            {
              label: "Full Name",
              value: employee?.fullName,
              editable: false,
            },
            { label: "Employee ID", value: employee?.id, editable: false },
            {
              label: "Designation",
              value: formData.designation,
              key: "designation",
            },
            { label: "Mobile Number", value: formData.phone, key: "phone" },
            {
              label: "Date of Birth",
              value: formData.dateOfBirth,
              key: "dateOfBirth",
            },
            {
              label: "Joining Date",
              value: formData.joiningDate,
              key: "joiningDate",
            },
            {
              label: "Salary",
              value: formData.salary.toString(),
              key: "salary",
            },
            { label: "Address", value: formData.address, key: "address" },
          ].map((field, index) => (
            <View key={index} style={styles.fieldContainer}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                value={field.value || ""}
                onChangeText={(e) =>
                  field.key && setFormData({ ...formData, [field.key]: e })
                }
                placeholder={`Enter ${field.label}`}
                placeholderTextColor="black"
                editable={isEditClicked && field.key ? true : field.editable}
              />
            </View>
          ))}

          <View style={styles.activeEmployeeRow}>
            <Text>Active Employee</Text>
            <Text>{employee?.isActive ? "True" : "False"}</Text>
          </View>
        </View>

        {/* Edit or Save Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={isEditClicked ? handleOnUpdate : handleOnEdit}
        >
          <Text style={styles.buttonText}>
            {isEditClicked ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootView: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  profileContainer: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#4b6cb7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "white", fontSize: 16 },
  employeeName: { fontSize: 18 },
  employeeRole: { color: "gray", fontSize: 12 },
  section: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    marginTop: 20,
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  input: {
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  fieldContainer: { marginVertical: 10 },
  activeEmployeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4b6cb7",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 16,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center" },
  logoutContainer: { marginTop: 50, marginBottom: 100, marginHorizontal: 16 },
});

export default Profile;
