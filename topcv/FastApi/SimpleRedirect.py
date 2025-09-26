from flask import Flask, Response, request
import time
import threading
import msvcrt

app = Flask(__name__)

# Biến toàn cục lưu route cần chuyển hướng
current_path = "/"
# Nếu = True: route hiện tại chỉ ép chuyển hướng 1 lần rồi tự reset về '/'
single_use = False
# Event để thông báo khi có thay đổi route
route_changed = threading.Event()
# Flag để dừng server
server_running = threading.Event()
server_running.set()

@app.route("/navigate")
def navigate():
    """
    SSE endpoint.
    Thay đổi quan trọng:
    - KHÔNG gửi route ngay khi client vừa kết nối (tránh ép reload lại chính trang hiện tại mỗi lần refresh / chuyển trang SPA làm mới kết nối SSE).
    - Chỉ gửi khi thật sự có thay đổi (route_changed.set()).
    - Hỗ trợ chế độ single_use: sau khi broadcast 1 lần sẽ reset current_path = '/'.
    """
    def event_stream():
        global current_path, single_use
        # Bỏ gửi ban đầu -> cho phép user tự điều hướng tự do nếu không có thay đổi mới từ server
        last_sent = current_path  # Ghi nhận trạng thái hiện tại để không push ngay
        max_iterations = 1800  # 30 phút
        iteration_count = 0

        while server_running.is_set() and iteration_count < max_iterations:
            # Chờ tới khi có thay đổi hoặc timeout để tiếp tục loop
            route_changed.wait(timeout=1)

            if current_path != last_sent:
                yield f"data: {current_path}\n\n"
                last_sent = current_path
                route_changed.clear()
                # Nếu là single_use thì reset để không giữ user ở 1 trang mãi
                if single_use:
                    current_path = "/"
                    single_use = False
            iteration_count += 1

        yield f"data: /session_ended\n\n"

    response = Response(event_stream(), mimetype="text/event-stream")
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Cache-Control'] = 'no-cache'
    return response

@app.route("/set_route", methods=["POST"])
def set_route():
        """Đặt route mới.
        Body JSON:
            { 
                "path": "/userLogin",     # bắt buộc
                "single_use": true|false    # tùy chọn: true => chỉ ép chuyển 1 lần rồi thả
            }
        """
        global current_path, single_use
        data = request.get_json(silent=True) or {}
        path = data.get("path", "/")
        single_use = bool(data.get("single_use", False))
        current_path = path
        route_changed.set()  # Kích hoạt event để thông báo thay đổi
        return {"status": "ok", "path": current_path, "single_use": single_use}

def keyboard_listener():
    """Lắng nghe phím tắt"""
    global current_path
    print("🎹 Phím tắt: 1=Đăng nhập, 2=Đăng ký, q=Thoát")
    
    try:
        while server_running.is_set():
            if msvcrt.kbhit():
                key = msvcrt.getch().decode('utf-8')
                if key == '1':
                    current_path = "/userLogin"
                    # Phím tắt coi như single_use để không khoá người dùng ở trang đó
                    single_use = True
                    route_changed.set()
                    print("🔐 Chuyển đến đăng nhập (single_use)")
                elif key == '2':
                    current_path = "/userRegister"
                    single_use = True
                    route_changed.set()
                    print("📝 Chuyển đến đăng ký (single_use)")
                elif key == 'q':
                    print("🛑 Đang thoát...")
                    server_running.clear()  # Dừng server
                    break
            time.sleep(0.1)  # Ngủ ngắn để tránh CPU cao
    except KeyboardInterrupt:
        print("🛑 Keyboard listener stopped")
        server_running.clear()

if __name__ == "__main__":
    try:
        # Start keyboard listener in background
        keyboard_thread = threading.Thread(target=keyboard_listener, daemon=True)
        keyboard_thread.start()
        print("🚀 Server: http://localhost:5001")
        print("⏰ Session timeout: 30 phút")
        app.run(port=5001, debug=True, use_reloader=False)
    except KeyboardInterrupt:
        print("🛑 Server đang thoát...")
        server_running.clear()
    finally:
        server_running.clear()
        print("✅ Server đã dừng hoàn toàn")
