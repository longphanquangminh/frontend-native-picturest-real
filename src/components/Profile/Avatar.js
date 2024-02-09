import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { colors } from "../../config/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import placeholder from "../../../assets/images/profile.jpg";

const Avatar = ({ uri, style, imgStyle, onPress, onButtonPress, showChangeButton = true, aviOnly = false, ...props }) => {
  return (
    <View style={[styles.container, { marginBottom: aviOnly ? 0 : 15 }, style]} {...props}>
      <TouchableOpacity onPress={onPress}>
        <Image source={uri ? { uri } : placeholder} style={[styles.image, aviOnly && { height: 35, width: 35, borderWidth: 0 }, imgStyle]} />

        {!aviOnly && showChangeButton && (
          <TouchableOpacity style={styles.editButton} onPress={onButtonPress}>
            <MaterialCommunityIcons name='camera-outline' size={30} color={colors.accent} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
  },
  image: {
    borderRadius: 75,
    width: 150,
    height: 150,
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

export default Avatar;
