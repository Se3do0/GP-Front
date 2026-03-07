import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from '../assets/hurghada-logo.png';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'نعم، تسجيل خروج',
            cancelButtonText: 'إلغاء'
        });

        if (result.isConfirmed) {
            localStorage.removeItem("adminToken");
            navigate("/login");
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-custom px-4">
                <div className="container-fluid d-flex justify-content-between align-items-center">

                    <div className="d-flex align-items-center gap-2">
                        <img
                            src={logo}
                            alt="شعار جامعة الغردقة"
                            className="navbar-logo"
                        />
                        <span className="navbar-brand fw-bold mb-0">
                            جامعة الغردقة
                        </span>
                    </div>

                    <ul className="navbar-nav d-flex flex-row gap-3 align-items-center mb-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">إدارة المستخدمين</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/departments">إدارة الأقسام</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/colleges">إدارة الكليات</NavLink>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-danger" href="#" onClick={handleLogout}>
                                تسجيل الخروج
                            </a>
                        </li>
                    </ul>

                </div>
            </nav>

            <main className="container mt-4">
                <Outlet />
            </main>
        </>
    );
};

export default AdminLayout;
