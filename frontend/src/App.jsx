import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import { ChatProvider } from "./api/ChatContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import PlanetExplorer from "./pages/PlanetExplorer";
import PlanetDetail from "./pages/PlanetDetail";
import Chatbot from "./pages/Chatbot";
import Stargazing from "./pages/Stargazing";
import ConstellationIdentifier from "./pages/ConstellationIdentifier";
import ObservatoryFinder from "./pages/ObservatoryFinder";
import News from "./pages/News";
import SkyEvents from "./pages/SkyEvents";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planets" element={<PlanetExplorer />} />
            <Route path="/planets/:id" element={<PlanetDetail />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/stargazing" element={<Stargazing />} />
            <Route
              path="/constellations"
              element={<ConstellationIdentifier />}
            />
            <Route path="/observatories" element={<ObservatoryFinder />} />
            <Route path="/news" element={<News />} />
            <Route path="/sky-events" element={<SkyEvents />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </ChatProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
