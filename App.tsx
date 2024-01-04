import { MenuProvider } from "react-native-popup-menu";
import { AuthProvider } from "./src/context/AuthContext";
import { AppNav } from "./src/context/AppNav";
import "./src/localization/i18n";

function App() {
  return (
    <MenuProvider>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </MenuProvider>
  );
}

export default App;
