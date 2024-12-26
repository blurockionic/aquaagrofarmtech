import { ApiUrl } from "@/config/ServerConnection";
import useLocation from "@/hooks/useLocation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Props = {};

const Details = (props: Props) => {
  const router = useRouter();
  const { latitude, longitude, errorMsg } = useLocation();
  const [employeeId, setEmployeeId] = useState<string>("");
  const [employeeDetails, setEmployeeDetails] = useState<any>({});
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isLogoutClicked, setIsLogoutClicked] = useState<boolean>(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    phone: "",
    designation: "employee",
    address: "",
    joiningDate: "",
    dateOfBirth: "",
    salary: 0,
  });

  const getUserData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      console.log(id)
      if (id !== null) {
        // Parse the user data from JSON string to an object
        // const user = JSON.parse(id);
        setEmployeeId(id);
      } else {
        console.log("No user data found.");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleOnUpdate = async () => {
    console.log(formData);
    try {
      setIsEditClicked(false);
      await axios.put(`${ApiUrl}/employee/update/${employeeId}`, formData);
      Alert.alert("Sign up Successfully");
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error updating employee details:", error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <ScrollView>
        {/* Employee Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Details</Text>
          {[
            // {
            //   label: "Full Name",
            //   value: employee?.fullName,
            //   editable: false,
            // },
            
            // {
            //   label: "Designation",
            //   value: formData.designation,
            //   key: "designation",
            // },
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

          {/* <View style={styles.activeEmployeeRow}>
            <Text>Active Employee</Text>
            <Text>{employee?.isActive ? "True" : "False"}</Text>
          </View> */}
        </View>

        {/* Edit or Save Button */}
        <TouchableOpacity style={styles.button} onPress={handleOnUpdate}>
          <Text style={styles.buttonText}>
             Save
          </Text>
        </TouchableOpacity>
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

export default Details;
