import store from "react-native-simple-store";
export const setOld = async (key, value) => {
  try {
    await store.update(key, value);
  } catch (error) {
    console.log("Error storing value: ", error);
  }
};

export const getOld = async key => {
  await store
    .get(key)
    .then(value => {
      if (value !== undefined) {
        return value;
      }
    })
    .catch(error => {
      console.log("Error retrieving value: ", error);
    });
};

export const removeOld = async key => {
  try {
    await store.delete(key);
  } catch (error) {
    console.log("Error deleting value: ", error);
  }
};
