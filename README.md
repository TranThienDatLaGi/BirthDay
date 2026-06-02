# 🎂 Dự án Web Sinh Nhật Nhã Thy ✨

Trang web chúc mừng sinh nhật được xây dựng bằng **HTML, CSS và JavaScript thuần** siêu nhẹ, mượt mà và tương thích tốt trên di động.

---

## 📂 Cấu trúc thư mục dự án

```text
d:\Personality\Birthday/
├── index.html                 # Cấu trúc giao diện chính
├── css/
│   └── style.css              # Giao diện, hiệu ứng animations (Pastel Theme)
├── js/
│   └── script.js              # Logic tương tác, nhạc nền, pháo hoa, bong bóng
└── assets/                    # Thư mục chứa tài nguyên của bạn
    ├── images/
    │   ├── cake.png           # Ảnh bánh kem (dự phòng)
    │   ├── card-cover.png     # Ảnh bìa thiệp (dự phòng)
    │   ├── photo1.png         # Ảnh kỷ niệm 1 (đã có hình mẫu)
    │   ├── photo2.png         # Ảnh kỷ niệm 2 (đã có hình mẫu)
    │   └── photo3.png         # Ảnh kỷ niệm 3 (đã có hình mẫu)
    ├── audio/
    │   └── birthday-bgm.mp3   # Nhạc nền sinh nhật (bạn có thể chèn MP3 vào đây)
    └── videos/
        └── birthday-video.mp4 # Video kỷ niệm của bạn (chèn vào đây)
```

---

## 🛠️ Hướng dẫn Tùy biến trang web

### 1. Thay đổi Lời chúc sinh nhật
Để sửa nội dung lời chúc, bạn hãy mở file [script.js](file:///d:/Personality/Birthday/js/script.js) và tìm biến `birthdayMessage` ở khoảng dòng 28:
```javascript
const birthdayMessage = 
`Chào Nhã Thy! 🎉
... (Sửa nội dung lời chúc của bạn ở đây) ...`;
```

### 2. Thêm Hình ảnh kỷ niệm của bạn
* Hãy chuẩn bị **3 bức ảnh** của bạn và Nhã Thy.
* Đổi tên chúng lần lượt thành `photo1.png`, `photo2.png`, `photo3.png`.
* Copy đè các ảnh này vào thư mục [assets/images/](file:///d:/Personality/Birthday/assets/images/).
* *Lưu ý: Nếu ảnh có định dạng khác (như `.jpg` hay `.jpeg`), bạn hãy đổi phần mở rộng trong file `index.html` cho khớp.*

### 3. Cấu hình Nhạc nền (YouTube hoặc MP3)
Trang web được thiết kế với cơ chế phát nhạc **3 lớp cực kỳ thông minh** (được cấu hình ở đầu file `js/script.js`):
1. **Lớp 1: Nhạc từ YouTube (Mặc định):** Trang web đã được thiết kế để tự động kết nối và phát trực tiếp bản nhạc Acoustic mà bạn yêu cầu từ link YouTube (`videoId: 'S7KA4tQ483o'`) mà không cần tải file về. Bạn chỉ cần sửa ID này trong `script.js` nếu muốn đổi bài hát khác từ YouTube.
2. **Lớp 2: File nhạc MP3 cục bộ:** Nếu bạn muốn dùng file MP3 của riêng mình, hãy đổi `useYouTube: false` trong cấu hình ở `script.js`, sau đó copy file nhạc của bạn, đặt tên là `birthday-bgm.mp3` và lưu vào thư mục `assets/audio/`.
3. **Lớp 3: Nhạc tự phát Retro Synth:** Nếu cả hai lớp trên đều không khả dụng (ví dụ: mất mạng hoặc thiếu file MP3), trang web sẽ tự động sử dụng Web Audio API để tự sinh ra giai điệu Happy Birthday 8-bit cực kỳ dễ thương.

### 4. Thêm Video vui vẻ của bạn
* Chuẩn bị 1 file video (định dạng `.mp4`).
* Đổi tên file thành `birthday-video.mp4`.
* Copy file vào thư mục [assets/videos/](file:///d:/Personality/Birthday/assets/videos/).

---

## 🚀 Hướng dẫn chạy thử trên máy tính (Local preview)

Có nhiều cách để bạn chạy thử trang web ngay trên máy tính của mình:

### Cách 1: Mở trực tiếp
Bạn chỉ cần click đúp vào file [index.html](file:///d:/Personality/Birthday/index.html). Nó sẽ mở trên trình duyệt (Chrome, Edge, Safari...). 
* *Lưu ý: Một số trình duyệt chặn tải nhạc hoặc video cục bộ vì lý do bảo mật (CORS). Để đầy đủ tính năng nhất, nên dùng Cách 2.*

### Cách 2: Chạy qua Server mini (Được khuyến nghị)
Bạn có thể mở PowerShell hoặc Terminal tại thư mục dự án và chạy một trong hai lệnh sau:

*   **Sử dụng Node.js (Khuyên dùng vì máy bạn đã cài sẵn Node.js):**
    ```bash
    npx http-server
    ```
    Sau đó mở trình duyệt và truy cập: **`http://localhost:8080`**

*   **Sử dụng Python (Nếu đã cài đặt):**
    ```bash
    python -m http.server 8000
    ```
    Sau đó mở trình duyệt và truy cập: **`http://localhost:8000`**

---

## 🌐 Hướng dẫn Deploy lên GitHub Pages (Hoàn toàn miễn phí)

Khi đã hoàn thành và ưng ý, bạn hãy làm theo các bước sau để gửi link cho bạn bè:

1. **Tạo Repository mới trên GitHub:**
   * Truy cập [GitHub](https://github.com) và tạo một repo mới (ví dụ đặt tên là `happy-birthday-thy`).
   * Chọn chế độ **Public** (Bắt buộc phải công khai để dùng Pages miễn phí).

2. **Đẩy mã nguồn lên GitHub:**
   Mở terminal tại thư mục dự án và chạy các lệnh:
   ```bash
   git init
   git add .
   git commit -m "Initial birthday website for Nha Thy"
   git branch -M main
   git remote add origin <đường-link-git-repo-của-bạn>
   git push -u origin main
   ```

3. **Kích hoạt GitHub Pages:**
   * Vào repository của bạn trên trang web GitHub.
   * Chọn tab **Settings** (Cài đặt) ở phía trên.
   * Menu bên trái chọn **Pages**.
   * Ở mục **Build and deployment**, phần **Branch** bạn chọn **`main`** và thư mục **`/ (root)`**, sau đó nhấn **Save**.
   * Đợi khoảng 1 - 2 phút, GitHub sẽ hiển thị đường dẫn trang web của bạn ở đầu trang (ví dụ: `https://username.github.io/happy-birthday-thy/`).

4. **Gửi link và tạo bất ngờ cho Nhã Thy!** 🎉
