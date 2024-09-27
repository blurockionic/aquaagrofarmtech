import { router, Tabs } from "expo-router";
import React, { useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Pressable, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLogoutClick, setIsLogoutClick] = useState(false);
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          // Adding the logout button on the right of the header
          headerRight: ({ color, focused }) => (
            <Pressable
              onPress={() => {
                // Add your logout logic here, for example:
                // signOut function or clearing authentication tokens
                signOut();
                router.replace("/(auth)/sign-in");
              }}
              style={{
                marginRight: 16,
              }}
            >
              <TabBarIcon
                name={focused ? "log-out" : "log-out-outline"}
                color={color}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="employee"
        options={{
          title: "Employee",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "people" : "people-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "list" : "list-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                console.log("hello");
              }}
              style={{
                marginRight: 16,
              }}
            >
              <Ionicons name="settings-outline" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
