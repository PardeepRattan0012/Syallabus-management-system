import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Book, LayoutGrid, FileText, Users, LogOut, Home } from 'lucide-react';
import { useAuthStore } from "../store/authStore";

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    useEffect(() => {
        const originalTitle = document.title;
        document.title = "Admin - CDS Study Material";
        return () => {
            document.title = originalTitle;
        };
    }, []);

    const menuItems = [
        { path: '/admin', name: 'Dashboard', icon: Home },
        { path: '/admin/subjects', name: 'Subjects', icon: Book },
        { path: '/admin/topics', name: 'Topics', icon: LayoutGrid },
        { path: '/admin/content', name: 'Content', icon: FileText },
        { path: '/admin/users', name: 'Users', icon: Users },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-primary">
            {/* Sidebar window */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                        CDS Admin
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">v1.0 Dashboard</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                                    isActive 
                                    ? 'bg-secondary/20 text-secondary font-medium' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-[#4b5e28] flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-lg transition-all"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-primary">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
