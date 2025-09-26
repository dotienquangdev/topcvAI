import { combineReducers } from "redux";
import someReducer from "./someReducer";
import chatbotReducer from "./chatbotReducer";

const allReducers = combineReducers({
  some: someReducer,
  chatbot: chatbotReducer,
});

export default allReducers;
