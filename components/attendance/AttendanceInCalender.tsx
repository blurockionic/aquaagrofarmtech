import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { ApiUrl } from "@/config/ServerConnection";
import axios from "axios";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";

const AttendanceInCalender = ({ employeeId }: { employeeId: string }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [status, setStatus] = useState("present");

  useEffect(() => {
    // Fetch get attendance data
    getAttendance();
  }, [status]);

  const getAttendance = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl}/attendance/employee/${employeeId}`
      );

      if (status === "present") {
        const present = response?.data?.attendance.filter(
          (item: any) => item?.status === "present"
        );
        const markedDates: { [key: string]: any } = present.reduce(
          (acc: { [key: string]: any }, item: any) => {
            const formattedDate = moment(item?.date, "MMMM D, YYYY").format(
              "YYYY-MM-DD"
            );

            // Mark the date as selected and marked
            acc[formattedDate] = {
              selected: true,
              marked: true,
              selectedColor: "#0E9F6E",
            };
            return acc;
          },
          {}
        );

        // Set the marked dates
        setAttendanceStatus(markedDates);
      }

      if (status === "absent") {
        const absent = response?.data?.attendance.filter(
          (item: any) => item?.status === "absent"
        );

        const markedDates: { [key: string]: any } = absent.reduce(
          (acc: { [key: string]: any }, item: any) => {
            const formattedDate = moment(item?.date, "MMMM D, YYYY").format(
              "YYYY-MM-DD"
            );

            // Mark the date as selected and marked
            acc[formattedDate] = {
              selected: true,
              marked: true,
              selectedColor: "#F05252",
            };
            return acc;
          },
          {}
        );

        // Set the marked dates
        setAttendanceStatus(markedDates);
      }

      if (status === "half day") {
        const halfDay = response?.data?.attendance.filter(
          (item: any) => item?.status === "half day"
        );
        //   console.log(present);

        const markedDates: { [key: string]: any } = halfDay.reduce(
          (acc: { [key: string]: any }, item: any) => {
            const formattedDate = moment(item?.date, "MMMM D, YYYY").format(
              "YYYY-MM-DD"
            );

            // Mark the date as selected and marked
            acc[formattedDate] = {
              selected: true,
              marked: true,
              selectedColor: "#C27803",
            };
            return acc;
          },
          {}
        );

        // Set the marked dates
        setAttendanceStatus(markedDates);
      }
    } catch (error) {
      console.error("Error fetching attendance report:", error);
    }
  };

  const handleOnStatusChange = (status: string) => {
    setStatus(status);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Header Text */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Attendance</Text>
          <RNPickerSelect
            onValueChange={(value) => handleOnStatusChange(value)}
            placeholder={{ label: "Select Status", value: null }}
            items={[
              { label: "Present", value: "present" },
              { label: "Absent", value: "absent" },
              { label: "Half Day", value: "halfday" },
            ]}
            style={{
              inputIOS: styles.picker,
              inputAndroid: styles.picker,
            }}
          />
        </View>

        {/* Basic Calendar Component */}
        <Calendar
          // Initially visible month. Default = Date()
          // current={"2024-09-17"}
          current={moment(Date.now()).format("YYYY-MM-DD")}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day: any) => {
            console.log("selected day", day);
            setSelectedDate(day.dateString);
          }}
          //   Marking a single date as selected
          markedDates={attendanceStatus}
          // Theme customization
          theme={{
            selectedDayBackgroundColor: "green",
            todayTextColor: "red",
            arrowColor: "orange",
            monthTextColor: "blue",
          }}
        />

        <Text style={styles.selectedText}>
          Date: {moment(Date.now()).format("YYYY-MM-DD")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
  },
  picker: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "black",
    backgroundColor: "#fff",
    width: 150, // Adjust width as necessary
  },
});

export default AttendanceInCalender;
