import { createContext } from "react";

const AuthContext = createContext({ user: null, loading: true, setUser: () => {} });

export default AuthContext;
