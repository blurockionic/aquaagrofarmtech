import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";
import { ApiUrl } from "@/config/ServerConnection";

type AttendanceStatus = Record<string, {
  selected: boolean;
  marked: boolean;
  selectedColor: string;
}>;

type AttendanceSummary = {
  present: number;
  absent: number;
  halfday: number;
}[];

interface AttendanceInCalendarProps {
  employeeId: string;
}

const AttendanceInCalendar: React.FC<AttendanceInCalendarProps> = ({ employeeId }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({});
  const [status, setStatus] = useState<string>("present");
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>([]);
  const [currentDate, setCurrentDate] = useState<moment.Moment>(moment());
  const [changeMonth, setChangeMonth] = useState<number>(new Date().getMonth() + 1);
  const [changeYear, setChangeYear] = useState<number>(new Date().getFullYear());
  
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Present", value: "present" },
    { label: "Absent", value: "absent" },
    { label: "Half Day", value: "halfday" },
  ]);

  useEffect(() => {
    fetchAttendanceByStatus();
    fetchAttendanceReport();
  }, [status, changeMonth, changeYear]);

  const fetchAttendanceByStatus = async (): Promise<void> => {
    try {
      const response = await axios.get(`${ApiUrl}/attendance/employee/${employeeId}`);
      const attendanceData = response?.data?.attendance || [];
      const filteredAttendance = attendanceData.filter((item: any) => item?.status === status);

      const markedDates = mapAttendanceToMarkedDates(filteredAttendance);
      setAttendanceStatus(markedDates);
    } catch (error: any) {
      console.error("Error fetching attendance:", error.response?.data?.message || error.message);
    }
  };

  const fetchAttendanceReport = async (): Promise<void> => {
    try {
      const response = await axios.get(`${ApiUrl}/attendance/report/${employeeId}`, {
        params: { month: changeMonth, year: changeYear },
      });
      setAttendanceSummary(response?.data?.report || []);
    } catch (error: any) {
      console.error("Error fetching attendance report:", error.response?.data?.message || error.message);
    }
  };

  const mapAttendanceToMarkedDates = (attendance: any[]): AttendanceStatus => {
    const colors: Record<string, string> = {
      present: "#0E9F6E",
      absent: "#F05252",
      halfday: "#C27803",
    };

    return attendance.reduce((acc: AttendanceStatus, item: any) => {
      const formattedDate = moment(item?.date, "MMMM D, YYYY").format("YYYY-MM-DD");
      acc[formattedDate] = {
        selected: true,
        marked: true,
        selectedColor: colors[status] || "#000",
      };
      return acc;
    }, {});
  };

  const renderSummaryItem = ({ item }: { item: AttendanceSummary[0] }) => (
    <View style={styles.summaryItem}>
      <Text style={styles.present}>{item?.present || 0}</Text>
      <Text style={styles.absent}>{item?.absent || 0}</Text>
      <Text style={styles.halfDay}>{item?.halfday || 0}</Text>
    </View>
  );

  const renderCalendar = () => (
    <Calendar
      current={currentDate.format("YYYY-MM-DD")}
      onDayPress={(day) => setSelectedDate(day.dateString)}
      onMonthChange={(month) => {
        setChangeMonth(month.month);
        setChangeYear(month.year);
      }}
      markedDates={attendanceStatus}
      theme={{
        selectedDayBackgroundColor: "green",
        todayTextColor: "red",
        arrowColor: "orange",
        monthTextColor: "blue",
      }}
    />
  );

  return (
    <View style={styles.outerContainer}>
      <FlatList
        data={[1]} // Dummy data for a single section, to be used for rendering calendar
        keyExtractor={(item) => item.toString()}
        ListHeaderComponent={
          <View style={styles.container}>
            <View style={styles.header}>
              <DropDownPicker
                open={open}
                value={status}
                items={items}
                setOpen={setOpen}
                setValue={setStatus}
                setItems={setItems}
                style={styles.picker}
                placeholder="Select Status"
              />
            </View>
            {renderCalendar()}
            <Text style={styles.selectedText}>
              Selected Date: {selectedDate || "None"}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <FlatList
              data={attendanceSummary}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSummaryItem}
              ListEmptyComponent={<Text style={styles.noSummary}>No Summary Found</Text>}
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: { paddingHorizontal: 20, marginBottom: 20 },
  container: { padding: 20, backgroundColor: "#fff", borderRadius: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { fontSize: 16, fontWeight: "bold" },
  picker: {
    width: 150,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedText: { marginTop: 20, fontSize: 16 },
  summaryContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  summaryTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  present: { color: "green", fontWeight: "bold" },
  absent: { color: "red", fontWeight: "bold" },
  halfDay: { color: "orange", fontWeight: "bold" },
  noSummary: { textAlign: "center", color: "gray" },
});

export default AttendanceInCalendar;
