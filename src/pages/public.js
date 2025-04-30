import "../pages/public.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/header";
import { Picker } from "emoji-mart";
import axios from "axios";

export default function PagePublic() {
  // const currentUser = "M9";

  const [peopleList, setPeopleList] = useState([]);
  const [comments, setComments] = useState({});
  const [inputTexts, setInputTexts] = useState("");
  const location = useLocation();
  const { email } = location.state || {}; // ดึงข้อมูลที่ส่งมาจาก state
  const navigate = useNavigate(); // ใช้ useNavigate

  // 🔸 ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(
          "https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/profile_users/latest"
        );
        const fullList = response.data.profile_users;
        // 🔸 กรองเอาคนที่ไม่ใช่ตัวเอง
        const filteredList = fullList.filter(
          (person) => person.email !== email
        );
        const limitedList = filteredList.slice(0, 6); // ✅ จำกัดแค่ 8 คน
        setPeopleList(limitedList);
        console.log(email);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };
    fetchPeople();
  }, [email]);

  // 🔸 อัปเดตข้อความใน input ต่อคน
  const handleInputChange = (name, value) => {
    setInputTexts((prev) => ({ ...prev, [name]: value }));
  };


  const handleCommentSubmit = async (person) => {
    const comment = inputTexts[person.name]?.trim();
    if (!comment) return;
  
    try {
      const res = await axios.get(
        `https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/profile_users/${person.name}`
      );
      
      // เข้าถึงข้อมูลภายใน profile_user
      const latestPerson = res.data.profile_user;
  
      // ตรวจสอบข้อมูลที่ได้
      console.log("📡 API Response:", latestPerson);
  
      if (!latestPerson || !latestPerson.name || !latestPerson.email) {
        alert("ข้อมูลผู้ใช้ไม่สมบูรณ์");
        return;
      }
  
      const updatedComments = [...(latestPerson.comments || []), comment];
  
      const payload = {
        name: latestPerson.name,
        status: latestPerson.status || "",  // ถ้าไม่มี status กำหนดเป็นค่าว่าง
        email: latestPerson.email,
        enduBTN: String(latestPerson.enduBTN) || "0", // ถ้าไม่มี enduBTN ให้เป็น 0
        comments: updatedComments,
      };
  
      console.log("📮 Payload ที่จะส่ง:", payload);
  
      await axios.put(
        `https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/profile_users/name/${person.name}`,
        payload
      );
  
      alert(`ส่งข้อความถึง ${person.name} สำเร็จ!`);
      setInputTexts((prev) => ({ ...prev, [person.name]: "" }));
    } catch (error) {
      console.error("❌ PUT Error:", error.response?.data || error.message);
      alert("เกิดข้อผิดพลาดในการส่งข้อความ");
    }
  };

  const handleEnduBTNClick = async (person) => {
    try {
      // ดึงข้อมูลผู้ใช้จาก API
      const res = await axios.get(
        `https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/profile_users/${person.name}`
      );
      
      const latestPerson = res.data.profile_user;
  
      // ตรวจสอบข้อมูลก่อนดำเนินการ
      console.log("📡 API Response:", latestPerson);
      
      if (!latestPerson || !latestPerson.name || !latestPerson.email) {
        alert("ข้อมูลผู้ใช้ไม่สมบูรณ์");
        return;
      }
  
      // อัปเดตค่า enduBTN (สมมุติว่าเพิ่มขึ้น 1)
      const newEnduBTN = (parseInt(latestPerson.enduBTN) + 1).toString();
  
      // เตรียมข้อมูลที่จะส่งไป
      const payload = {
        name: latestPerson.name,
        status: latestPerson.status || "",  // ถ้าไม่มี status กำหนดเป็นค่าว่าง
        email: latestPerson.email,
        enduBTN: newEnduBTN, // อัปเดตค่า enduBTN ใหม่
        comments: latestPerson.comments || [],
      };
  
      console.log("📮 Payload ที่จะส่ง:", payload);
  
      // ส่งข้อมูลกลับไปที่ API
      await axios.put(
        `https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net/profile_users/name/${person.name}`,
        payload
      );
  
      alert(`อัปเดต enduBTN สำหรับ ${person.name} สำเร็จ!`);
    } catch (error) {
      console.error("❌ PUT Error:", error.response?.data || error.message);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };
  
  

  



  

  return (
    <div>
      <Header />

      <div className="mainpublic">
        <div className="topbar">
          <div className="bodymenu">ชาวดาวโลก</div>
          <div className="bodymenu">เพื่อน</div>
          <div className="bodymenu">ติดตาม</div>
        </div>

        <div className="listpeople">
          {peopleList.map((person, index) => (
            <div key={index}>
              <div className="profileN">
                <div className="peoplecard">
                  <div className="HeadText">{person.name}</div>
                  <div>{person.status}</div>
                </div>

                {/* <div className="textyou">
                  <div className="btnTextyou">
                    <input
                      placeholder="write a messange"
                      value={inputTexts[person.name] || ''}
                      onChange={(e) => handleInputChange(person.name, e.target.value)}
                    />
                    <button onClick={() => handleCommentSubmit(person)}>
                      submit
                    </button>
                  </div>

                </div> */}

                <div className="textyou">
                  <div className="btnTextyou">
                    <input
                      placeholder="write a message"
                      value={inputTexts[person.name] || ""}
                      onChange={(e) =>
                        handleInputChange(person.name, e.target.value)
                      }
                    />
                    <button onClick={() => handleCommentSubmit(person)}>
                      submit
                    </button>
                  </div>
                </div>

                <div className="actionbtn">
                  <button className="enduBTN" style={{ fontSize: 45 }} onClick={() => handleEnduBTNClick(person)}>
                    <i className="fa-solid fa-hand-holding-heart"></i>
                  </button>
                </div>


              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
