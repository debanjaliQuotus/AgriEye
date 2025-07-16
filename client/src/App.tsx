import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './pages/Home';
import Layout from './components/layouts/Layout';
import Dashboard from './components/farmer/Dashboard';
import MotionEvent from './components/sensor/MotionEvent';
import {ThemeProvider} from './context/ThemeContext';   import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import './index.css'

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/motion-event"
                element={
                  <PrivateRoute>
                    <MotionEvent />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;