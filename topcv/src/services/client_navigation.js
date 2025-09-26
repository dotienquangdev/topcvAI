// Simple client-side SSE navigation controller
// Cách dùng: import file này sớm (vd: trong index.html hoặc entry React) để lắng nghe thay đổi.
// Nó chỉ redirect khi server phát route MỚI khác với window.location.pathname và khác '/'.

const NAV_SERVER = process.env.REACT_APP_NAV_SERVER || 'http://localhost:5001';
const SSE_URL = `${NAV_SERVER}/navigate`;

let sse;
let lastApplied = null;
let manualOverride = false; // Nếu user đang tự điều hướng (SPA) thì vẫn được phép; server chỉ ép khi có route mới

function connect() {
	if (sse) {
		try { sse.close(); } catch (_) {}
	}
	sse = new EventSource(SSE_URL, { withCredentials: false });
	console.log('[SSE] Connecting to', SSE_URL);

	sse.onmessage = (evt) => {
		const path = (evt.data || '').trim();
		if (!path) return;
		if (path === '/session_ended') {
			console.log('[SSE] Session ended by server');
			sse.close();
			return;
		}
		if (path === '/' || path === window.location.pathname) {
			// Không làm gì nếu là root hoặc giống trang hiện tại
			return;
		}
		if (path === lastApplied) {
			// Đã áp dụng rồi => tránh vòng lặp nếu SPA re-mount khiến SSE reconnect
			return;
		}
		// Thực hiện redirect 1 lần
		console.log('[SSE] Navigate to', path);
		lastApplied = path;
		manualOverride = true; // Sau khi áp dụng cho phép user tự đi tiếp
		window.history.pushState({}, '', path);
		// Trigger event SPA framework nếu cần (ví dụ React Router v6 sử dụng listener popstate nếu navigate bằng pushState)
		window.dispatchEvent(new PopStateEvent('popstate'));
	};

	sse.onerror = (err) => {
		console.warn('[SSE] Error, will retry in 3s', err);
		try { sse.close(); } catch (_) {}
		setTimeout(connect, 3000);
	};
}

// Optional: expose API để đặt tạm thời cờ manualOverride nếu user vừa click link nội bộ
export function markUserNavigation() {
	manualOverride = true;
}

connect();

// Giải thích logic:
// - Server GIỜ chỉ gửi khi có thay đổi thực sự => không khoá người dùng.
// - lastApplied tránh việc reconnect SSE làm redirect lặp lại cùng path.
// - Không redirect nếu nhận '/'.
