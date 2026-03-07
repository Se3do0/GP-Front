import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Users = () => {
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

            setUsers(json.data.users);

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
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'إلغاء'
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

            Swal.fire({ text: 'تم حذف المستخدم بنجاح', icon: 'success', confirmButtonColor: '#219ebc' });
            // Update local state instead of re-fetching
            setUsers(users.filter(u => u.user_id !== userId));

        } catch (err) {
            Swal.fire({ text: 'فشل حذف المستخدم', icon: 'error', confirmButtonColor: '#219ebc' });
            console.error(err);
        }
    };

    const handleEdit = (userId) => {
        // Will be implemented later with user-form
        console.log("Edit user", userId);
    };

    const roleMap = {
        0: "مسؤول النظام",
        1: "مدير",
        2: "موظف",
        3: "مسؤول"
    };

    return (
        <div>
            <h4 className="fw-bold mb-3">إدارة المستخدمين</h4>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-primary">
                    + إضافة مستخدم
                </button>
            </div>

            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>المستوى</th>
                        <th>الإدارة</th>
                        <th width="120">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <tr key={idx} className="skeleton-row">
                                <td><div className="skeleton-box"></div></td>
                                <td><div className="skeleton-box"></div></td>
                                <td><div className="skeleton-box"></div></td>
                                <td><div className="skeleton-box"></div></td>
                                <td><div className="skeleton-box"></div></td>
                            </tr>
                        ))
                    ) : users.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-5">
                                <i className="bi bi-inbox text-muted display-4"></i>
                                <p className="text-muted fw-bold mt-2">لا توجد بيانات مسجلة حالياً</p>
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>{roleMap[user.role_level] ?? user.role_level}</td>
                                <td>{user.department_name}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleEdit(user.user_id)}
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger ms-1"
                                        onClick={() => handleDelete(user.user_id)}
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
