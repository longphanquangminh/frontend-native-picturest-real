import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { colors } from "../../config/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import placeholder from "../../../assets/images/no-image.png";

const ImageFrame = ({ uri, style, imgStyle, onPress, onButtonPress, aviOnly = false, ...props }) => {
  return (
    <View style={[styles.container, { marginBottom: aviOnly ? 0 : 0 }, style]} {...props}>
      <TouchableOpacity onPress={onButtonPress}>
        <Image source={uri ? { uri } : placeholder} style={[styles.image, aviOnly && { height: 35, width: 35, borderWidth: 0 }, imgStyle]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
    paddingTop: 50,
  },
  image: {
    borderRadius: 50,
    width: 185,
    height: 185,
    borderColor: colors.secondary,
    borderWidth: 5,
  },
  editButton: {
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 8,
    position: "absolute",
    right: 5,
    bottom: 5,
  },
});

export default ImageFrame;
