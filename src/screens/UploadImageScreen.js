import { Text, View, ScrollView, StyleSheet } from "react-native";
import { connect } from "react-redux";
import PleaseLoginScreen from "./PleaseLoginScreen";
import ImageFrame from "../components/Profile/ImageFrame";
import { useState } from "react";
import UploadModal from "../components/Profile/UploadModal";
import StyledTextInput from "../components/Inputs/StyledTextInput";
import { KeyboardAvoidingContainer } from "../components/Containers";

function UploadImageScreen({ userInfo }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();
  const [bio, setBio] = useState("");
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
    </ScrollView>
  ) : (
    <PleaseLoginScreen />
  );
}

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
  login: credentials => dispatch({ type: "LOGIN", payload: credentials }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageScreen);
