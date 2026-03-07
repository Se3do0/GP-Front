import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, PlusCircle, Inbox } from 'lucide-react';

const swalStyle = {
    confirmButtonColor: '#219ebc',
    customClass: { popup: 'rounded-xl shadow-lg', confirmButton: 'rounded-lg font-medium' }
};

const swalConfirmDelete = {
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#e2e8f0',
    customClass: { popup: 'rounded-xl shadow-lg', confirmButton: 'rounded-lg font-medium px-5', cancelButton: 'rounded-lg font-medium px-5 !text-slate-700' }
};

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Add form state
    const [deptName, setDeptName] = useState("");
    const [collegeId, setCollegeId] = useState("");
    const [roleId, setRoleId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const BASE_URL = "https://ghared-project-1lb7.onrender.com";

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("adminToken");

            // Fetch Colleges for the dropdown
            const colRes = await fetch(`${BASE_URL}/api/org/colleges`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const colJson = await colRes.json();
            if (colJson.status === "success") {
                setColleges(colJson.data.colleges || []);
            }

            // Fetch Departments
            const depRes = await fetch(`${BASE_URL}/api/org/departments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const depJson = await depRes.json();

            if (depJson.status === "success") {
                if (depJson.data && Array.isArray(depJson.data.departments)) {
                    setDepartments(depJson.data.departments);
                } else if (Array.isArray(depJson.data)) {
                    setDepartments(depJson.data);
                } else {
                    setDepartments([]);
                }
            } else {
                setDepartments([]);
            }

        } catch (err) {
            Swal.fire({ text: 'فشل تحميل البيانات', icon: 'error', ...swalStyle });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddDepartment = async (e) => {
        e.preventDefault();

        if (!deptName.trim() || !collegeId || !roleId) {
            Swal.fire({ text: 'يرجى ملء جميع الحقول', icon: 'warning', ...swalStyle });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`${BASE_URL}/api/org/departments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                },
                body: JSON.stringify({
                    departmentName: deptName.trim(),
                    collegeId: Number(collegeId),
                    roleId: Number(roleId)
                })
            });

            const data = await res.json();
            if (data.status !== "success") throw new Error();

            Swal.fire({ text: 'تم إضافة القسم بنجاح', icon: 'success', ...swalStyle });

            setDeptName("");
            setCollegeId("");
            setRoleId("");
            fetchData();

        } catch (err) {
            Swal.fire({ text: 'فشل إضافة القسم', icon: 'error', ...swalStyle });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
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
            const res = await fetch(`${BASE_URL}/api/org/departments/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
            });

            const data = await res.json();
            if (data.status !== "success") throw new Error();

            Swal.fire({ text: 'تم حذف القسم بنجاح', icon: 'success', ...swalStyle });
            setDepartments(departments.filter(d => d.department_id !== id));

        } catch (err) {
            Swal.fire({ text: 'فشل حذف القسم', icon: 'error', ...swalStyle });
            console.error(err);
        }
    };

    const handleEdit = async (id, currentName) => {
        const { value: newName } = await Swal.fire({
            title: 'أدخل الاسم الجديد للقسم:',
            input: 'text',
            inputValue: currentName,
            showCancelButton: true,
            confirmButtonColor: '#219ebc',
            cancelButtonColor: '#e2e8f0',
            cancelButtonText: 'إلغاء',
            customClass: { popup: 'rounded-xl shadow-lg', confirmButton: 'rounded-lg font-medium', cancelButton: 'rounded-lg font-medium !text-slate-700', input: 'border-slate-200 focus:ring-[#219ebc] rounded-lg' }
        });

        if (newName && newName.trim() && newName.trim() !== currentName) {
            try {
                const res = await fetch(`${BASE_URL}/api/org/departments/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    },
                    body: JSON.stringify({ departmentName: newName.trim() })
                });

                const data = await res.json();
                if (data.status !== "success") throw new Error();

                Swal.fire({ text: 'تم تحديث القسم بنجاح', icon: 'success', ...swalStyle });
                fetchData();

            } catch (err) {
                Swal.fire({ text: 'فشل تحديث القسم', icon: 'error', ...swalStyle });
                console.error(err);
            }
        }
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

                {/* Header / Form Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <h4 className="text-xl font-semibold text-slate-900">إدارة الأقسام</h4>
                        <p className="text-slate-500 mt-1 text-sm">إضافة وتنظيم الأقسام الإدارية والوظيفية للجامعة</p>
                    </div>

                    <form onSubmit={handleAddDepartment} className="mt-5 flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="اسم القسم الجديد..."
                                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] px-4 py-2.5 outline-none transition-colors placeholder-slate-400"
                                value={deptName}
                                onChange={(e) => setDeptName(e.target.value)}
                            />
                        </div>
                        <div className="md:w-48">
                            <select
                                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] px-4 py-2.5 outline-none transition-colors appearance-none"
                                value={collegeId}
                                onChange={(e) => setCollegeId(e.target.value)}
                            >
                                <option value="">اختر الكلية</option>
                                {colleges.map(c => (
                                    <option key={c.college_id} value={c.college_id}>{c.college_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:w-48">
                            <select
                                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] px-4 py-2.5 outline-none transition-colors appearance-none"
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
                            >
                                <option value="">الصلاحية الافتراضية</option>
                                <option value="1">مدير</option>
                                <option value="2">موظف</option>
                            </select>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#219ebc] hover:bg-[#1a8ba6] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
                        >
                            <PlusCircle size={16} />
                            إضافة قسم
                        </motion.button>
                    </form>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-medium uppercase tracking-wider">
                                    <th className="px-6 py-3.5 w-20">الرقم</th>
                                    <th className="px-6 py-3.5">القسم</th>
                                    <th className="px-6 py-3.5">الكلية التابع لها</th>
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
                                    Array.from({ length: 4 }).map((_, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-10"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-3/4"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-1/2"></div></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="h-8 w-8 bg-slate-100 animate-pulse rounded-lg"></div>
                                                    <div className="h-8 w-8 bg-slate-100 animate-pulse rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (!departments || departments.length === 0) ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                                                    <Inbox size={32} className="text-slate-300" />
                                                </div>
                                                <p className="text-base font-medium text-slate-500">لا توجد سجلات بالنظام</p>
                                                <p className="text-sm mt-1 text-slate-400">قاعدة البيانات الحالية فارغة من الأقسام</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence>
                                        {(departments || []).map((dept) => (
                                            <motion.tr
                                                key={dept.department_id}
                                                variants={itemVariants}
                                                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                                className="group hover:bg-slate-50 transition-colors duration-100"
                                            >
                                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                                                    #{dept.department_id}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {dept.department_name}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {dept.college_name ? (
                                                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium border border-slate-200 text-slate-600">
                                                            {dept.college_name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => handleEdit(dept.department_id, dept.department_name)}
                                                            className="p-2 text-slate-400 hover:text-[#219ebc] hover:bg-[#219ebc]/5 rounded-lg transition-colors"
                                                            title="تعديل"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(dept.department_id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="حذف"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
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

export default Departments;
