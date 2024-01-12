import { Provider } from "react-redux";
import AppNavigation from "./src/navigation";
import store from "./src/store";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </Provider>
  );
}
