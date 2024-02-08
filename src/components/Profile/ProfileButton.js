import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../config/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// custom components
import StyledText from "../Texts/StyledText";

const ProfileButton = ({ children, label, style, icon, ...props }) => {
  return (
    <TouchableOpacity style={[{ backgroundColor: colors?.secondary }, styles.profileButton, style]} {...props}>
      <View style={styles.label}>
        <MaterialCommunityIcons name={icon} size={25} color={colors.accent} />
        <StyledText style={[{ color: colors?.tertiary + "aa", marginLeft: 15 }]}>{label}</StyledText>
      </View>

      <MaterialCommunityIcons name='chevron-right' size={25} color={colors.tertiary + "aa"} style={{ marginRight: -10 }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileButton: {
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

export default ProfileButton;
