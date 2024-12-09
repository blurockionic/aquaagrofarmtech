import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { ApiUrl } from "@/config/ServerConnection";
import { useUser } from "@clerk/clerk-expo";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};

const Salary = (props: Props) => {
  // const { user } = useUser();
  const [advanceOrLoan, setAdvanceOrLoan] = React.useState<any>([]);
  const [totalAdvanceAmount, setTotalAdvanceAmount] = React.useState<any>(0);
  const [employeeId, setEmployeeId] = React.useState<any>("");
  const [extraBonus, setExtraBonus] = React.useState<any>([]);
  const [currentDate, setCurrentDate] = React.useState<any>(moment());
  const [attendanceReport, setAttendanceReport] = React.useState<any>([]);
  const [anotherEmployeeId, setAnotherEmployeeId] = React.useState<any>("");

  const [employee, setEmployee] = useState<any>({});

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        // Parse the user data from JSON string to an object
        const user = JSON.parse(userData);
        console.log("Retrieved user data:", user);
        setEmployee(user);
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


  useEffect(() => {
    if (employee.id) {
      fetchEmployeeDetails();
    //   fetchLoanAndAdvance();
     
    }

    // if(anotherEmployeeId){
    //   fetchAttendanceReoportById()
    // }
    // console.log("employeeId", employeeId);
  }, [employee.id]);

  const fetchLoanAndAdvance = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/advance/${employeeId}`);
      // Filter out the details and set the advance or loan
      const advance = response.data.advance.filter((item: any) =>
        item.hasOwnProperty("advanceAmount")
      );
      const extraBonus = response.data.advance.filter((item: any) =>
        item.hasOwnProperty("extraBonus")
      );

      const totalAdvanceAmount = advance.reduce(
        (acc: any, item: any) => acc + item.advanceAmount,
        0
      );
      // console.log("totalADvanceAmount", totalAdvanceAmount);
      setTotalAdvanceAmount(totalAdvanceAmount);
      setAdvanceOrLoan(advance);
      setExtraBonus(extraBonus);
    } catch (error) {
      console.error("Error fetching attendance report:", error);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/employee/${employee.id}`); // Use the id to fetch employee data

      setAnotherEmployeeId(response.data.employee);
      console.log(response.data);

      // setEmployeeId(response.data?.employee[0]._id);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const fetchAttendanceReoportById = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl}/attendance/report/${anotherEmployeeId}`,
        {
          params: {
            month: currentDate.month() + 1,
            year: 2024,
          },
        }
      );
      setAttendanceReport(response.data.report);
    } catch (error) {
      console.error("Error fetching attendance report:", error);
    }
  };


  //calculate payable salary
  const payableSalary =
  attendanceReport?.[0]?.present && attendanceReport?.[0]?.salary
    ? (attendanceReport[0].present * attendanceReport[0].salary) / 30
    : 0;

console.log("payableSalary", payableSalary);


  return (
    <>
      <View className="mx-5 p-4 bg-white rounded-md shadow-md mt-5">
        <View className=" bg-white rounded-lg shadow">
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold mb-3">Salary Details</Text>
            {/* Table Row: Base Salary */}
            <View className="flex flex-cols items-center justify-center py-2">
              <Text>Base Salary</Text>
              <Text>₹ {anotherEmployeeId.salary || "----"}</Text>
            </View>
          </View>

          {/* Table Header */}
          <View className="flex flex-row justify-between mb-2">
            <Text className="font-bold">Description</Text>
            <Text className="font-bold">Value/Amt.</Text>
          </View>

          {/* Table Row: Number of Working Days */}
          <View className="flex flex-row justify-between border-b border-gray-200 py-2">
            <Text>Number of Working Days</Text>
            <Text>{attendanceReport[0]?.present || "----"}</Text>
          </View>

          {/* Table Row: Current Salary */}
          <View className="flex flex-row justify-between border-b border-gray-200 py-2">
            <Text>Salary payable</Text>
            <Text>₹ {payableSalary.toFixed(2) || "----"}</Text>
          </View>

          {/* Table Row: Advance Amount */}
          <View className="flex flex-row justify-between border-b border-gray-200 py-2">
            <Text>Advance Amount</Text>
            <Text>₹ {totalAdvanceAmount || "----"}</Text>
          </View>

          {/* Table Row: Due Amount */}
          <View className="flex flex-row justify-between py-2">
            <Text>Due Amount</Text>
            <Text>
              ₹{" "}
              {(totalAdvanceAmount >= payableSalary
                ? totalAdvanceAmount - payableSalary
                : 0
              ).toFixed(2) || "----"}
            </Text>
          </View>
        </View>
      </View>

      <View className="mx-5 p-4 bg-white rounded-md shadow-md mb-5 mt-5">
        <View className="flex flex-row items-center justify-between mb-5">
          <Text className="text-lg font-bold ">Advance</Text>
        </View>
        {advanceOrLoan.length > 0 ? (
          advanceOrLoan.map((item: any, index: number) => (
            <View
              key={index}
              style={{ marginVertical: 2 }}
              className="p-2 border-b border-gray-100"
            >
              {item?.advanceOrLoan !== 0 ? (
                <>
                  <View className="flex flex-row items-center justify-between">
                    <Text>{`₹${item?.advanceAmount}`}</Text>
                    <Text>{item?.date}</Text>
                  </View>
                </>
              ) : (
                <Text>No loan or advance</Text>
              )}
            </View>
          ))
        ) : (
          <Text>No Advance</Text>
        )}
      </View>

      <View className="mx-5 p-4 bg-white rounded-md shadow-md mb-5 mt-5">
        <View className="flex flex-row items-center justify-between mb-5">
          <Text className="text-lg font-bold ">Extra Bonus</Text>
        </View>
        {extraBonus.length > 0 ? (
          extraBonus.map((item, index) => (
            <View
              key={index}
              style={{ marginVertical: 2 }}
              className="p-2 border-b border-gray-100"
            >
              {item?.advanceOrLoan !== 0 ? (
                <>
                  <View className="flex flex-row items-center justify-between">
                    <Text>{`₹${item?.advanceAmount}`}</Text>
                    <Text>{item?.date}</Text>
                  </View>
                </>
              ) : (
                <Text>No loan or advance</Text>
              )}
            </View>
          ))
        ) : (
          <Text>No Advance</Text>
        )}
      </View>
    </>
  );
};

export default Salary;
