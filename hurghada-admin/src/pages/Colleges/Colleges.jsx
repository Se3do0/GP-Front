import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Pencil, Trash2, PlusCircle, Inbox } from 'lucide-react';

const swalStyle = {
    confirmButtonColor: '#219ebc',
    customClass: { popup: 'rounded-xl shadow-lg', confirmButton: 'rounded-lg font-medium' }
};

const swalConfirmDelete = {
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#e2e8f0',
    customClass: { popup: 'rounded-xl shadow-lg', confirmButton: 'rounded-lg font-medium px-5', cancelButton: 'rounded-lg font-medium px-5 !text-slate-700' }
};

const Colleges = () => {
    const [colleges, setColleges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [collegeName, setCollegeName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const BASE_URL = "https://ghared-project-1lb7.onrender.com";

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${BASE_URL}/api/org/colleges`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();

            if (json.status === "success") {
                if (json.data && Array.isArray(json.data.colleges)) {
                    setColleges(json.data.colleges);
                } else if (Array.isArray(json.data)) {
                    setColleges(json.data);
                } else {
                    setColleges([]);
                }
            } else {
                setColleges([]);
            }

        } catch (err) {
            Swal.fire({ text: 'فشل تحميل الكليات', icon: 'error', ...swalStyle });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCollege = async (e) => {
        e.preventDefault();

        if (!collegeName.trim()) {
            Swal.fire({ text: 'يرجى إدخال اسم الكلية', icon: 'warning', ...swalStyle });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`${BASE_URL}/api/org/colleges`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                },
                body: JSON.stringify({ collegeName: collegeName.trim() })
            });

            const data = await res.json();
            if (data.status !== "success") throw new Error();

            Swal.fire({ text: 'تم إضافة الكلية بنجاح', icon: 'success', ...swalStyle });
            setCollegeName("");
            fetchData();

        } catch (err) {
            Swal.fire({ text: 'فشل إضافة الكلية', icon: 'error', ...swalStyle });
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
            const res = await fetch(`${BASE_URL}/api/org/colleges/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
            });

            const data = await res.json();
            if (data.status !== "success") throw new Error();

            Swal.fire({ text: 'تم حذف الكلية بنجاح', icon: 'success', ...swalStyle });
            setColleges(colleges.filter(c => c.college_id !== id));

        } catch (err) {
            Swal.fire({ text: 'فشل حذف الكلية', icon: 'error', ...swalStyle });
            console.error(err);
        }
    };

    const handleEdit = async (id, currentName) => {
        const { value: newName } = await Swal.fire({
            title: 'أدخل الاسم الجديد للكلية:',
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
                const res = await fetch(`${BASE_URL}/api/org/colleges/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    },
                    body: JSON.stringify({ collegeName: newName.trim() })
                });

                const data = await res.json();
                if (data.status !== "success") throw new Error();

                Swal.fire({ text: 'تم تحديث الكلية بنجاح', icon: 'success', ...swalStyle });
                fetchData();

            } catch (err) {
                Swal.fire({ text: 'فشل تحديث الكلية', icon: 'error', ...swalStyle });
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
                        <h4 className="text-xl font-semibold text-slate-900">إدارة الكليات</h4>
                        <p className="text-slate-500 mt-1 text-sm">إضافة وتنظيم كليات الجامعة وإدارة بياناتها</p>
                    </div>

                    <form onSubmit={handleAddCollege} className="mt-5 flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="اسم الكلية الجديدة..."
                                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#219ebc]/20 focus:border-[#219ebc] px-4 py-2.5 outline-none transition-colors placeholder-slate-400"
                                value={collegeName}
                                onChange={(e) => setCollegeName(e.target.value)}
                            />
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#219ebc] hover:bg-[#1a8ba6] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
                        >
                            <PlusCircle size={16} />
                            إضافة كلية
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
                                    <th className="px-6 py-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <GraduationCap size={14} className="text-slate-400" />
                                            اسم الكلية
                                        </div>
                                    </th>
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
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="h-8 w-8 bg-slate-100 animate-pulse rounded-lg"></div>
                                                    <div className="h-8 w-8 bg-slate-100 animate-pulse rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (!colleges || colleges.length === 0) ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                                                    <Inbox size={32} className="text-slate-300" />
                                                </div>
                                                <p className="text-base font-medium text-slate-500">لا توجد سجلات بالنظام</p>
                                                <p className="text-sm mt-1 text-slate-400">قاعدة البيانات الحالية فارغة من الكليات</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence>
                                        {(colleges || []).map((college) => (
                                            <motion.tr
                                                key={college.college_id}
                                                variants={itemVariants}
                                                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                                className="group hover:bg-slate-50 transition-colors duration-100"
                                            >
                                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                                                    #{college.college_id}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {college.college_name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => handleEdit(college.college_id, college.college_name)}
                                                            className="p-2 text-slate-400 hover:text-[#219ebc] hover:bg-[#219ebc]/5 rounded-lg transition-colors"
                                                            title="تعديل"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(college.college_id)}
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

export default Colleges;
