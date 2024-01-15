import createStorage from "typed-async-storage";
import AsyncStorage from "@react-native-community/async-storage";
import PropTypes from "prop-types";

const simpleSchema = {
  userInfo: PropTypes.any.isRequired,
  token: PropTypes.string.isRequired,
};

const simpleStorage = createStorage({
  name: "simpleStorage", // name must be unique for every storage
  schema: simpleSchema,
  AsyncStorage,
});

export const set = async (key, value) => {
  try {
    await simpleStorage.set(key, value);
    // await simpleStorage.set(key, JSON.stringify(value));
  } catch (error) {
    console.log("Error storing value: ", error);
  }
};

export const get = async key => {
  try {
    const session = await simpleStorage.get(key);
    // const session = await simpleStorage.get(JSON.parse(key));
    if (session !== undefined) {
      return session;
    }
  } catch (error) {
    console.log("Error retrieving value: ", error);
  }
};

export const remove = async key => {
  try {
    await simpleStorage.remove(key);
  } catch (error) {
    console.log("Error deleting value: ", error);
  }
};
