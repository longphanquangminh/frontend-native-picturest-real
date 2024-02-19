import { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { KeyboardAvoidingContainer } from "../components/Containers";
import StyledTextInput from "../components/Inputs/StyledTextInput";
import Avatar from "../components/Profile/Avatar";
import StyledButton from "../components/Buttons/StyledButton";
import UploadModal from "../components/Profile/UploadModal";
import Toast from "react-native-toast-message";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../api/config";

// for uploading image to backend
const FormData = global.FormData;

const ProfileEditScreen = ({ route, token, userInfo, setUserInfo, setChangedInfo }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(userInfo.anh_dai_dien);
  const [imageReal, setImageReal] = useState(null);

  const uploadImage = async mode => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        let localUri = result.assets[0].uri;
        let filename = localUri.split("/").pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        setImageReal({ uri: localUri, name: filename, type });
        const imageObject = { uri: localUri, name: filename, type };

        const formData = new FormData();
        formData.append("file", imageObject);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
          transformRequest: () => {
            return formData;
          },
        };

        await axios.post(`${BASE_URL}/users/avatar/${userInfo.id}`, formData, config);

        const response = await axios.get(`${BASE_URL}/users/${userInfo.id}`);
        if (response && response.data) {
          setUserInfo(response.data.content);
        }

        Toast.show({
          type: "success",
          text1: "Successfully upload avatar!",
          text2: "Your avatar has been uploaded ✅",
        });

        // axios
        //   .post(`${BASE_URL}/users/avatar/${userInfo.id}`, formData, {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //       token,
        //     },
        //   })
        //   .then(() => {
        //     axios
        //       .get(`${BASE_URL}/users/${userInfo.id}`)
        //       .then(res => {
        //         setUserInfo(res.data.content);
        //       })
        //       .catch(error => {
        //         console.error("Error getting user info:", error);
        //       });
        //     // removeImage();
        //   })
        //   .catch(error => {
        //     console.error("Error posting image:", error);
        //     Toast.show({
        //       type: "error",
        //       text1: "Error",
        //       text2: "Failed to upload image.",
        //     });
        //   });

        setModalVisible(false);
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
      setModalVisible(false);
    }
  };

  const removeImage = () => {
    setImage(userInfo.anh_dai_dien);
    setImageReal(null);
    setModalVisible(false);
  };

  const [savingChanges, setSavingChanges] = useState(false);

  const saveChanges = () => {
    try {
      setSavingChanges(true);

      // let objectUserInfo = { ...userInfo }; // Initialize the object

      // if (imageReal) {
      //   const formData = new FormData();
      //   formData.append("file", imageReal);

      //   axios
      //     .post(`${BASE_URL}/users/avatar/${userInfo.id}`, formData, {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //         token,
      //       },
      //     })
      //     .then(() => {
      //       // objectUserInfo = { ...objectUserInfo, anh_dai_dien: imageReal.name };
      //       removeImage();
      //     })
      //     .catch(error => {
      //       console.error("Error posting image:", error);
      //       Toast.show({
      //         type: "error",
      //         text1: "Error",
      //         text2: "Failed to upload image.",
      //       });
      //     });
      // }

      axios
        .put(
          `${BASE_URL}/users/${userInfo.id}`,
          { hoTen: fullName },
          {
            headers: {
              token: token,
            },
          },
        )
        .then(() => {
          setUserInfo({ ...userInfo, ho_ten: fullName });
          Toast.show({
            type: "success",
            text1: "Edit successfully!",
            text2: "Your profile has been saved ✅",
          });
          navigation.goBack();
        })
        .catch(err => {
          console.log(err);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to save changes.",
          });
        })
        .finally(() => {
          setSavingChanges(false); // Toggle off loading state
        });
    } catch ({ message }) {
      alert(message);
      setSavingChanges(false);
    }
  };

  const sendToBackend = async () => {
    try {
      const formData = new FormData();

      formData.append("image", {
        uri: image,
        type: "image/png",
        name: "product-image",
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
        transformRequest: () => {
          return formData;
        },
      };

      await axios.post(`${BASE_URL}/users/avatar/${userInfo.id}`, formData, config);

      alert("success");
    } catch (error) {
      throw error;
    }
  };

  // inputs
  const [fullName, setFullName] = useState(route.params?.fullName || userInfo.ho_ten);
  const [bio, setBio] = useState(route.params?.bio || "");
  const [email, setEmail] = useState(route.params?.email || "");
  const [phone, setPhone] = useState(route.params?.phone || "");
  const [location, setLocation] = useState(route.params?.location || "");

  return (
    <KeyboardAvoidingContainer style={styles.container}>
      <View className='flex-row justify-start'>
        <TouchableOpacity onPress={() => navigation.goBack()} className='bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl'>
          <ArrowLeftIcon size='20' color='black' />
        </TouchableOpacity>
      </View>
      <Avatar uri={image} onButtonPress={() => setModalVisible(true)} />
      {/* <View className='my-3'></View> */}
      <StyledTextInput placeholder='Full Name' icon='account-outline' label='Full Name' value={fullName} onChangeText={setFullName} />

      {/* <StyledTextInput placeholder='A proud web dev' icon='account-details-outline' label='Bio' multiline={true} value={bio} onChangeText={setBio} /> */}

      {/* <StyledTextInput
        placeholder='jbrown@hotmail.com'
        icon='email-outline'
        label='Email Address'
        keyboardType='email-address'
        value={email}
        onChangeText={setEmail}
      /> */}

      {/* <StyledTextInput
        placeholder='+6794833883'
        icon='phone-outline'
        label='Phone Number'
        keyboardType='phone-pad'
        value={phone}
        onChangeText={setPhone}
      />

      <StyledTextInput placeholder='Gulf of Guinea' icon='map-marker-outline' label='Location' value={location} onChangeText={setLocation} /> */}

      <StyledButton textStyle={{ color: "white", fontWeight: "bold" }} isLoading={savingChanges} onPress={saveChanges}>
        Save Changes
      </StyledButton>

      <UploadModal
        modalVisible={modalVisible}
        onBackPress={() => {
          setModalVisible(false);
        }}
        onCameraPress={() => uploadImage()}
        onGalleryPress={() => uploadImage("gallery")}
        onRemovePress={() => removeImage()}
        showRemoveButton={false}
      />
    </KeyboardAvoidingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 90,
    paddingHorizontal: 25,
    marginTop: 50,
  },
});

const mapStateToProps = state => ({
  userInfo: state.user.userInfo,
  token: state.user.token,
});

const mapDispatchToProps = dispatch => ({
  setUserInfo: value => dispatch({ type: "EDIT", payload: value }),
  setChangedInfo: booleanVallue => dispatch({ type: "CHANGED_INFO", payload: booleanVallue }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen);
