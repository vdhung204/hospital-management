## 1. Cài đặt Ollama

1. Tải xuống và cài đặt Ollama từ https://ollama.com
   
📌 Lưu ý: Trên PC, bạn có thể cần quyền admin để cài đặt thành công.

2. Mở giao diện dòng lệnh:
   
Trên Windows: Nhấn Win + R, gõ cmd, rồi nhấn Enter.

Trên Mac: Mở Terminal (Applications > Utilities > Terminal).

3. Chạy mô hình:
   
Run `ollama run mistral` , ở đây mình sử dụng model này vì nó ít tham tham số nhất, nhẹ cài đặt nhanh có thể sử dụng với hầu hết máy tính, nếu thiết bị của bạn đáp ứng được về phần cứng có thể sử dụng các mô hình khác để tăng tính hiệu quả và nâng cao trải nghiệm.

🚫 Tránh sử dụng mô hình mới nhất `llama3.3` của Meta vì nó có 70B tham số, quá lớn với hầu hết máy tính cá nhân!

Nếu không hoạt động, thử chạy máy chủ: Trên Windows (Powershell) hoặc Mac (Terminal): `ollama serve`  

Sau đó thử lại bước 3.

## 2. Setup Environment

### 1. Mở Command Prompt

Nhấn `Win + R`, nhập `cmd`, rồi nhấn `Enter`

### 2. Kiểm tra phiên bản Python

Chạy lệnh sau để kiểm tra phiên bản Python bạn đang sử dụng:
`python --version`

Lý tưởng nhất, bạn nên sử dụng **Python 3.11** để đảm bảo đồng bộ hoàn toàn. Nếu không, cũng không sao, nhưng có thể cần quay lại bước này nếu gặp vấn đề về tương thích.

👉 Bạn có thể tải Python tại đây:
https://www.python.org/downloads/

### 3. Di chuyển đến thư mục dự án

Nếu bạn dùng vscode có thể mở teminal của vscode lên và bỏ qua bước 3 này.

Dùng lệnh `cd` để di chuyển đến thư mục gốc của dự án
`cd C:\Users\YourUsername\Projects\llmprojects`

Sau đó, chạy: `dir` để kiểm tra xem bạn có thấy các thư mục con trong dự án hay không


### 4. Tạo môi trường ảo

Chạy lệnh sau để tạo một môi trường ảo mới: `py -m venv venv`

**Kích hoạt môi trường ảo**

`venv\Scripts\activate`

Nếu thành công, bạn sẽ thấy (venv) xuất hiện trong dòng lệnh, báo hiệu rằng môi trường ảo đã được kích hoạt. 

Bạn cần cài đặt lại các thư viện cần dùng cho môi trường này

### 5. Cài đặt các thư viện cần thiết

Sau khi đã tạo xong môi trường ảo và đã active(ở bước 4), chạy lệnh sau để cài đặt các thư viện cần thiết:
'pip install -r requirements.txt' 