import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import logo from '../../assets/hurghada-logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = "https://ghared-project-1lb7.onrender.com";

    // Set RTL globally on mount
    useEffect(() => {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ar";
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            Swal.fire({
                text: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور',
                icon: 'warning',
                confirmButtonColor: '#219ebc',
                customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl font-medium' }
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`${BASE_URL}/api/Admin/AdminLogin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password.trim()
                })
            });

            const data = await res.json();

            if (data.status !== "success") throw new Error();

            localStorage.setItem("adminToken", data.data.token);
            navigate("/");

        } catch {
            Swal.fire({
                text: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
                icon: 'error',
                confirmButtonColor: '#219ebc',
                customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl font-medium' }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b3d59] via-[#0f547a] to-[#219ebc] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-800" dir="rtl">

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#219ebc]/20 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden relative z-10 border border-white/20"
            >
                {/* Header Line */}
                <div className="h-2 w-full bg-gradient-to-r from-[#219ebc] to-[#0b3d59]"></div>

                <div className="p-10">
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="bg-white p-3 rounded-2xl shadow-lg shadow-blue-900/10 mb-6 border border-slate-100"
                        >
                            <img src={logo} alt="شعار جامعة الغردقة" className="w-16 h-16 object-contain" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-[#0b3d59] tracking-tight">تسجيل الدخول للإدارة</h2>
                        <p className="text-slate-500 text-sm mt-2">لوحة تحكم جامعة الغردقة</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 mr-1">البريد الإلكتروني</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 group-focus-within:text-[#219ebc] transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    dir="ltr"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#219ebc]/30 focus:border-[#219ebc] block py-3.5 pl-3 pr-11 transition-all outline-none text-left"
                                    placeholder="admin@hurghada.edu.eg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 mr-1">كلمة المرور</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 group-focus-within:text-[#219ebc] transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    dir="ltr"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#219ebc]/30 focus:border-[#219ebc] block py-3.5 pl-3 pr-11 transition-all outline-none text-left"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01, translateY: -1 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#0b3d59] to-[#126491] hover:from-[#0d4f75] hover:to-[#1678ae] text-white font-bold rounded-xl text-sm px-5 py-3.5 text-center transition-all shadow-lg shadow-[#0b3d59]/30 flex items-center justify-center gap-2 mt-6 border border-[#09324a] disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    <span>دخول المسؤول</span>
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
