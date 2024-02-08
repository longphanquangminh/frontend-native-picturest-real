import { SafeAreaView, ScrollView } from "react-native";
import { colors } from "../../config/theme";
const { primary } = colors;

const MainContainer = ({ children, backgroundColor, style }) => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: backgroundColor || primary }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[style]}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainContainer;
