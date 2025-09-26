"""Minimal Flask API for quick chatbot echo testing.

Run: python TestFlaskAPI.py
Endpoint: POST /chat  JSON {"message": "..."}
Returns: {"text": "short reply"}
"""

from __future__ import annotations

import os
from datetime import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)

# Simple keyword -> reply map (short & direct for ASK mode)
RESPONSES = {
    "xin chào": "Chào bạn, cần hỗ trợ gì?",
    "hello": "Hi, how can I help?",
    "giúp tôi": "Bạn cần giúp về việc làm hay CV?",
    "tạm biệt": "Tạm biệt 👋",
    "bye": "Goodbye 👋",
}

def short_reply(message: str) -> str:
    lowerMessage = message.lower()
    
    # ASK mode - simple, direct answers
    if any(word in lowerMessage for word in ["cv", "resume"]):
        return "Bạn muốn tạo mới hay cải thiện CV?"
    
    if any(word in lowerMessage for word in ["việc làm", "job", "tìm việc"]):
        return "Bạn tìm việc lĩnh vực nào?"
    
    if any(word in lowerMessage for word in ["phỏng vấn", "interview"]):
        return "Bạn cần chuẩn bị phỏng vấn cho vị trí gì?"
    
    if any(word in lowerMessage for word in ["lương", "salary", "thu nhập"]):
        return "Mức lương bạn mong muốn là bao nhiêu?"
    
    # Tìm exact match từ RESPONSES
    if lowerMessage in RESPONSES:
        return RESPONSES[lowerMessage]
    
    # Tìm partial match từ RESPONSES
    for key, value in RESPONSES.items():
        if key in lowerMessage:
            return value
    
    # Default response for ASK mode
    return "Tôi có thể giúp bạn về CV, tìm việc, phỏng vấn. Bạn cần hỗ trợ gì?"

def agent_reply(message: str) -> str:
    lowerMessage = message.lower()
    
    # Agent mode - detailed, action-oriented responses
    if any(word in lowerMessage for word in ["tạo cv", "create cv", "làm cv", "cv mới"]):
        return """🤖 AGENT MODE: Tạo CV chuyên nghiệp

Tôi sẽ hướng dẫn bạn tạo CV từng bước:

1️⃣ **Thông tin cá nhân**: Họ tên, email, số điện thoại, LinkedIn
2️⃣ **Mục tiêu nghề nghiệp**: Viết 2-3 câu về định hướng
3️⃣ **Kinh nghiệm**: Liệt kê theo thứ tự thời gian (mới nhất trước)
4️⃣ **Kỹ năng**: Chia thành kỹ năng cứng và mềm
5️⃣ **Học vấn**: Bằng cấp, chứng chỉ liên quan

Bạn đang làm ngành gì để tôi tư vấn template phù hợp?"""
    
    if any(word in lowerMessage for word in ["tìm việc", "job search", "find job", "việc làm"]):
        return """🤖 AGENT MODE: Chiến lược tìm việc hiệu quả

Tôi sẽ thiết lập kế hoạch tìm việc cho bạn:

📋 **Bước 1**: Xác định mục tiêu
- Vị trí cụ thể
- Ngành nghề ưu tiên  
- Địa điểm làm việc
- Mức lương mong muốn

🔍 **Bước 2**: Tìm kiếm đa kênh
- JobStreet, TopCV, LinkedIn
- Website công ty trực tiếp
- Mạng lưới cá nhân
- Headhunter chuyên ngành

📨 **Bước 3**: Ứng tuyển chiến lược
- Customize CV cho từng vị trí
- Cover letter cá nhân hóa
- Follow-up sau 1 tuần

Bạn đang tìm vị trí gì cụ thể?"""
    
    if any(word in lowerMessage for word in ["phỏng vấn", "interview", "chuẩn bị"]):
        return """🤖 AGENT MODE: Chuẩn bị phỏng vấn toàn diện

Kế hoạch chuẩn bị 7 ngày:

📚 **Ngày 1-2**: Research công ty
- Tìm hiểu sản phẩm/dịch vụ
- Văn hóa và giá trị công ty
- Tin tức, thành tựu gần đây
- Lãnh đạo và team structure

💡 **Ngày 3-4**: Chuẩn bị câu trả lời
- "Giới thiệu bản thân" (2 phút)
- "Tại sao chọn công ty này?"
- "Điểm mạnh/yếu của bạn?"
- "Mức lương mong muốn?"

🎭 **Ngày 5-6**: Mock interview
- Luyện tập với bạn bè/gia đình
- Ghi âm để tự đánh giá
- Chuẩn bị câu hỏi ngược lại

👔 **Ngày 7**: Hoàn thiện
- Chọn trang phục phù hợp
- Chuẩn bị hồ sơ in
- Lập kế hoạch di chuyển

Vị trí bạn phỏng vấn là gì?"""
    
    if any(word in lowerMessage for word in ["công ty", "company", "doanh nghiệp"]):
        return """🤖 AGENT MODE: Nghiên cứu và đánh giá công ty

Checklist đánh giá công ty toàn diện:

🏢 **Thông tin cơ bản**:
- Quy mô (nhân sự, doanh thu)
- Lĩnh vực kinh doanh chính
- Thị trường hoạt động
- Cơ cấu sở hữu

📈 **Tình hình tài chính**:
- Báo cáo tài chính 3 năm gần nhất  
- Tốc độ tăng trưởng
- Vị thế thị trường
- Kế hoạch mở rộng

👥 **Môi trường làm việc**:
- Review trên Glassdoor, CareerBuilder
- Chính sách nhân sự
- Cơ hội thăng tiến
- Work-life balance

🎯 **Cơ hội phát triển**:
- Chương trình đào tạo
- Budget cho học tập
- Mentor/coaching program
- Career path rõ ràng

Bạn muốn tìm hiểu công ty nào cụ thể?"""
    
    if any(word in lowerMessage for word in ["lương", "salary", "thương lượng", "negotiate"]):
        return """🤖 AGENT MODE: Chiến lược thương lượng lương

📊 **Bước 1**: Research mức lương thị trường
- Salary survey của ngành
- So sánh trên JobStreet, Glassdoor
- Tham khảo mạng lưới cá nhân
- Xem xét kinh nghiệm và kỹ năng

💡 **Bước 2**: Xây dựng value proposition
- Liệt kê thành tích cụ thể
- Kỹ năng độc đáo bạn mang lại
- Kinh nghiệm liên quan
- Chứng chỉ/bằng cấp

🎯 **Bước 3**: Chiến thuật thương lượng
- Đưa ra range thay vì số cụ thể
- Bắt đầu cao hơn mong muốn 10-15%
- Đề cập total compensation (thưởng, benefit)
- Sẵn sàng flexibility về start date

📋 **Bước 4**: Backup plan
- Negotiate benefit khác nếu lương cố định
- Xem xét WFH, flexible time
- Cơ hội training, conference
- Review lương sớm (6 tháng)

Vị trí và mức lương bạn đang target?"""
    
    # Chào hỏi trong agent mode
    if any(word in lowerMessage for word in ["xin chào", "hello", "hi", "chào"]):
        return """🤖 Chào bạn! Tôi là TopCV AI Agent

Tôi có thể hỗ trợ bạn thực hiện các tác vụ chi tiết:
✅ Tạo CV chuyên nghiệp từng bước
✅ Xây dựng chiến lược tìm việc  
✅ Chuẩn bị phỏng vấn toàn diện
✅ Nghiên cứu và đánh giá công ty
✅ Thương lượng lương hiệu quả

Bạn muốn tôi hỗ trợ tác vụ nào cụ thể?"""
    
    # Default agent response
    return """🤖 AGENT MODE: Tôi có thể thực hiện các tác vụ chuyên sâu

📝 **CV & Profile**: Tạo CV, tối ưu LinkedIn, personal branding
🔍 **Job Search**: Chiến lược tìm việc, target công ty, networking  
🎯 **Interview**: Chuẩn bị câu hỏi, mock interview, follow-up
🏢 **Company Research**: Phân tích công ty, văn hóa, cơ hội phát triển
💰 **Salary**: Nghiên cứu thị trường, thương lượng, package tổng thể

Hãy cho tôi biết bạn cần hỗ trợ cụ thể về vấn đề gì?

*Message của bạn: "{}"*""".format(message)

@app.after_request
def after_request(response):
    # Add CORS headers manually
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        # Handle preflight request
        return jsonify({}), 200
    
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")
    reply = short_reply(message)
    
    print(f"Received (ASK): {message}")
    print(f"Reply: {reply}")
    
    return jsonify({
        "text": reply,
        "received": message,
        "mode": "ask",
        "ts": datetime.utcnow().isoformat() + "Z"
    })

@app.route("/agent", methods=["POST", "OPTIONS"])
def agent():
    if request.method == "OPTIONS":
        # Handle preflight request
        return jsonify({}), 200
    
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")
    # Agent mode - more complex responses
    reply = agent_reply(message)
    
    print(f"Received (AGENT): {message}")
    print(f"Reply: {reply}")
    
    return jsonify({
        "text": reply,
        "received": message,
        "mode": "agent", 
        "ts": datetime.utcnow().isoformat() + "Z"
    })

@app.route("/ping", methods=["GET"])
def ping():  # health check
    return {"status": "ok", "message": "Chatbot API is running"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3001))
    print(f"Starting Flask chatbot API on port {port}")
    print(f"CORS enabled for http://localhost:3000")
    # host=0.0.0.0 so client (e.g. frontend in docker) can reach it
    app.run(host="0.0.0.0", port=port, debug=True)
