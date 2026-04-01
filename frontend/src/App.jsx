import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './store/authStore';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSubjects from './pages/admin/ManageSubjects';
import ManageTopics from './pages/admin/ManageTopics';
import ManageContent from './pages/admin/ManageContent';
import Dashboard from './pages/user/Dashboard';
import TopicExplorer from './pages/user/TopicExplorer';
import ContentViewer from './pages/user/ContentViewer';
import ManageUsers from './pages/admin/ManageUsers';
import Welcome from './pages/user/Welcome';
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const user = useAuthStore((state) => state.user);
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-primary text-slate-100 font-sans selection:bg-secondary/30 relative overflow-hidden">
                {/* Faint Logo Background */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: "url('/bn-logo.png')",
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundAttachment: 'fixed',
                        opacity: 0.15 // Increased opacity for better visibility
                    }}
                />

                <div className="relative z-10">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/welcome" element={
                            <ProtectedRoute>
                                <Welcome />
                            </ProtectedRoute>
                        } />

                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/subject/:subjectId" element={
                            <ProtectedRoute>
                                <TopicExplorer />
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/topic/:topicId" element={
                            <ProtectedRoute>
                                <ContentViewer />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin" element={
                            <ProtectedRoute adminOnly={true}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<AdminDashboard />} />
                            <Route path="subjects" element={<ManageSubjects />} />
                            <Route path="topics" element={<ManageTopics />} />
                            <Route path="content" element={<ManageContent />} />
                            <Route path="users" element={<ManageUsers />} />
                        </Route>
                    </Routes>
                    <ToastContainer position="bottom-right" theme="dark" />
                </div>
            </div>
        </Router>
    );
}

export default App;
