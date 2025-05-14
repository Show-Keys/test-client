import './App.css';
import Home from './pages/home/home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AddProduct from './pages/admin/AddProduct';
import AuctionDetail from './pages/home/AuctionDetail';
import EditUser from './pages/admin/EditUser';
import AddUser from './pages/admin/AddUser';
import EditAuction from './pages/admin/EditAuction';
import NavigationBar from './components/Navbar';
import { Container } from 'reactstrap';
import { useSelector } from 'react-redux';
// import ManageBids from './pages/admin/ManageBids';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useSelector((state) => state.users);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Container fluid className="px-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/registerUser" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/AuctionDetail/:id" element={<AuctionDetail />} />

          {/* Protected Admin Routes */}
          <Route 
            path="/AdminDashboard" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ManageUsers" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ManageUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addProduct" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddProduct />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-user/:id" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <EditUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-user" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/editAuction/:id" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <EditAuction />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
