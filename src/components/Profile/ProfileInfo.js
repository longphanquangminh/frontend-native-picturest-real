import { StyleSheet, View } from "react-native";
import { colors } from "../../config/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// custom components
import StyledText from "../Texts/StyledText";

const ProfileInfo = ({ children, label, style, icon }) => {
  return (
    <View style={[{ backgroundColor: colors?.secondary }, styles.profileInfo, style]}>
      <View style={styles.label}>
        <MaterialCommunityIcons name={icon} size={25} color={colors.accent} />
        <StyledText style={[{ color: colors?.tertiary + "aa", marginLeft: 15 }]}>{label}</StyledText>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  profileInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    height: 60,
    marginBottom: 2,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ProfileInfo;
