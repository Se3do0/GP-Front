import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Building2,
    GraduationCap,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import logo from '../assets/hurghada-logo.png';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'هل أنت متأكد من تسجيل الخروج؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#e2e8f0',
            confirmButtonText: 'نعم',
            cancelButtonText: 'إلغاء',
            customClass: {
                popup: 'rounded-xl shadow-lg',
                confirmButton: 'rounded-lg font-medium px-5',
                cancelButton: 'rounded-lg font-medium px-5 !text-slate-700'
            }
        });

        if (result.isConfirmed) {
            localStorage.removeItem("adminToken");
            navigate("/login");
        }
    };

    const navItems = [
        { path: '/', label: 'إدارة المستخدمين', icon: Users },
        { path: '/departments', label: 'إدارة الأقسام', icon: Building2 },
        { path: '/colleges', label: 'إدارة الكليات', icon: GraduationCap },
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden" dir="rtl">

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {!isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed inset-0 z-40 bg-black/20 lg:hidden cursor-pointer"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? '260px' : '0px',
                    opacity: isSidebarOpen ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={`fixed lg:relative z-50 h-full border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden ${isSidebarOpen ? 'w-[260px]' : 'w-0'}`}
            >
                {/* Sidebar Header / Logo */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200 shrink-0">
                    <div className="flex items-center gap-3 w-full justify-center">
                        <div className="p-1.5 rounded-lg">
                            <img src={logo} alt="شعار جامعة الغردقة" className="w-9 h-9 object-contain" />
                        </div>
                        <span className="font-semibold text-base tracking-tight whitespace-nowrap hidden sm:block text-slate-800">
                            جامعة الغردقة
                        </span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    <div className="text-[11px] font-semibold text-slate-400 mb-4 px-3 uppercase tracking-wider">
                        القائمة الرئيسية
                    </div>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 group relative
                                    ${isActive
                                        ? 'bg-[#219ebc]/10 text-[#219ebc] font-medium'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            size={18}
                                            className={isActive ? 'text-[#219ebc]' : 'text-slate-400 group-hover:text-slate-600'}
                                        />
                                        <span className="whitespace-nowrap text-sm">{item.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTabIndicator"
                                                className="absolute right-0 w-[3px] h-6 bg-[#219ebc] rounded-l-full"
                                                initial={false}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Sidebar Footer / User Profile */}
                <div className="p-3 border-t border-slate-200 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-2.5 w-full overflow-hidden rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-[#219ebc] flex items-center justify-center text-white text-sm font-semibold">
                            م
                        </div>
                        <div className="flex flex-col text-right overflow-hidden">
                            <span className="text-sm font-medium text-slate-700 truncate">مسؤول النظام</span>
                            <span className="text-xs text-slate-400 truncate">admin@hurghada.edu.eg</span>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0 z-20 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
                            لوحة التحكم
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium group"
                        >
                            <LogOut size={16} className="group-hover:text-red-500 transition-colors" />
                            <span className="hidden sm:inline">تسجيل الخروج</span>
                        </motion.button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8 bg-slate-50">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 2 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeInOut" }}
                            className="max-w-7xl mx-auto w-full h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
