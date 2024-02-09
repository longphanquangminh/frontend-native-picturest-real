import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import PleaseLoginScreen from "./PleaseLoginScreen";
import ImageFrame from "../components/Profile/ImageFrame";
import { useState } from "react";
import UploadModal from "../components/Profile/UploadModal";
import StyledTextInput from "../components/Inputs/StyledTextInput";
import { KeyboardAvoidingContainer } from "../components/Containers";
import * as ImagePicker from "expo-image-picker";

function UploadImageScreen({ userInfo }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();
  const [bio, setBio] = useState("");
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
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
      setModalVisible(false);
    }
  };

  const removeImage = async () => {
    try {
      saveImage(null);
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
  return userInfo ? (
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
        <StyledTextInput placeholder='Image description...' label='Description' multiline={true} value={bio} onChangeText={setBio} />
      </KeyboardAvoidingContainer>
      <TouchableOpacity className='py-3 mx-[25px] bg-yellow-400 rounded-xl'>
        <Text className='text-xl font-bold text-center text-gray-700'>Post</Text>
      </TouchableOpacity>
    </ScrollView>
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
});

const mapDispatchToProps = dispatch => ({
  login: credentials => dispatch({ type: "LOGIN", payload: credentials }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageScreen);
