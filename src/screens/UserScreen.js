import { useNavigation, DrawerActions } from "@react-navigation/native";
import { connect } from "react-redux";
import PleaseLoginScreen from "./PleaseLoginScreen";
import { View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { colors } from "../config/theme";
import { MainContainer } from "../components/Containers";
import StyledText from "../components/Texts/StyledText";
import SectionHead from "../components/Texts/SectionHead";
import Avatar from "../components/Profile/Avatar";
import ProfileInfo from "../components/Profile/ProfileInfo";
import ProfileButton from "../components/Profile/ProfileButton";
import UploadModal from "../components/Profile/UploadModal";
import { useState } from "react";
import Toast from "react-native-toast-message";

function UserScreen({ userInfo, token, logout }) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();

  // useEffect(() => {
  // get data from API
  // })

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

  // const sendToBackend = async () => {
  //   try {
  //     const formData = new FormData();

  //     formData.append("image", {
  //       uri: image,
  //       type: "image/png",
  //       name: "profile-image",
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

  const onLogout = async () => {
    try {
    } catch ({ message }) {
      alert("Logout Error! " + message);
    }
  };
  return userInfo ? (
    <MainContainer style={styles.container}>
      <Avatar showChangeButton={false} onButtonPress={() => setModalVisible(true)} uri={image} />
      <StyledText big bold style={[styles.text, { marginBottom: 10 }]}>
        {userInfo.hoTen}
      </StyledText>
      {/* <StyledText style={[styles.text, { marginBottom: 5 }]}>Photo addict</StyledText> */}
      <StyledText small style={[styles.text, { color: colors.tertiary }]}>
        Active since – 2023
      </StyledText>
      <SectionHead
        option='Edit'
        style={{ marginTop: 20 }}
        onPress={() => {
          // navigation.navigate("ProfileEdit", {
          //   id: userInfo.nguoiDungId,
          //   fullName: userInfo.hoTen,
          //   bio: "22 year old dev from the Country Side",
          //   email: userInfo.email,
          //   phone: "+71138474930",
          //   location: "Country Side",
          //   joinDate: "Aug, 2022",
          //   image,
          // });
          navigation.navigate("ProfileEdit");
        }}
      >
        Personal Info
      </SectionHead>
      <View style={styles.section}>
        <ProfileInfo label='Email' icon='email-outline'>
          <StyledText>{userInfo.email}</StyledText>
        </ProfileInfo>
        {/* <ProfileInfo label='Phone' icon='phone-outline'>
          <StyledText>+71138474930</StyledText>
        </ProfileInfo>
        <ProfileInfo label='Location' icon='map-marker-outline'>
          <StyledText>Country Side</StyledText>
        </ProfileInfo> */}
      </View>
      <SectionHead style={{ marginTop: 20 }}>Utilities</SectionHead>
      <View style={styles.section}>
        {/* <ProfileButton label='Downloads' icon='download-outline' /> */}
        <ProfileButton label='Help' icon='help-circle-outline' />
        <ProfileButton
          label='Log Out'
          icon='logout-variant'
          onPress={() => {
            logout();
            Toast.show({
              type: "success",
              text1: "Logout successfully!",
              text2: "Hope to see you again 👋",
            });
          }}
        />
      </View>
      <UploadModal
        modalVisible={modalVisible}
        onBackPress={() => {
          setModalVisible(false);
        }}
        onCameraPress={() => uploadImage()}
        onGalleryPress={() => uploadImage("gallery")}
        onRemovePress={() => removeImage()}
      />
    </MainContainer>
  ) : (
    <PleaseLoginScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 180,
    paddingHorizontal: 25,
    marginTop: 50,
  },
  section: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 5,
    marginBottom: 5,
  },
  text: {
    textAlign: "center",
  },
});

const mapStateToProps = state => ({
  userInfo: state.user.userInfo,
  token: state.user.token,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: "LOGOUT" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
