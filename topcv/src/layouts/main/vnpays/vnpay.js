import { useState, useEffect } from "react";
import { createPayment } from "../../../services/vnpay";
import { getUser } from "../../../services/user";
import NotificationBox from "../../../Notification/admin/Notification";
function Vnpay() {
  const [money, setMoney] = useState(0);
  const [notif, setNotif] = useState({ show: false, type: "", content: "" });
  const [users, setUsers] = useState([]);
  // Lấy user hiện tại từ localStorage
  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;
  console.log("🟢 Current User ID:", currentUserId);
  // Hiển thị thông báo
  const showNotification = (content, type = "success") => {
    setNotif({ show: true, type, content });
    setTimeout(() => setNotif({ show: false, type: "", content: "" }), 3000);
  };
  // Lấy danh sách users từ server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUser(); // trả về mảng users
        setUsers(data.docs || []);
      } catch (error) {
        console.error("❌ Lỗi tải danh sách users:", error);
      }
    };
    fetchUsers();
  }, []);
  // Lấy số dư của user hiện tại
  useEffect(() => {
    if (!currentUserId || users.length === 0) return;

    const currentUser = users.find((u) => u._id === currentUserId);
    if (currentUser) setMoney(currentUser.money || 0);
  }, [users, currentUserId]);
  // Hàm nạp tiền
  const handlePayment = async (amount) => {
    if (!currentUserId) return;
    try {
      const res = await createPayment(currentUserId, amount);
      const data = await res.json();
      if (data.url) {
        showNotification("Đang chuyển tới VNPAY...", "success");
        window.location.href = data.url;
      } else {
        showNotification("Không tạo được link VNPAY", "error");
      }
    } catch (err) {
      console.error("❌ Lỗi createPayment:", err);
      showNotification("Lỗi khi tạo payment", "error");
    }
  };
  return (
    <>
      {notif.show && (
        <NotificationBox
          type={notif.type}
          onClose={() => setNotif({ show: false, type: "", content: "" })}
        >
          {notif.content}
        </NotificationBox>
      )}
      <div>
        <h2>Nạp tiền vào tài khoản</h2>
        <p>Số dư hiện tại: {money} VND</p>
        <button onClick={() => handlePayment(10)}>Nạp 10,000đ = 10 xu</button>
        <button onClick={() => handlePayment(20)}>Nạp 20,000đ = 25 xu</button>
        <button onClick={() => handlePayment(50)}>Nạp 50,000đ = 100 xu</button>
      </div>
    </>
  );
}
export default Vnpay;
