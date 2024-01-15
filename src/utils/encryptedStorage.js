import EncryptedStorage from "react-native-encrypted-storage";

export const setItemEncrypted = async (key, value) => {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log("Error storing value: ", error);
  }
};

export const getItemEncrypted = async key => {
  try {
    const session = await EncryptedStorage.getItem(key);
    // const session = await EncryptedStorage.getItem(JSON.parse(key));
    if (session !== undefined) {
      return session;
    }
  } catch (error) {
    console.log("Error retrieving value: ", error);
  }
};

export const removeItemEncrypted = async key => {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    console.log("Error deleting value: ", error);
  }
};
