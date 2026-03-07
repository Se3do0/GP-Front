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
            cancelButtonColor: '#64748b',
            confirmButtonText: 'نعم',
            cancelButtonText: 'إلغاء',
            customClass: {
                popup: 'rounded-2xl shadow-xl',
                confirmButton: 'rounded-xl font-medium px-5',
                cancelButton: 'rounded-xl font-medium px-5'
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
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden" dir="rtl">

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {!isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm lg:hidden hover:cursor-pointer"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? '280px' : '0px',
                    opacity: isSidebarOpen ? 1 : 0
                }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className={`fixed lg:relative z-30 h-full bg-[#0b3d59] text-white shadow-2xl lg:shadow-none flex flex-col shrink-0 overflow-hidden ${isSidebarOpen ? 'w-[280px]' : 'w-0'}`}
            >
                {/* Sidebar Header / Logo */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-4 w-full justify-center">
                        <div className="bg-white p-1.5 rounded-xl shadow-inner">
                            <img src={logo} alt="شعار جامعة الغردقة" className="w-10 h-10 object-contain" />
                        </div>
                        <span className="font-bold text-lg tracking-tight whitespace-nowrap hidden sm:block">
                            جامعة الغردقة
                        </span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-xs font-semibold text-[#219ebc] mb-4 px-3 uppercase tracking-wider opacity-80">
                        القائمة الرئيسية
                    </div>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
                                    ${isActive
                                        ? 'bg-gradient-to-l from-[#219ebc] to-[#0d5071] text-white font-medium shadow-md shadow-[#219ebc]/20'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            size={20}
                                            className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:-rotate-3'}`}
                                        />
                                        <span className="whitespace-nowrap">{item.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTabIndicator"
                                                className="absolute right-0 w-1.5 h-6 bg-white rounded-l-full"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Sidebar Footer / User Profile */}
                <div className="p-4 border-t border-white/10 shrink-0 bg-[#09324a]">
                    <div className="flex items-center gap-3 px-4 py-2 mb-4 w-full overflow-hidden">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-[#219ebc] to-[#8ecae6] flex items-center justify-center text-white font-bold shadow-inner border border-white/20">
                            م
                        </div>
                        <div className="flex flex-col text-right overflow-hidden">
                            <span className="text-sm font-bold text-white truncate">مسؤول النظام</span>
                            <span className="text-xs text-[#219ebc] truncate">admin@hurghada.edu.eg</span>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

                {/* Top Header */}
                <header className="h-16 lg:h-20 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 text-slate-500 hover:text-[#0b3d59] hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                        >
                            <Menu size={22} />
                        </button>
                        <h1 className="text-xl font-bold text-[#0b3d59] hidden sm:block tracking-tight">
                            لوحة التحكم
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium group border border-transparent hover:border-red-100"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline">تسجيل الخروج</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-8 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
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
