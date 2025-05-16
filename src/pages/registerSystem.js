import BodyMain from "../components/body";
import Header from "../components/header";
import "../pages/registerSystem.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from "react";

export default function PageRegister() {
    // Setup pre-parameters
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};  // เอา email มาจาก login page
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");  // รองรับข้อความหลายบรรทัด
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        try {
            // 1. Update status: 1 for the user
            const updateResponse = await fetch(`https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/update/${email}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: "dummy",
                    status: "1"
                }),
            });

            if (!updateResponse.ok) {
                throw new Error("Update user status failed");
            }

            // 2. Create profile_user with email, name, status, and other fields
            const profileResponse = await fetch("https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/profile_users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    name: name,
                    status: status.trim(),  // ตัดช่องว่างท้าย
                    comments: null,
                    enduBTN: "0"
                }),
            });

            if (!profileResponse.ok) {
                throw new Error("Create profile user failed");
            }

            setMessage("บันทึกข้อมูลเรียบร้อยแล้ว!");
            navigate('/home', { state: { email } });
        } catch (error) {
            console.error(error);
            setMessage(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
        }
    };

    return (
        <div>
            <Header />
            <div className="mainregister">
                <div className="TextHeader">กรอกข้อมูล เพื่อใช้งานระบบของเรา</div>
                <div className="bodyRegister">
                    <div>name</div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="กรอกชื่อของคุณ"
                    />

                    <div>status</div>
                    <textarea
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        rows={4}
                        maxLength={500}
                        placeholder="เช่น ฉันเป็นเกษตรกรอินทรีย์ 🥬\nเลี้ยงไก่ เลี้ยงวัว 🐔🐄"
                        style={{ width: "100%", resize: "vertical" }}
                    />
                    <div style={{ fontSize: "0.9em", color: "#555" }}>
                        {status.length}/500 ตัวอักษร
                    </div>

                    <button onClick={handleSave}>บันทึก</button>

                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
}


