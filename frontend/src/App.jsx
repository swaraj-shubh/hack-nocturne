import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import EnterInviteCode from './components/EnterInviteCode';
import Navbar from './components/navbar';
import { ToastContainer } from 'react-toastify';
import { useAuthStore } from './context/useAuthStore';
import PlayGround from './components/PlayGround';
import axios from 'axios';
import './App.css'

axios.defaults.baseURL = import.meta.BACKEND_URL || "https://localhost:8000/";
axios.defaults.withCredentials = true;
function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<PlayGround />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/invite" element={<EnterInviteCode />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
