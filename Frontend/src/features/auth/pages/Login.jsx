import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth.js";

const SparkleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor" />
  </svg>
);

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({ email, password });
        navigate('/');
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <h2 className="auth-header__title">Loading...</h2>
                </div>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-header__icon"><SparkleIcon /></div>
                    <h1 className="auth-header__title">Welcome Back</h1>
                    <p className="auth-header__subtitle">Log in to access your interview strategies.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" name="email" id="email" placeholder='Enter your Email Address' required />
                    </div>
                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" name="password" id="password" placeholder='Enter your password' required />
                    </div>

                    <button className='auth-btn'>Login</button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to={"/register"}>Register Now</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Login;