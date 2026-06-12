import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth.js";

// Theme Icon
const SparkleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor" />
  </svg>
);

const Register = () => {
    const { loading, handleRegister } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister({ username, email, password });
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
                    <h1 className="auth-header__title">Create an Account</h1>
                    <p className="auth-header__subtitle">Join us to build your winning interview plan.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" name="username" id="username" placeholder='Enter your Username' required />
                    </div>
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
                            type="password" name="password" id="password" placeholder='Enter your Password' required />
                    </div>

                    <button className='auth-btn'>Register</button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to={"/login"}>Login</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Register;