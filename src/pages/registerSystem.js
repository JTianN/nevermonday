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
    const [status, setStatus] = useState("");  // ให้ลูกค้ากรอกเอง
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        try {
            // 1. Update status: 1 for the user
            const updateResponse = await fetch(`https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/update/${email}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,      // ส่ง email ไปด้วย
                    password: "dummy", // ถ้า backend บังคับส่ง password ใส่อะไรก็ได้ เพราะเราจะเปลี่ยนเฉพาะ status
                    status: "1"        // fix เป็น 1 หลังบ้าน
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
                    email: email,        // เพิ่ม email ไปใน body
                    name: name,          // ชื่อผู้ใช้
                    status: status,      // สถานะที่กรอก
                    comments: null,      // ไม่มี comment ตอนนี้
                    enduBTN: "0"         // ค่าเริ่มต้นปุ่ม
                }),
            });

            if (!profileResponse.ok) {
                throw new Error("Create profile user failed");
            }

            setMessage("บันทึกข้อมูลเรียบร้อยแล้ว!");
            // Navigate to home page after successful save
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
                    <input value={name} onChange={(e) => setName(e.target.value)} />

                    <div>status</div>
                    <input value={status} onChange={(e) => setStatus(e.target.value)} />

                    <button onClick={handleSave}>save</button>

                    {message && <p>{message}</p>} {/* แสดงข้อความ success/error */}
                </div>
            </div>
        </div>
    );
}
