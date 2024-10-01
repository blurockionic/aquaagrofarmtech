import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import { ApiUrl } from "@/config/ServerConnection";

const summary = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());

  const goToNextMonth = () => {
    const nextMonth = moment(currentDate).add(1, "months");
    setCurrentDate(nextMonth);
  };

  const goToPrevMonth = () => {
    const prevMonth = moment(currentDate).subtract(1, "months");
    setCurrentDate(prevMonth);
  };

  const formatDate = (date) => {
    return date.format("MMMM, YYYY");
  };
  const fetchAttendanceReport = async () => {
    try {
      const respone = await axios.get(`${ApiUrl}/attendance/report`, {
        params: {
          month: currentDate.month() + 1,
          year: 2024,
        },
      });

      setAttendanceData(respone.data.report);
    } catch (error) {
      console.log("Error fetching attendance");
    }
  };
  useEffect(() => {
    fetchAttendanceReport();
  }, [currentDate.month()]);
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginLeft: "auto",
          marginRight: "auto",
          marginVertical: 20,
        }}
      >
        <AntDesign
          onPress={goToPrevMonth}
          name="left"
          size={24}
          color="black"
        />
        <Text>{formatDate(currentDate)}</Text>
        <AntDesign
          onPress={goToNextMonth}
          name="right"
          size={24}
          color="black"
        />
      </View>

      <View style={{ marginHorizontal: 12 }}>
        {attendanceData?.map((item, index) => (
          <View key={index} style={{ marginVertical: 10 }} className="bg-gray-50 px-4 py-5 shadow-lg">
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              className="bg-white rounded-md p-2"
            >
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
                  {item?.name?.charAt(0)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {item?.name}
                </Text>
                <Text style={{ marginTop: 5, color: "gray" }}>
                  {item?.designation} ({item?.employeeId})
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 15,
                margin: 5,
                padding: 5,
              }}
            >
              {/* Header Row */}

              {/* Data Row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 5,
                }}
              >
                <Text className="px-5 py-3 bg-green-300 text-black text-xl  rounded-sm">
                  {item?.present}
                </Text>
                <Text className="px-5 py-3 bg-red-300 text-black text-xl  rounded-sm">
                  {item?.absent}
                </Text>
                <Text className="px-5 py-3 bg-yellow-300 text-black text-xl  rounded-sm">
                  {item?.halfday}
                </Text>
              </View>

              <View
               className="flex flex-row justify-end gap-4 items-center mt-2"
              >
                <Ionicons name="help-circle-outline" size={24} color="black" />
                <Text className="text-sm text-green-500">Present</Text>
                <Text className="text-sm text-red-500">Absent</Text>
                <Text className="text-sm text-yellow-500">Halfday</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default summary;

const styles = StyleSheet.create({});
