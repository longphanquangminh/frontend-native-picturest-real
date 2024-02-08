import { SafeAreaView, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { colors } from "../../config/theme";
const { primary } = colors;

const KeyboardAvoidingContainer = ({ children, backgroundColor, style }) => {
  const headerHeight = useHeaderHeight();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={headerHeight}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[style]}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default KeyboardAvoidingContainer;
