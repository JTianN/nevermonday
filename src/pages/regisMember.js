import "../pages/regisMember.css"
import Header from "../components/header";
import ProfileBody from "../components/bodyprofile";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from "react";


export default function PageRegisMember() {
    const [email, setEmail] = useState("");  // ให้ลูกค้ากรอกเอง
    const [pass,setPass] = useState("");
    const [messageAcc, setMessageAcc] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleRegisACC = async () => {
        try{
             // 1. Create users
             const userResponse = await fetch("https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,        // เพิ่ม email ไปใน body
                    password: pass,          // รหัส
                }),
            });

            if (!userResponse.ok) {
                throw new Error("register user failed");
            }

            setMessageAcc("สร้างบัญชีเรียบร้อย!");
            // Navigate to home page after successful save
            navigate('/register', { state: { email } });


        } catch(error) {
            console.error(error);

        }
    };

    console.log(email);
    console.log(pass);




    return(
        <div>
            <Header></Header>
            <div className="mainACC">
            <div className="mainRegisterAcc">
                <div className="HeaderRegis">สมัครสมาชิก</div>
                <div className="textAcc">* Name</div>
                <input className="textAcc" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <div className="textAcc">* Password</div>
                <input className="textAcc" value={pass} onChange={(e) => setPass(e.target.value)}></input>
                <button className="BTNregisAcc" onClick={handleRegisACC}>สมัครสมาชิก</button>
            </div>

            </div>
        </div>
    );
}