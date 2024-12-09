import * as SecureStore from 'expo-secure-store';

// Save token
const saveToken = async (key:string, value:any) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Get token
const getToken = async (key:string) => {
  try {
    const token = await SecureStore.getItemAsync(key);
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// Delete token
const deleteToken = async (key:string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error deleting token:", error);
  }
};
