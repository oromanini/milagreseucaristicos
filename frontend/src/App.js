import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "./components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { MiracleDetail } from "./pages/MiracleDetail";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/admin/Dashboard";
import { MiracleForm } from "./pages/admin/MiracleForm";
import { BulkImport } from "./pages/admin/BulkImport";
import { Disclaimer, Privacy, Terms } from "./pages/Legal";
import { Loader2 } from "lucide-react";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Layout with Navbar and Footer
const Layout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/miracle/:id" element={<Layout><MiracleDetail /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/disclaimer" element={<Layout><Disclaimer /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
        <Route path="/login" element={<Layout showFooter={false}><Login /></Layout>} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout showFooter={false}><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/miracle/new" element={
          <ProtectedRoute>
            <Layout showFooter={false}><MiracleForm /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/miracle/:id" element={
          <ProtectedRoute>
            <Layout showFooter={false}><MiracleForm /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/import" element={
          <ProtectedRoute>
            <Layout showFooter={false}><BulkImport /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
