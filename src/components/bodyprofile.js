import "../components/bodyprofile.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfileBody() {
  // Provide basic parameter
  const navigate = useNavigate(); // ใช้ useNavigate
  const [userData, setUserData] = useState(null); // ใช้ useState เก็บข้อมูลจาก API
  const [loading, setLoading] = useState(true); // เช็คสถานะการโหลดข้อมูล
  const [error, setError] = useState(""); // เพิ่ม state สำหรับ error message
  const location = useLocation();
  const { email } = location.state || {}; // ดึงข้อมูลที่ส่งมาจาก state

  console.log(email); // ตรวจสอบค่า email ที่ได้รับ

  useEffect(() => {
    if (!email) return; // ถ้าไม่มี email ให้หยุดการดึงข้อมูล

    const fetchUserData = async () => {
      try {
        // ใช้ email แทน mainname ในการดึงข้อมูลจาก API
        const response = await fetch(
          `https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/profile_users/by-email/${email}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.statusText}`);
        }

        const data = await response.json();
        setUserData(data); // อัพเดต state ด้วยข้อมูลที่ได้จาก API
        setLoading(false); // เปลี่ยนสถานะการโหลดข้อมูล
        console.log("Data received:", data); // ตรวจสอบข้อมูลที่ได้รับจาก API
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // ถ้าเกิด error ก็ให้หยุดการโหลด
        setError(error.message); // เก็บข้อความ error
      }
    };

    fetchUserData();
  }, [email]); // useEffect จะรันใหม่ทุกครั้งที่ email เปลี่ยน

  // ถ้ายังโหลดข้อมูลไม่เสร็จ
  if (loading) {
    return <div>Loading...</div>;
  }

  // ถ้ามีข้อผิดพลาดเกิดขึ้น
  if (error) {
    return <div>{error}</div>;
  }

  // ตรวจสอบว่ามีข้อมูลใน userData หรือไม่
  const mainname = userData?.profile_user?.name;
  const enduBTN = userData?.profile_user?.enduBTN || 0; // กำหนดค่า default เป็น 0 ถ้าไม่พบข้อมูล
  const yourStatus = userData?.profile_user?.status;

  return (
    <div className="main">
      <div className="Mainbody">
        <div className="headerprofile">
          {/* <div>Good Afternoon {mainname}</div> */}
          <div>
  Good Afternoon <span className="highlightName">{mainname}</span>
</div>


          <div style={{ fontSize: 45 }}>
            <i className="fa-solid fa-circle-user"></i>
          </div>
        </div>

        {/* <div className="mainStatus">
                    <div>วันนี้คุณคิดอะไรอยู่ ? :</div>
                    <div className="DisStatus">{yourStatus}</div>
                    <div className="btnStatus">แก้ไขสถานะ</div>
                </div> */}

        <div className="mainStatus">
          <div>วันนี้คุณคิดอะไรอยู่ ? :</div>
          <div className="DisStatus highlightStatus">{yourStatus}</div>
          <div
            className="btnStatus"
            onClick={async () => {
              const newStatus = window.prompt(
                "กรุณากรอกสถานะใหม่:",
                yourStatus
              );
              if (newStatus === null || newStatus.trim() === "") return; // ถ้า Cancel หรือว่าง ไม่ทำอะไร

              const updatedProfile = {
                ...userData.profile_user,
                status: newStatus,
              };

              try {
                await axios.put(
                  `https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/profile_users/name/${updatedProfile.name}`,
                  updatedProfile
                );
                setUserData((prev) => ({
                  ...prev,
                  profile_user: {
                    ...prev.profile_user,
                    status: newStatus,
                  },
                }));
                alert("อัปเดตสถานะเรียบร้อยแล้ว!");
              } catch (error) {
                console.error("Error updating status:", error);
                alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
              }
            }}
          >
            แก้ไขสถานะ
          </div>
        </div>

        <div className="contentprofile">
          <div className="text1">วันนี้ คุณได้ให้กำลังใจคนอื่นไปแล้ว</div>
          <div className="text3">{enduBTN} คน</div>
        </div>
        <div className="buttomprofile">
          <div className="text4">
            ขอแสดงความยินดีกับคุณด้วยที่มีเมตตากับคนอื่น
          </div>
        </div>
      </div>

      <div className="recentComments">
        <div style={{ fontWeight: "bold" }}>มีคนมาให้กำลังใจเรา ล่าสุด! :</div>
        <ul>
          {userData?.profile_user?.comments
            ?.slice(-5)
            .reverse()
            .map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
        </ul>
      </div>

      <div className="btnheart" onClick={() => navigate("/public",{state:{email}})}>
        <div>ไปให้กำลังใจคนอื่นกัน !!!</div>
        <div style={{ fontSize: 45 }}>
          <i className="fa-solid fa-hand-holding-heart"></i>
        </div>
      </div>

      <div className="btnLogout" onClick={() => navigate("/")}>
        <div>ออกจากระบบ</div>
        <div style={{ fontSize: 45 }}></div>
      </div>

      {/* {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>แก้ไขสถานะของคุณ</h3>
                        <input
                            type="text"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            style={{ marginBottom: "10px", width: "100%", padding: "5px" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button onClick={handleSaveStatus}>Save</button>
                            <button onClick={() => setShowPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )} */}
    </div>
  );
}
