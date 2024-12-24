import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View, ScrollView, Image, Alert } from "react-native";
import InputField from "@/components/input/InputField";
import CustomButton from "@/components/button/CustomButton";
import { ApiUrl } from "@/config/ServerConnection";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  }); 
  

  const onSignInPress = async () => {
    setLoading(true);
    try {
      // Validate input
      if (!form.email || !form.password) {
        Alert.alert("Error", "Please enter email and password!");
        return;
      }

      // Make API request to your backend login route
      const response = await axios.post(`${ApiUrl}/auth/login`, {
        email: form.email,
        password: form.password,
      });

      // Check if login was successful
      if (response.data.success) {
        // Store JWT token locally (you can replace this with other storage methods if needed)
        await AsyncStorage.setItem("token", response.data.token);

        //saveToken
        await SecureStore.setItemAsync("userToken", response.data.token);
        // Optionally store the user data
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify(response.data.user)
        );

        // You can navigate to the next screen after successful login
        Alert.alert("Success", response.data.message);

        if (response.data.user.role === "admin") {
          router.push("/(tabs)/home");
        } else {
          router.push("/(emp-tabs)/salary");
        }
      } else {
        Alert.alert("Login Failed", response.data.message);
      }
    } catch (error) {
      // Handle any error
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View className="relative w-full h-[250px]">
            <Image source={images.signUpImg} className="z-0 h-[250px] w-full" />
            <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
              Welcome to AAF
            </Text>
          </View>
          <View className="p-5">
            <InputField
              label={"Email"}
              placeholder="Enter your email"
              icon={icons.email}
              value={form.email}
              onChangeText={(value) =>
                setForm({
                  ...form,
                  email: value,
                })
              }
            />
            <InputField
              label={"Password"}
              placeholder="Enter your password"
              icon={icons.lock}
              value={form.password}
              secureTextEntry={true}
              onChangeText={(value) =>
                setForm({
                  ...form,
                  password: value,
                })
              }
            />
            <CustomButton
              title={loading ? "Please wait..." : "Sign In"}
              disabled={loading}
              onPress={onSignInPress}
              className="mt-6"
            />
            {/*oauth*/}
            {/* <OAuth /> */}
            <Link
              href="/sign-up"
              className="text-lg text-center text-general-200 mt-10"
            >
              <Text>Don't have an account? </Text>
              <Text className="text-primary-500">Sign Up</Text>
            </Link>
          </View>
          {/*verification model*/}
        </View>
      </ScrollView>
    </>
  );
};

export default SignIn;
