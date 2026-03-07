import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from '../../assets/hurghada-logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const BASE_URL = "https://ghared-project-1lb7.onrender.com";

    // Add RTL class to body purely for safety, though admin.css does this globally
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
                confirmButtonColor: '#219ebc'
            });
            return;
        }

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
                confirmButtonColor: '#219ebc'
            });
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="logo-container">
                    <img src={logo} alt="شعار جامعة الغردقة" />
                </div>

                <h3>تسجيل الدخول</h3>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">البريد الإلكتروني</label>
                        <input
                            type="email"
                            className="form-control"
                            dir="ltr"
                            placeholder="admin@hurghada.edu.eg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">كلمة المرور</label>
                        <input
                            type="password"
                            className="form-control"
                            dir="ltr"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        دخول المسؤول
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
