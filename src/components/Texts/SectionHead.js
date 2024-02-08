import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../config/theme";
import StyledText from "../Texts/StyledText";

const SectionHead = ({ children, option, style, onPress }) => {
  return (
    <View style={[styles.sectionHead, style]}>
      <StyledText bold style={styles.headText}>
        {children}
      </StyledText>
      <TouchableOpacity onPress={onPress}>
        <StyledText small style={styles.optionText}>
          {option}
        </StyledText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headText: {
    color: colors.tertiary,
  },
  optionText: {
    color: colors.tertiary + "aa",
  },
});

export default SectionHead;
