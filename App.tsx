import { AuthProvider } from "./src/context/AuthContext";
import { AppNav } from "./src/context/AppNav";
import "./src/localization/i18n";

function App() {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}

export default App;
