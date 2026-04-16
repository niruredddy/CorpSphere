import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SplashScreen from './components/SplashScreen';
import Toast from './components/Toast';
import DashboardRouter from './pages/DashboardRouter';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const MainApp = () => {
    const { user } = useAuth();
    return (
        <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard/*" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
    );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
        <BrowserRouter>
          <div className="app-container max-w-[2000px] mx-auto bg-[#050505]">
            {showSplash ? (
              <SplashScreen onComplete={() => setShowSplash(false)} />
            ) : (
                <>
                  <MainApp />
                  <Toast />
                </>
            )}
          </div>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
