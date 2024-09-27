import { View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { ApiUrl } from "@/config/ServerConnection";
import axios from "axios";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

type Props = {
  employeeId: string;
};

const LocationOfEmployee = ({ employeeId }: Props) => {
  const [locationData, setLocationData] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [filteredData, setFilteredData] = useState<any>(null);

  useEffect(() => {
    getLocationById();
  }, []);

  useEffect(() => {
    filterDataByDate();
  }, [locationData, date]);

  const getLocationById = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/location/history/${employeeId}`);
      const data = response.data.data;
      if (data && data.location) {
        setLocationData(data.location);
      }
    } catch (error) {
      console.log("Error fetching location:", error);
    }
  };

  const filterDataByDate = () => {
    if (locationData) {
      const selectedDate = moment(date).format('YYYY-MM-DD');
      const filtered = locationData.filter((loc: any) =>
        moment(loc.createdAt).format('YYYY-MM-DD') === selectedDate
      );
      setFilteredData(filtered);
    }
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowPicker(false);
    console.log(selectedDate);
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

      {filteredData ? (
        <MapView
          className="h-[60%] rounded-lg"
          initialRegion={{
            latitude: filteredData[0]?.latitude || 30.9172337,
            longitude: filteredData[0]?.longitude || 75.8130101,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Plot all markers */}
          {filteredData.map((loc: any, index: number) => (
            <Marker
              key={loc._id}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              title={`Location ${index + 1}`}
            />
          ))}

          {/* Add Polyline to connect markers */}
          <Polyline
            coordinates={filteredData.map((loc: any) => ({
              latitude: loc.latitude,
              longitude: loc.longitude,
            }))}
            strokeColor="blue"
            strokeWidth={4}
          />
        </MapView>
      ) : (
        <Text>Loading location...</Text>
      )}
    </View>
  );
};

export default LocationOfEmployee;
