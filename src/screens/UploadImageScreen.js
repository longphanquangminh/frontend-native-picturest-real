import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import PleaseLoginScreen from "./PleaseLoginScreen";
import ImageFrame from "../components/Profile/ImageFrame";
import { useState } from "react";
import UploadModal from "../components/Profile/UploadModal";
import StyledTextInput from "../components/Inputs/StyledTextInput";
import { KeyboardAvoidingContainer } from "../components/Containers";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Toast from "react-native-toast-message";
import { BASE_URL } from "../api/config";
import Loading from "../components/loading";

function UploadImageScreen({ userInfo, token, posted, setPosted, loading, setLoading }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();
  const [bio, setBio] = useState("");
  const [imageReal, setImageReal] = useState();
  const [imageName, setImageName] = useState("");
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
        // save image
        await saveImage(result.assets[0].uri);
        let localUri = result.assets[0].uri;
        let filename = localUri.split("/").pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        setImageReal({ uri: localUri, name: filename, type });
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
      setModalVisible(false);
    }
  };

  const removeImage = async () => {
    try {
      saveImage(null);
      setImageReal(null);
    } catch ({ message }) {
      alert(message);
      setModalVisible(false);
    }
  };

  const saveImage = async image => {
    try {
      // update displayed image
      setImage(image);

      // make api call to save
      // sendToBackend();

      setModalVisible(false);
    } catch (error) {
      throw error;
    }
  };
  const handlePostImage = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", imageReal); // Assuming imageFile is the file you want to upload
    console.log(imageReal);
    formData.append("moTa", bio);
    formData.append("tenHinh", imageName);
    axios
      .post(`${BASE_URL}/pictures`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data for uploading files
          token, // Include the token in the request headers
        },
      })
      .then(() => {
        // Do something with the response if needed
        Toast.show({
          type: "success",
          text1: "Post successfully!",
          text2: "Your picture has been posted!",
        });
        setPosted(!posted);
        setBio("");
        setImageName("");
        removeImage();
      })
      .catch(error => {
        console.error("Error posting image:", error);
        // Handle error
      })
      .finally(() => setLoading(false));
  };

  return userInfo ? (
    loading ? (
      <Loading size='large' />
    ) : (
      <ScrollView>
        <View>
          <ImageFrame onButtonPress={() => setModalVisible(true)} uri={image} />
          <UploadModal
            title='Upload image'
            modalVisible={modalVisible}
            onBackPress={() => {
              setModalVisible(false);
            }}
            onCameraPress={() => uploadImage()}
            onGalleryPress={() => uploadImage("gallery")}
            onRemovePress={() => removeImage()}
          />
        </View>
        <KeyboardAvoidingContainer style={styles.container}>
          <StyledTextInput placeholder='Image name...' label='Name' value={imageName} onChangeText={setImageName} />
          <StyledTextInput placeholder='Image description...' label='Description' multiline={true} value={bio} onChangeText={setBio} />
        </KeyboardAvoidingContainer>
        <TouchableOpacity onPress={handlePostImage} className='py-3 mx-[25px] bg-yellow-400 rounded-xl'>
          <Text className='text-xl font-bold text-center text-gray-700'>Post</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  ) : (
    <PleaseLoginScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 25,
    marginTop: 50,
  },
});

const mapStateToProps = state => ({
  userInfo: state.user.userInfo,
  token: state.user.token,
  posted: state.user.posted,
  loading: state.user.loading,
});

const mapDispatchToProps = dispatch => ({
  login: credentials => dispatch({ type: "LOGIN", payload: credentials }),
  setPosted: booleanValue => dispatch({ type: "POST", payload: booleanValue }),
  setLoading: booleanValue => dispatch({ type: "LOADING", payload: booleanValue }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageScreen);
