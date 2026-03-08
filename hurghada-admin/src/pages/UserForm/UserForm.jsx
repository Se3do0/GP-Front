import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Save, XCircle, User, Mail, Lock, Building2, Shield } from 'lucide-react';

const swalStyle = {
    confirmButtonColor: '#219ebc',
    customClass: { popup: 'rounded-xl shadow-lg', confirmButton: 'rounded-lg font-medium' }
};

const UserForm = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("id");
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState("");
    const [departmentId, setDepartmentId] = useState("");

    const [departments, setDepartments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const BASE_URL = "https://ghared-project-1lb7.onrender.com";

    useEffect(() => {
        const fetchDepsAndUser = async () => {
            const token = localStorage.getItem("adminToken");
            setIsLoadingData(true);

            try {
                // 1. Fetch departments
                const depRes = await fetch(`${BASE_URL}/api/org/departments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const depJson = await depRes.json();
                if (depJson.status === "success") {
                    setDepartments(depJson.data?.departments || depJson.data || []);
                }

                // 2. Fetch User Data if Edit mode
                if (userId) {
                    const userRes = await fetch(`${BASE_URL}/api/Admin/getAllUsers`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const userJson = await userRes.json();

                    const usersArray = userJson.data?.users || userJson.data || [];
                    const user = usersArray.find(u => Number(u.user_id) === Number(userId));

                    if (user) {
                        setFullName(user.full_name);
                        setEmail(user.email);
                        setRoleId(user.role_level);
                        setDepartmentId(user.department_id || "");
                    } else {
                        Swal.fire({ text: 'المستخدم غير موجود', icon: 'error', ...swalStyle });
                        navigate("/");
                    }
                }
            } catch (err) {
                console.error(err);
                Swal.fire({ text: 'فشل تحميل البيانات', icon: 'error', ...swalStyle });
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchDepsAndUser();
    }, [userId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !departmentId) {
            Swal.fire({ text: 'يرجى مراجعة البريد الإلكتروني والإدارة', icon: 'warning', ...swalStyle });
            return;
        }

        setIsSubmitting(true);
        const payload = {
            email: email.trim(),
            departmentId: Number(departmentId)
        };

        if (fullName.trim()) payload.fullName = fullName.trim();
        if (password.trim()) payload.password = password.trim();

        const token = localStorage.getItem("adminToken");

        try {
            if (userId) {
                // Update User
                payload.roleId = Number(roleId);
                const res = await fetch(`${BASE_URL}/api/Admin/users/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.status !== "success") throw new Error();

                await Swal.fire({ text: 'تم تحديث بيانات المستخدم بنجاح', icon: 'success', ...swalStyle });
            } else {
                // Add User
                const res = await fetch(`${BASE_URL}/api/Admin/AddUser`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.status !== "success") throw new Error();

                await Swal.fire({ text: 'تم إضافة المستخدم بنجاح', icon: 'success', ...swalStyle });
            }
            navigate("/");

        } catch (err) {
            Swal.fire({ text: userId ? 'فشل تحديث المستخدم' : 'فشل إضافة المستخدم', icon: 'error', ...swalStyle });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="w-full flex justify-center pb-8"
        >
            <div className="w-full max-w-3xl">
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">

                    <div className="mb-8 border-b border-slate-200 pb-5">
                        <h4 className="text-xl font-semibold text-slate-900">
                            {userId ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}
                        </h4>
                        <p className="text-slate-500 mt-1 text-sm">أدخل تفاصيل وبيانات المستخدم المطلوبة لتمكينه من استخدام النظام</p>
                    </div>

                    {isLoadingData ? (
                        <div className="space-y-5 animate-pulse">
                            <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                            <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                            <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">الاسم الكامل</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] block py-2.5 pl-4 pr-10 transition-colors outline-none placeholder-slate-400"
                                            placeholder="الاسم الثلاثي..."
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">البريد الإلكتروني <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            dir="ltr"
                                            required
                                            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] block py-2.5 pl-4 pr-10 transition-colors outline-none placeholder-slate-400 text-left"
                                            placeholder="user@hurghada.edu.eg"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">كلمة المرور {userId && <span className="text-slate-400 text-xs font-normal">(أتركه فارغاً إذا لم ترد التغيير)</span>}</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            dir="ltr"
                                            required={!userId}
                                            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] block py-2.5 pl-4 pr-10 transition-colors outline-none placeholder-slate-400 text-left"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Department */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">الإدارة التابع لها <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                                            <Building2 size={18} />
                                        </div>
                                        <select
                                            required
                                            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] block py-2.5 pl-4 pr-10 transition-colors outline-none appearance-none"
                                            value={departmentId}
                                            onChange={(e) => setDepartmentId(e.target.value)}
                                        >
                                            <option value="">اختر الإدارة</option>
                                            {departments.map((dept) => (
                                                <option key={dept.department_id} value={dept.department_id}>
                                                    {dept.department_name} {dept.college_name ? `(${dept.college_name})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Role (Only shown on Edit) */}
                                {userId && (
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">الصلاحية</label>
                                        <div className="relative max-w-[50%]">
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                                                <Shield size={18} />
                                            </div>
                                            <select
                                                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] block py-2.5 pl-4 pr-10 transition-colors outline-none appearance-none"
                                                value={roleId}
                                                onChange={(e) => setRoleId(e.target.value)}
                                            >
                                                <option value="0">مسؤول النظام</option>
                                                <option value="1">مدير</option>
                                                <option value="2">موظف</option>
                                                <option value="3">مسؤول</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pt-6 mt-3 border-t border-slate-200">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#219ebc] hover:bg-[#1a8ba6] text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            <span>حفظ البيانات</span>
                                        </>
                                    )}
                                </motion.button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="px-6 py-2.5 rounded-lg font-medium text-sm text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <XCircle size={16} />
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default UserForm;
