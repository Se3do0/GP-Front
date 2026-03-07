import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Pencil, Trash2, Mail, Shield, Building2, Inbox } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const BASE_URL = "https://ghared-project-1lb7.onrender.com";

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/Admin/getAllUsers`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            });

            const json = await res.json();

            if (json.status !== "success") {
                throw new Error("API error");
            }

            if (json.data && Array.isArray(json.data.users)) {
                setUsers(json.data.users);
            } else if (Array.isArray(json.data)) {
                setUsers(json.data);
            } else {
                setUsers([]);
            }

        } catch (err) {
            Swal.fire({ text: 'فشل تحميل المستخدمين', icon: 'error', confirmButtonColor: '#219ebc' });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        const result = await Swal.fire({
            title: 'هل أنت متأكد من الحذف؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'إلغاء',
            customClass: {
                popup: 'rounded-2xl shadow-xl',
                confirmButton: 'rounded-xl font-medium px-5',
                cancelButton: 'rounded-xl font-medium px-5'
            }
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(
                `${BASE_URL}/api/Admin/users/${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    }
                }
            );

            const data = await res.json();

            if (data.status !== "success") {
                throw new Error("Delete failed");
            }

            Swal.fire({
                text: 'تم حذف المستخدم بنجاح',
                icon: 'success',
                confirmButtonColor: '#219ebc',
                customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl font-medium' }
            });

            // Animated exit by updating state locally
            setUsers(users.filter(u => u.user_id !== userId));

        } catch (err) {
            Swal.fire({ text: 'فشل حذف المستخدم', icon: 'error', confirmButtonColor: '#219ebc' });
            console.error(err);
        }
    };

    const handleEdit = (userId) => {
        navigate(`/user-form?id=${userId}`);
    };

    const roleMap = {
        0: { label: "مسؤول النظام", color: "bg-purple-100 text-purple-700 border-purple-200" },
        1: { label: "مدير", color: "bg-blue-100 text-blue-700 border-blue-200" },
        2: { label: "موظف", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        3: { label: "مسؤول", color: "bg-amber-100 text-amber-700 border-amber-200" }
    };

    // Stagger animation variants for table rows
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex justify-center pb-12"
        >
            <div className="w-full max-w-6xl space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h4 className="text-2xl font-bold tracking-tight text-[#0b3d59]">إدارة المستخدمين</h4>
                        <p className="text-slate-500 mt-1 text-sm">إدارة حسابات وصلاحيات موظفي وإداريي الجامعة</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/user-form')}
                        className="flex items-center gap-2 bg-gradient-to-l from-[#219ebc] to-[#0b3d59] text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all border border-blue-800"
                    >
                        <UserPlus size={18} />
                        إضافة مستخدم
                    </motion.button>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold tracking-wide">
                                    <th className="px-6 py-4">الاسم</th>
                                    <th className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-slate-400" />
                                            البريد الإلكتروني
                                        </div>
                                    </th>
                                    <th className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Shield size={16} className="text-slate-400" />
                                            المستوى
                                        </div>
                                    </th>
                                    <th className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={16} className="text-slate-400" />
                                            الإدارة
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 w-32 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse bg-white">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-5/6"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                                                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (!users || users.length === 0) ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex flex-col items-center justify-center text-slate-400"
                                            >
                                                <div className="w-20 h-20 bg-slate-50/80 rounded-full flex items-center justify-center mb-4 ring-8 ring-slate-50">
                                                    <Inbox size={40} className="text-slate-300" />
                                                </div>
                                                <p className="text-lg font-bold text-slate-500">لا توجد بيانات مسجلة حالياً</p>
                                                <p className="text-sm mt-1 text-slate-400">قم بإضافة مستخدمين جدد ليظهروا هنا</p>
                                            </motion.div>
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence>
                                        {(users || []).map((user) => {
                                            const role = roleMap[user.role_level] || { label: user.role_level, color: "bg-slate-100 text-slate-700 border-slate-200" };

                                            return (
                                                <motion.tr
                                                    key={user.user_id}
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="show"
                                                    exit={{ opacity: 0, x: -20, backgroundColor: "#fef2f2", transition: { duration: 0.2 } }}
                                                    className="group transition-colors hover:bg-slate-50/80"
                                                >
                                                    <td className="px-6 py-4 font-semibold text-slate-800">
                                                        {user.full_name}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border ${role.color}`}>
                                                            {role.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 font-medium">
                                                        {user.department_name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1, backgroundColor: "#f0f9ff" }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleEdit(user.user_id)}
                                                                className="p-2 text-[#219ebc] bg-white border border-slate-200 hover:border-[#219ebc]/30 rounded-xl transition-colors shadow-sm"
                                                                title="تعديل"
                                                            >
                                                                <Pencil size={16} strokeWidth={2.5} />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1, backgroundColor: "#fef2f2" }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleDelete(user.user_id)}
                                                                className="p-2 text-red-500 bg-white border border-slate-200 hover:border-red-200 rounded-xl transition-colors shadow-sm"
                                                                title="حذف"
                                                            >
                                                                <Trash2 size={16} strokeWidth={2.5} />
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )
                                        })}
                                    </AnimatePresence>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Users;
