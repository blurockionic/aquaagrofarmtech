import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons"; // Importing Ionicons for the eye icon
import { useUser } from "@clerk/clerk-expo";

type Props = {};

const Profile = (props: Props) => {
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState(moment());
  const [employee, setEmployee] = useState<any>([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false); // For toggling old password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // For toggling new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For toggling confirm password visibility

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/auth/me/${user?.id}`);
        setEmployee(response.data.user);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    // if (user?.id) {
    //   fetchEmployeeDetails();
    // }
  }, [user?.id]);

  const handleChangePassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    try {
      await user?.updatePassword({
        currentPassword: oldPassword,
        newPassword,
      });

      setSuccessMessage("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(
        "Error changing password. Please check your current password."
      );
      console.error("Password change error:", error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView>
        <View className="flex flex-row items-center justify-between pr-5">
          <View className="p-4 flex flex-row items-center gap-4">
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
                {user?.fullName?.charAt(0)}
              </Text>
            </View>
            <View className="flex flex-cols">
              <Text className="text-lg">{user?.fullName}</Text>
              <Text className="text-gray text-sm capitalize">
                {user?.publicMetadata?.role}
              </Text>
            </View>
          </View>
        </View>

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
              style={{ fontSize: 18, fontWeight: "bold" }}
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
              value={user?.primaryEmailAddress?.emailAddress}
              editable={false} // Making the field non-editable
            />
          </View>

          {/* Change Password Section */}
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
              style={{ fontSize: 18, fontWeight: "bold" }}
              className="text-center"
            >
              Change Password
            </Text>

            {/* Old Password Input */}
            <View style={{ marginVertical: 14 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Old password
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderColor: "#D0D0D0",
                    borderWidth: 1,
                    marginTop: 10,
                    borderRadius: 5,
                  }}
                  placeholder="Old password"
                  placeholderTextColor={"black"}
                  secureTextEntry={!showOldPassword} // Toggle visibility
                />
                <Pressable
                  onPress={() => setShowOldPassword(!showOldPassword)}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons
                    name={showOldPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </Pressable>
              </View>
            </View>

            {/* New Password Input */}
            <View style={{ marginVertical: 14 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                New password
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderColor: "#D0D0D0",
                    borderWidth: 1,
                    marginTop: 10,
                    borderRadius: 5,
                  }}
                  placeholder="New password"
                  placeholderTextColor={"black"}
                  secureTextEntry={!showNewPassword} // Toggle visibility
                />
                <Pressable
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={{ marginVertical: 14 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Confirm new password
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderColor: "#D0D0D0",
                    borderWidth: 1,
                    marginTop: 10,
                    borderRadius: 5,
                  }}
                  placeholder="Confirm new password"
                  placeholderTextColor={"black"}
                  secureTextEntry={!showConfirmPassword} // Toggle visibility
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </Pressable>
              </View>
            </View>

            {/* Error or Success Message */}
            {errorMessage ? (
              <Text style={{ color: "red", textAlign: "center" }}>
                {errorMessage}
              </Text>
            ) : null}
            {successMessage ? (
              <Text style={{ color: "green", textAlign: "center" }}>
                {successMessage}
              </Text>
            ) : null}

            {/* Change Password Button */}
            <Pressable
              className="mt-10 bg-blue-500 p-3 rounded-md"
              onPress={handleChangePassword}
            >
              <Text className="text-center text-white">Change Password</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Profile;
