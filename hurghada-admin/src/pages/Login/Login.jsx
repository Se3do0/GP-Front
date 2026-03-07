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
                customClass: { popup: 'rounded-xl shadow-lg', confirmButton: 'rounded-lg font-medium' }
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
                customClass: { popup: 'rounded-xl shadow-lg', confirmButton: 'rounded-lg font-medium' }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans" dir="rtl">

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
                {/* Top Accent Line */}
                <div className="h-1 w-full bg-[#219ebc]"></div>

                <div className="p-10">
                    <div className="flex flex-col items-center mb-8">
                        <div className="mb-5">
                            <img src={logo} alt="شعار جامعة الغردقة" className="w-16 h-16 object-contain" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">تسجيل الدخول</h2>
                        <p className="text-slate-500 text-sm mt-1.5">نظام الإدارة - جامعة الغردقة</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">البريد الإلكتروني</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    dir="ltr"
                                    className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] block py-3 pl-4 pr-10 transition-colors outline-none text-left placeholder-slate-400"
                                    placeholder="admin@hurghada.edu.eg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">كلمة المرور</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    dir="ltr"
                                    className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] block py-3 pl-4 pr-10 transition-colors outline-none text-left placeholder-slate-400"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#219ebc] hover:bg-[#1a8ba6] text-white font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors flex items-center justify-center gap-2.5 mt-6 disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    <span>دخول النظام</span>
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
