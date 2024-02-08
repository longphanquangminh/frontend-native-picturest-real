import { useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { KeyboardAvoidingContainer } from "../components/Containers";
import StyledTextInput from "../components/Inputs/StyledTextInput";
import Avatar from "../components/Profile/Avatar";
import StyledButton from "../components/Buttons/StyledButton";
import UploadModal from "../components/Profile/UploadModal";

// for uploading image to backend
// const FormData = global.FormData;

const ProfileEditScreen = ({ route }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(route.params?.image);

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
        setModalVisible(false);
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
      setModalVisible(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setModalVisible(false);
  };

  const [savingChanges, setSavingChanges] = useState(false);
  const saveChanges = async () => {
    try {
      setSavingChanges(true);

      // make api call to save
      // sendToBackend();

      setSavingChanges(false);
      navigation.navigate("Profile");
    } catch ({ message }) {
      alert(message);
      setSavingChanges(false);
    }
  };

  // const sendToBackend = async () => {
  //   try {
  //     const formData = new FormData();

  //     formData.append("fullName", fullName);
  //     formData.append("email", email);
  //     formData.append("phone", phone);
  //     formData.append("image", {
  //       uri: image,
  //       type: "image/png",
  //       name: "product-image",
  //     });

  //     const config = {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       transformRequest: () => {
  //         return formData;
  //       },
  //     };

  //     await axios.post("https://your-api-endpoint", formData, config);

  //     alert("success");
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  // inputs
  const [fullName, setFullName] = useState(route.params?.fullName || "");
  const [bio, setBio] = useState(route.params?.bio || "");
  const [email, setEmail] = useState(route.params?.email || "");
  const [phone, setPhone] = useState(route.params?.phone || "");
  const [location, setLocation] = useState(route.params?.location || "");

  return (
    <KeyboardAvoidingContainer style={styles.container}>
      <Avatar uri={image} onButtonPress={() => setModalVisible(true)} />
      <StyledTextInput placeholder='Full Name' icon='account-outline' label='Full Name' value={fullName} onChangeText={setFullName} />

      <StyledTextInput placeholder='A proud web dev' icon='account-details-outline' label='Bio' multiline={true} value={bio} onChangeText={setBio} />

      <StyledTextInput
        placeholder='jbrown@hotmail.com'
        icon='email-outline'
        label='Email Address'
        keyboardType='email-address'
        value={email}
        onChangeText={setEmail}
      />

      <StyledTextInput
        placeholder='+6794833883'
        icon='phone-outline'
        label='Phone Number'
        keyboardType='phone-pad'
        value={phone}
        onChangeText={setPhone}
      />

      <StyledTextInput placeholder='Gulf of Guinea' icon='map-marker-outline' label='Location' value={location} onChangeText={setLocation} />

      <StyledButton isLoading={savingChanges} onPress={saveChanges}>
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
      />
    </KeyboardAvoidingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 25,
  },
});

export default ProfileEditScreen;
