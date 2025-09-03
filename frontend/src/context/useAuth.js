// Custom hook to access authentication context anywhere in the app
import { useContext } from "react";
import AuthContext from "./AuthContext";

export function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
