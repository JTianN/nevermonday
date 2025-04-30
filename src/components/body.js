import "../components/body.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { login } from "../components/authservice";

export default function BodyMain() {
  //Provide all parameters
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [resulta, setResulta] = useState("");
  const navigate = useNavigate();  // ใช้ useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password });
      setMessage(result.message);
      console.log(result.message);
      // ต่อไปอาจจะ setToken(), redirect ไปหน้า dashboard, etc.
       // ถ้าล็อกอินสำเร็จ, เราจะไปที่หน้า Dashboard
      // navigate('/home',{state:{email}}); // เปลี่ยนไปที่ '/dashboard'
///////////////////////////////////////
      // ตรวจสอบค่า status จากผลการ login
      const userStatus = result.status; // สมมติว่า result จะมีฟิลด์ status ที่ส่งกลับมาจาก backend
        // กำหนดข้อความที่จะแสดงตามค่า status
      let statusMessage = '';
      if (userStatus === "0") {
        statusMessage = "ยังไม่อัพข้อมูล"; // ถ้า status เป็น "0"
        navigate('/register',{state:{email}});
      } else if (userStatus === "1") {
        statusMessage = "อัพข้อมูลแล้ว"; // ถ้า status เป็น "1"
        navigate('/home',{state:{email}}); // เปลี่ยนไปที่ '/home'
      }
      else {
        statusMessage = "สถานะไม่ถูกต้อง"; // ถ้า status ไม่ใช่ "0" หรือ "1"
        console.log("status ไม่ถูกต้อง:", userStatus); // แสดงค่าที่ไม่คาดหวัง
      }

       // แสดงข้อความในหน้าจอ
      setMessage(statusMessage);
      console.log(statusMessage);

      // ส่ง email และ status ไปที่หน้า '/home'
      // navigate('/home', { state: { email, status: userStatus } }); // เปลี่ยนไปที่ '/home'
/////////////////////////////////////////////      


    } catch (err) {
      setMessage(err.message);
      console.log(err.message);
    }
  };

  const mockupData = () => {
    console.log("show data");
  };



  return (
    <div>
      <div className="mainbody">
        <div className = "firstbox">
          <div className="textheader">Help us comfort each other.</div>
          <div className="animalicon">
            <div style={{ fontSize: 350, fontWeight: 500 }}>
              <i class="fa-solid fa-otter" style={{ color: "gray" }}></i>
            </div>
            <div style={{ fontSize: 100, fontWeight: 100 }}>
              <i class="fa-solid fa-heart" style={{ color: "pink" }}></i>
            </div>
          </div>
        </div>

        <div className = "twobox">
            <div className = "bgLogin">
                <h2>Login to Your Account</h2>
                <form className = "formbtn" onSubmit={handleLogin} >
                    <input type="text" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {/* <button type="submit" className = "loginbtn" onClick={mockupData}>Login</button> 
                    <div className="loginbtn" onClick={handleLogin}> Login </div> */}
                    <button type="submit" className="loginbtn">Login</button>
                    <p>Don't have an account? <a href="/remember">  Register here</a>.</p>
                </form>

            </div>
        </div>
      </div>
    </div>
  );
}
