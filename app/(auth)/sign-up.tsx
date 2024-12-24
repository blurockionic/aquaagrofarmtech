import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, View, ScrollView, Image, Alert, StyleSheet } from "react-native";
import ReactNativeModal from "react-native-modal";
import axios from "axios";
import { ApiUrl } from "@/config/ServerConnection";
import InputField from "@/components/input/InputField";
import CustomButton from "@/components/button/CustomButton";

const SignUp = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    setLoading(true);
    try {
      try {
        //check email added by owner or not
        const response = await axios.post(`${ApiUrl}/auth/signup`, {
          email: form.email,
          password: form.password,
          fullName: form.fullName,
        });

        router.push("/sign-in");

        // Alert.alert(response.data.message);
      } catch (error: any) {
        console.error(
          "Error saving user data:",
          error.response?.data?.message || error.message
        );
        Alert.alert(error.response?.data?.message);
        return;
      }
      // Create the user and assign a role

      // Prepare email address verification
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image source={images.signUpImg} style={styles.image} />
          <Text style={styles.headerText}>Create Your Account</Text>
        </View>
        <View style={styles.formContainer}>
          <InputField
            label="fullName"
            placeholder="Enter your fullName"
            icon={icons.person}
            value={form.fullName}
            onChangeText={(value) =>
              setForm((prev) => ({
                ...prev,
                fullName: value,
              }))
            }
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) =>
              setForm((prev) => ({
                ...prev,
                email: value,
              }))
            }
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) =>
              setForm((prev) => ({
                ...prev,
                password: value,
              }))
            }
          />
          <CustomButton
            title={loading ? "Please wait..." : "Sign In"}
            disabled={loading}
            onPress={onSignUpPress}
            style={styles.button}
          />
          <Link href="/sign-in" style={styles.link}>
            <Text>Already have an account? </Text>
            <Text style={styles.linkText}>Log In</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeaderText}>Verification</Text>
            <Text style={styles.modalText}>
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification((prev) => ({
                  ...prev,
                  code,
                }))
              }
            />
            {verification.error && (
              <Text style={styles.errorText}>{verification.error}</Text>
            )}
            <CustomButton
              title="Verify Email"
              style={[styles.button, styles.successButton]}
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View style={styles.modalContainer}>
            <Image source={images.check} style={styles.checkImage} />
            <Text style={styles.modalTitle}>Verified</Text>
            <Text style={styles.modalSubtitle}>
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              style={styles.button}
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/(tabs)/home");
              }}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  image: {
    width: "100%",
    height: 250,
    zIndex: 0,
  },
  headerText: {
    fontSize: 24,
    color: "black",
    fontWeight: "600",
    position: "absolute",
    bottom: 5,
    left: 5,
  },
  formContainer: {
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
  link: {
    textAlign: "center",
    marginTop: 20,
  },
  linkText: {
    color: "#3498db",
  },
  modalContainer: {
    backgroundColor: "white",
    paddingHorizontal: 28,
    paddingVertical: 36,
    borderRadius: 20,
    minHeight: 300,
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
  },
  successButton: {
    backgroundColor: "#28a745",
  },
  checkImage: {
    width: 110,
    height: 110,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 10,
  },
});

export default SignUp;
