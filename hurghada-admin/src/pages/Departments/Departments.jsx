import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Pencil, Trash2, PlusCircle, Inbox } from 'lucide-react';

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
                // Determine structure
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
            Swal.fire({ text: 'فشل تحميل البيانات', icon: 'error', confirmButtonColor: '#219ebc' });
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
            Swal.fire({ text: 'يرجى ملء جميع الحقول', icon: 'warning', confirmButtonColor: '#219ebc' });
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

            Swal.fire({ text: 'تم إضافة القسم بنجاح', icon: 'success', confirmButtonColor: '#219ebc', customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' } });

            setDeptName("");
            setCollegeId("");
            setRoleId("");
            fetchData();

        } catch (err) {
            Swal.fire({ text: 'فشل إضافة القسم', icon: 'error', confirmButtonColor: '#219ebc' });
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
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'إلغاء',
            customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl', cancelButton: 'rounded-xl' }
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`${BASE_URL}/api/org/departments/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
            });

            const data = await res.json();
            if (data.status !== "success") throw new Error();

            Swal.fire({ text: 'تم حذف القسم بنجاح', icon: 'success', confirmButtonColor: '#219ebc', customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' } });
            setDepartments(departments.filter(d => d.department_id !== id));

        } catch (err) {
            Swal.fire({ text: 'فشل حذف القسم', icon: 'error', confirmButtonColor: '#219ebc' });
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
            cancelButtonText: 'إلغاء',
            customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl border-0', cancelButton: 'rounded-xl border-0' }
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

                Swal.fire({ text: 'تم تحديث القسم بنجاح', icon: 'success', confirmButtonColor: '#219ebc', customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' } });
                fetchData();

            } catch (err) {
                Swal.fire({ text: 'فشل تحديث القسم', icon: 'error', confirmButtonColor: '#219ebc' });
                console.error(err);
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
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
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h4 className="text-2xl font-bold tracking-tight text-[#0b3d59]">إدارة الأقسام</h4>
                        <p className="text-slate-500 mt-1 text-sm">إدارة الأقسام التابعة لكليات الجامعة</p>
                    </div>

                    {/* Add Department Form */}
                    <form onSubmit={handleAddDepartment} className="mt-6 flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="اسم القسم الجديد..."
                            className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-[#219ebc]/30 focus:border-[#219ebc] px-4 py-3 outline-none transition-all"
                            value={deptName}
                            onChange={(e) => setDeptName(e.target.value)}
                        />
                        <select
                            className="sm:w-48 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-[#219ebc]/30 focus:border-[#219ebc] px-4 py-3 outline-none transition-all appearance-none"
                            value={collegeId}
                            onChange={(e) => setCollegeId(e.target.value)}
                        >
                            <option value="">اختر الكلية</option>
                            {colleges.map(c => (
                                <option key={c.college_id} value={c.college_id}>{c.college_name}</option>
                            ))}
                        </select>
                        <select
                            className="sm:w-40 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-[#219ebc]/30 focus:border-[#219ebc] px-4 py-3 outline-none transition-all appearance-none"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                        >
                            <option value="">اختر الصلاحية</option>
                            <option value="1">مدير</option>
                            <option value="2">موظف</option>
                        </select>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-l from-[#219ebc] to-[#0b3d59] text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 whitespace-nowrap"
                        >
                            <PlusCircle size={18} />
                            إضافة
                        </motion.button>
                    </form>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold tracking-wide">
                                    <th className="px-6 py-4 w-24">الرقم</th>
                                    <th className="px-6 py-4">القسم</th>
                                    <th className="px-6 py-4">الكلية التابع لها</th>
                                    <th className="px-6 py-4 w-32 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse bg-white">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                                                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (!departments || departments.length === 0) ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex flex-col items-center justify-center text-slate-400"
                                            >
                                                <div className="w-20 h-20 bg-slate-50/80 rounded-full flex items-center justify-center mb-4 ring-8 ring-slate-50">
                                                    <Inbox size={40} className="text-slate-300" />
                                                </div>
                                                <p className="text-lg font-bold text-slate-500">لا توجد أقسام مسجلة حالياً</p>
                                            </motion.div>
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence>
                                        {(departments || []).map((dept) => (
                                            <motion.tr
                                                key={dept.department_id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="show"
                                                exit={{ opacity: 0, x: -20, backgroundColor: "#fef2f2", transition: { duration: 0.2 } }}
                                                className="group transition-colors hover:bg-slate-50/80"
                                            >
                                                <td className="px-6 py-4 text-slate-400 font-mono">
                                                    #{dept.department_id}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-800">
                                                    {dept.department_name}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 font-medium">
                                                    {dept.college_name || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, backgroundColor: "#f0f9ff" }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleEdit(dept.department_id, dept.department_name)}
                                                            className="p-2 text-[#219ebc] bg-white border border-slate-200 hover:border-[#219ebc]/30 rounded-xl transition-colors shadow-sm cursor-pointer"
                                                            title="تعديل"
                                                        >
                                                            <Pencil size={16} strokeWidth={2.5} />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, backgroundColor: "#fef2f2" }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDelete(dept.department_id)}
                                                            className="p-2 text-red-500 bg-white border border-slate-200 hover:border-red-200 rounded-xl transition-colors shadow-sm cursor-pointer"
                                                            title="حذف"
                                                        >
                                                            <Trash2 size={16} strokeWidth={2.5} />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
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

export default Departments;
