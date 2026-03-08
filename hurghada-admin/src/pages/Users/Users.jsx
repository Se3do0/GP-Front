import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Pencil, Trash2, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const swalStyle = {
    confirmButtonColor: '#219ebc',
    customClass: { popup: 'rounded-xl shadow-lg', confirmButton: 'rounded-lg font-medium' }
};

const swalConfirmDelete = {
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#e2e8f0',
    customClass: { popup: 'rounded-xl shadow-lg', confirmButton: 'rounded-lg font-medium px-5', cancelButton: 'rounded-lg font-medium px-5 !text-slate-700' }
};

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
            Swal.fire({ text: 'فشل تحميل المستخدمين', icon: 'error', ...swalStyle });
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
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'إلغاء',
            ...swalConfirmDelete
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

            Swal.fire({ text: 'تم حذف المستخدم بنجاح', icon: 'success', ...swalStyle });

            setUsers(users.filter(u => u.user_id !== userId));

        } catch (err) {
            Swal.fire({ text: 'فشل حذف المستخدم', icon: 'error', ...swalStyle });
            console.error(err);
        }
    };

    const handleEdit = (userId) => {
        navigate(`/user-form?id=${userId}`);
    };

    const roleMap = {
        0: { label: "مسؤول النظام", color: "bg-slate-100 text-slate-700 border-slate-200" },
        1: { label: "مدير", color: "bg-[#219ebc]/10 text-[#219ebc] border-[#219ebc]/20" },
        2: { label: "موظف", color: "bg-amber-50 text-amber-700 border-amber-200" },
        3: { label: "مسؤول", color: "bg-slate-50 text-slate-600 border-slate-200" }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.03 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 4 },
        show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="w-full flex justify-center pb-8"
        >
            <div className="w-full max-w-7xl space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <h4 className="text-xl font-semibold text-slate-900">إدارة المستخدمين</h4>
                        <p className="text-slate-500 mt-1 text-sm">إدارة حسابات وصلاحيات الطاقم الإداري للجامعة</p>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/user-form')}
                        className="flex items-center gap-2 bg-[#219ebc] hover:bg-[#1a8ba6] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
                    >
                        <UserPlus size={16} />
                        إضافة مستخدم
                    </motion.button>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-medium uppercase tracking-wider">
                                    <th className="px-6 py-3.5">الاسم</th>
                                    <th className="px-6 py-3.5">البريد الإلكتروني</th>
                                    <th className="px-6 py-3.5">المستوى</th>
                                    <th className="px-6 py-3.5">الإدارة</th>
                                    <th className="px-6 py-3.5 w-28 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="divide-y divide-slate-100 text-sm"
                            >
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-3/4"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-5/6"></div></td>
                                            <td className="px-6 py-4"><div className="h-5 bg-slate-100 animate-pulse rounded w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-1/2"></div></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="h-8 w-8 bg-slate-100 animate-pulse rounded-lg"></div>
                                                    <div className="h-8 w-8 bg-slate-100 animate-pulse rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (!users || users.length === 0) ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                                                    <Inbox size={32} className="text-slate-300" />
                                                </div>
                                                <p className="text-base font-medium text-slate-500">لا توجد سجلات بالنظام</p>
                                                <p className="text-sm mt-1 text-slate-400">قاعدة البيانات الحالية فارغة من المستخدمين</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence>
                                        {(users || []).map((user) => {
                                            const role = roleMap[user.role_level] || { label: user.role_level, color: "bg-slate-50 text-slate-600 border-slate-200" };

                                            return (
                                                <motion.tr
                                                    key={user.user_id}
                                                    variants={itemVariants}
                                                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                                    className="group hover:bg-slate-50 transition-colors duration-100"
                                                >
                                                    <td className="px-6 py-4 font-medium text-slate-900">
                                                        {user.full_name}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border ${role.color}`}>
                                                            {role.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {user.department_name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => handleEdit(user.user_id)}
                                                                className="p-2 text-slate-400 hover:text-[#219ebc] hover:bg-[#219ebc]/5 rounded-lg transition-colors"
                                                                title="تعديل"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(user.user_id)}
                                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="حذف"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )
                                        })}
                                    </AnimatePresence>
                                )}
                            </motion.tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Users;
