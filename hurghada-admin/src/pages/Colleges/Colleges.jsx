import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Pencil, Trash2, PlusCircle, Inbox } from 'lucide-react';

const Colleges = () => {
    const [colleges, setColleges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [collegeName, setCollegeName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const BASE_URL = "https://ghared-project-1lb7.onrender.com";

    const fetchColleges = async () => {
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
            Swal.fire({ text: 'فشل تحميل الكليات', icon: 'error', confirmButtonColor: '#219ebc' });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    const handleAddCollege = async (e) => {
        e.preventDefault();

        if (!collegeName.trim()) {
            Swal.fire({ text: 'يرجى إدخال اسم الكلية', icon: 'warning', confirmButtonColor: '#219ebc' });
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

            Swal.fire({ text: 'تم إضافة الكلية بنجاح', icon: 'success', confirmButtonColor: '#219ebc', customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' } });

            setCollegeName("");
            fetchColleges();

        } catch (err) {
            Swal.fire({ text: 'فشل إضافة الكلية', icon: 'error', confirmButtonColor: '#219ebc' });
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
            const res = await fetch(`${BASE_URL}/api/org/colleges/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
            });

            const data = await res.json();
            if (data.status !== "success") throw new Error();

            Swal.fire({ text: 'تم حذف الكلية بنجاح', icon: 'success', confirmButtonColor: '#219ebc', customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' } });
            setColleges(colleges.filter(c => c.college_id !== id));

        } catch (err) {
            Swal.fire({ text: 'فشل حذف الكلية', icon: 'error', confirmButtonColor: '#219ebc' });
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
            cancelButtonText: 'إلغاء',
            customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl border-0', cancelButton: 'rounded-xl border-0' }
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

                Swal.fire({ text: 'تم تحديث الكلية بنجاح', icon: 'success', confirmButtonColor: '#219ebc', customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' } });
                fetchColleges();

            } catch (err) {
                Swal.fire({ text: 'فشل تحديث الكلية', icon: 'error', confirmButtonColor: '#219ebc' });
                console.error(err);
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
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h4 className="text-2xl font-bold tracking-tight text-[#0b3d59]">إدارة الكليات</h4>
                        <p className="text-slate-500 mt-1 text-sm">إدارة المؤسسات والكليات الجامعية</p>
                    </div>

                    {/* Add College Form */}
                    <form onSubmit={handleAddCollege} className="flex flex-row gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="اسم الكلية الجديد..."
                            className="w-full sm:w-64 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-[#219ebc]/30 focus:border-[#219ebc] px-4 py-3 outline-none transition-all"
                            value={collegeName}
                            onChange={(e) => setCollegeName(e.target.value)}
                        />
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
                                    <th className="px-6 py-4">اسم الكلية</th>
                                    <th className="px-6 py-4 w-32 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse bg-white">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                                                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (!colleges || colleges.length === 0) ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-20 text-center">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex flex-col items-center justify-center text-slate-400"
                                            >
                                                <div className="w-20 h-20 bg-slate-50/80 rounded-full flex items-center justify-center mb-4 ring-8 ring-slate-50">
                                                    <Inbox size={40} className="text-slate-300" />
                                                </div>
                                                <p className="text-lg font-bold text-slate-500">لا توجد كليات مسجلة حالياً</p>
                                            </motion.div>
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence>
                                        {(colleges || []).map((coll) => (
                                            <motion.tr
                                                key={coll.college_id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="show"
                                                exit={{ opacity: 0, x: -20, backgroundColor: "#fef2f2", transition: { duration: 0.2 } }}
                                                className="group transition-colors hover:bg-slate-50/80"
                                            >
                                                <td className="px-6 py-4 text-slate-400 font-mono">
                                                    #{coll.college_id}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-800">
                                                    {coll.college_name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, backgroundColor: "#f0f9ff" }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleEdit(coll.college_id, coll.college_name)}
                                                            className="p-2 text-[#219ebc] bg-white border border-slate-200 hover:border-[#219ebc]/30 rounded-xl transition-colors shadow-sm cursor-pointer"
                                                            title="تعديل"
                                                        >
                                                            <Pencil size={16} strokeWidth={2.5} />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, backgroundColor: "#fef2f2" }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDelete(coll.college_id)}
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

export default Colleges;
