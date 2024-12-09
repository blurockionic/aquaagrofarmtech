import { View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { ApiUrl } from "@/config/ServerConnection";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

type Props = {
  employeeId: string;
};

const LocationOfEmployee = ({ employeeId }: Props) => {
  const [locationData, setLocationData] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    getLocationById();
  }, []);

  useEffect(() => {
    filterDataByDate();
  }, [locationData, date]);

  const getLocationById = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl}/location/history/${employeeId}`
      );

      const data = response.data.data; // Assuming the data is an array
      console.log("Fetched Location Data:", data);

      if (Array.isArray(data)) {
        setLocationData(data);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const filterDataByDate = () => {
    if (locationData && locationData.length > 0) {
      const selectedDate = moment(date).format("YYYY-MM-DD");
      const filtered = locationData.filter((loc: any) =>
        moment(loc.createdAt).isSame(selectedDate, "day")
      );
      setFilteredData(filtered);
    }
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View className="h-screen px-5">
      <Button title="Select Date" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Display the selected date */}
      <Text style={{ marginTop: 10, fontSize: 16 }} className="mb-3">
        {moment(date).format("MMMM Do YYYY, h:mm A")}
      </Text>

      {filteredData && filteredData.length > 0 ? (
        <MapView
          className="h-[60%] rounded-lg"
          initialRegion={{
            latitude: filteredData[0]?.location.latitude || 30.9172337,
            longitude: filteredData[0]?.location.longitude || 75.8130101,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Plot all markers */}
          {filteredData.map((loc: any, index: number) => (
            <Marker
              key={loc._id}
              coordinate={{
                latitude: loc.location.latitude,
                longitude: loc.location.longitude,
              }}
              title={`Location ${index + 1}`}
            />
          ))}

          {/* Add Polyline to connect markers */}
          <Polyline
            coordinates={filteredData.map((loc: any) => ({
              latitude: loc.location.latitude,
              longitude: loc.location.longitude,
            }))}
            strokeColor="blue"
            strokeWidth={4}
          />
        </MapView>
      ) : (
        <Text>No location data for the selected date.</Text>
      )}
    </View>
  );
};

export default LocationOfEmployee;
