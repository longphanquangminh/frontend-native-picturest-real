import { Text, View } from "react-native";
import { connect } from "react-redux";
import PleaseLoginScreen from "./PleaseLoginScreen";

function UploadImageScreen({ userInfo }) {
  return userInfo ? (
    <View className='flex h-screen items-center justify-center space-y-6'>
      <Text>UploadImageScreen</Text>
    </View>
  ) : (
    <PleaseLoginScreen />
  );
}

const mapStateToProps = state => ({
  userInfo: state.user.userInfo,
  token: state.user.token,
});

const mapDispatchToProps = dispatch => ({
  login: credentials => dispatch({ type: "LOGIN", payload: credentials }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageScreen);
