import "./App.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { systemInfo } from "./actions/system";
import { getSystem } from "./services/system";
import AllRouter from "./AllRouters";
import NavController from "./components/NavController";
import Chatbot from "./components/Chatbot/Chatbot";

import { AuthProvider } from "./helper/AuthContext";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSystem = async () => {
      const result = await getSystem();
      dispatch(systemInfo(result.data));
    };
    fetchSystem();
  }, [dispatch]);

  return (
    <>
      <AuthProvider>
        <NavController />
        <AllRouter />
        <Chatbot />
      </AuthProvider>
    </>
  );
}

export default App;
