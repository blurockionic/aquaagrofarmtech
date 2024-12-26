import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";
import { ApiUrl } from "@/config/ServerConnection";

type AttendanceStatus = Record<
  string,
  {
    selected: boolean;
    marked: boolean;
    selectedColor: string;
  }
>;

type AttendanceSummary = {
  present: number;
  absent: number;
  halfday: number;
}[];

interface AttendanceInCalendarProps {
  employeeId: string;
}

const AttendanceInCalendar: React.FC<AttendanceInCalendarProps> = ({
  employeeId,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>(
    {}
  );
  const [status, setStatus] = useState<string>("present");
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>(
    []
  );
  const [currentDate, setCurrentDate] = useState<moment.Moment>(moment());
  const [changeMonth, setChangeMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [changeYear, setChangeYear] = useState<number>(
    new Date().getFullYear()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  console.log(employeeId);
  const fetchAttendanceByStatus = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${ApiUrl}/attendance/employee/${employeeId}`
      );

      console.log(response.data , "response");
      const attendanceData = response?.data?.attendance || [];
      const filteredAttendance = attendanceData.filter(
        (item: any) => item?.status === status
      );

      const markedDates = mapAttendanceToMarkedDates(filteredAttendance);
      setAttendanceStatus(markedDates);
    } catch (error: any) {
      setError("Unable to fetch attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceReport = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${ApiUrl}/attendance/report/${employeeId}`,
        {
          params: { month: changeMonth, year: changeYear },
        }
      );
      const filterAttendance = response?.data?.report?.filter((item: any) => item?._id === employeeId);
      setAttendanceSummary(filterAttendance || []);
    } catch (error: any) {
      setError("Unable to fetch attendance summary.");
    } finally {
      setLoading(false);
    }
  };

  console.log(attendanceSummary)

  const mapAttendanceToMarkedDates = (attendance: any[]): AttendanceStatus => {
    const colors: Record<string, string> = {
      present: "#0E9F6E",
      absent: "#F05252",
      halfday: "#C27803",
    };

    return attendance.reduce((acc: AttendanceStatus, item: any) => {
      const formattedDate = moment(item?.date, "MMMM D, YYYY").format(
        "YYYY-MM-DD"
      );
      acc[formattedDate] = {
        selected: true,
        marked: true,
        selectedColor: colors[status] || "#000",
      };
      return acc;
    }, {});
  };

  const renderSummaryItem = ({ item }: { item: AttendanceSummary[0] }) => (
    <>
      <View style={styles.summaryItem}>
        <Text style={styles.present}>{item?.present || 0}</Text>
        <Text style={styles.absent}>{item?.absent || 0}</Text>
        <Text style={styles.halfDay}>{item?.halfday || 0}</Text>
      </View>
    </>
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

  if (loading) {
    return (
      <ActivityIndicator size="large" color="blue" style={styles.loader} />
    );
  }

  return (
    <View style={styles.outerContainer}>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
            {attendanceSummary.length === 0 ? (
              <Text style={styles.noSummary}>No Summary Found</Text>
            ) : (
              <FlatList
                data={attendanceSummary}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderSummaryItem}
              />
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", textAlign: "center", marginVertical: 10 },
  outerContainer: { paddingHorizontal: 20, marginBottom: 20 },
  container: { padding: 20, backgroundColor: "#fff", borderRadius: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  picker: { width: 150, borderColor: "gray", borderWidth: 1, borderRadius: 5 },
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
