import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "../../config/theme";
import StyledText from "../Texts/StyledText";

const StyledButton = ({
  children,
  style,
  textStyle,
  isLoading,
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.accent,
          opacity: disabled || isLoading ? 0.4 : 1,
        },
        style,
      ]}
      onPress={props.onPress}
      disabled={disabled || isLoading}
      {...props}
    >
      <StyledText style={textStyle}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.tint} />
        ) : (
          children
        )}
      </StyledText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 60,
  },
});

export default StyledButton;
