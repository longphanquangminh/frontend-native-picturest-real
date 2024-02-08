import { Text } from "react-native";
import { colors } from "../../config/theme";

const StyledText = ({ children, small, big, bold, style, ...props }) => {
  return (
    <Text
      style={[
        {
          color: colors?.tint,
          fontSize: small ? 13 : big ? 24 : 15,
          fontWeight: big || bold ? "bold" : "normal",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default StyledText;
