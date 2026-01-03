import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailInput from './pages/Register/EmailInput';
import OtpInput from './pages/Register/OtpInput';
import CompleteRegistration from "./pages/Register/CompleteRegistration";
import Dashboard from "./pages/Dashboard";
import ProfileUpload from "./pages/Register/ProfileUpload";
import Chat from "./components/Chat";
import Search from "./components/Search";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import UserProfile from "./components/AnotherUserProfile";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/emailInput" element={<EmailInput />} />
      <Route path="/register/verifyOtp" element={<OtpInput />} />
      <Route path="/register/complete" element={<CompleteRegistration />} />
      <Route path="/register/profileUpload" element={<ProfileUpload />} />
      {/* <Route path="/user/dashboard" element={<Dashboard />} /> */}
      <Route path="user/dashboard" element={<Dashboard />}>
        <Route path="chat" element={<Chat />} />
        <Route path="search" element={<Search />} />
        <Route path="profile" element={<Profile />} />
        <Route path="editProfile" element={<EditProfile />} />
        <Route path="search/profile/:username" element={<UserProfile />} />

      </Route>
        
    </Routes>
    </>
  );
}

export default App;




