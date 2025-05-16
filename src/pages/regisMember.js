import "../pages/regisMember.css";
import Header from "../components/header";
import ProfileBody from "../components/bodyprofile";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from "react";

export default function PageRegisMember() {
    const [email, setEmail] = useState("");  
    const [pass, setPass] = useState("");
    const [messageAcc, setMessageAcc] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    const handleRegisACC = async () => {
        if (!isValidEmail(email)) {
            setError("กรุณากรอกอีเมลให้ถูกต้อง");
            return;
        }

        try {
            const userResponse = await fetch("https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: pass }),
            });

            if (!userResponse.ok) {
                throw new Error("register user failed");
            }

            setMessageAcc("สร้างบัญชีเรียบร้อย!");
            setError("");
            navigate('/register', { state: { email } });

        } catch (error) {
            console.error(error);
            setError("เกิดข้อผิดพลาดในการสมัครสมาชิก");
        }
    };

    return (
        <div>
            <Header />
            <div className="mainACC">
                <div className="mainRegisterAcc">
                    <div className="HeaderRegis">สมัครสมาชิก</div>

                    <div className="textAcc">* Email</div>
                    <input
                        type="email"
                        className="textAcc"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@example.com"
                        required
                    />

                    <div className="textAcc">* Password</div>
                    <input
                        type="password"
                        className="textAcc"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        required
                    />

                    {error && <div className="error-message" style={{ color: "red", marginTop: "10px" }}>{error}</div>}
                    {messageAcc && <div className="success-message" style={{ color: "green", marginTop: "10px" }}>{messageAcc}</div>}

                    <button className="BTNregisAcc" onClick={handleRegisACC}>สมัครสมาชิก</button>
                </div>
            </div>
        </div>
    );
}
