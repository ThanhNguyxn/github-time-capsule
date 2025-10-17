# 🚀 HƯỚNG DẪN SETUP ĐỂ AUTOMATION CHẠY 100%

## ⚠️ QUAN TRỌNG: Automation sẽ KHÔNG CHẠY nếu thiếu các bước này!

---

## 📋 CHECKLIST

- [ ] Cài đặt GPG
- [ ] Generate GPG keys
- [ ] Add 3 GitHub Secrets
- [ ] Test với dummy PR
- [ ] ✅ Automation chạy 100%!

---

## BƯỚC 1: CÀI ĐẶT GPG (5 phút)

### Windows (Bạn đang dùng):

1. **Download Gpg4win**:
   - Vào: https://www.gpg4win.org/download.html
   - Click **"Download Gpg4win"**
   - Chạy file installer

2. **Cài đặt**:
   - Next → Next → Install
   - Không cần cài Kleopatra (GUI) nếu không muốn
   - Finish

3. **Kiểm tra**:
```powershell
gpg --version
# Nếu thấy version số là OK!
```

---

## BƯỚC 2: GENERATE GPG KEYS (5 phút)

Sau khi cài GPG xong, chạy các lệnh sau:

### 1. Generate key pair:

```powershell
gpg --full-generate-key
```

**Chọn theo hướng dẫn:**
- **Key type**: `1` (RSA and RSA) - Enter
- **Key size**: `4096` - Enter
- **Expiration**: `0` (không expire) - Enter
- **Confirm**: `y` - Enter
- **Real name**: `Time Capsule 2035` - Enter
- **Email**: `time-capsule-2035@users.noreply.github.com` - Enter
- **Comment**: `GitHub Time Capsule` - Enter
- **Okay**: `O` - Enter
- **Passphrase**: Tạo 1 passphrase mạnh (VÍ DỤ: `TimeCapsule@2035#Secret`)
  - ⚠️ **GHI NHỚ PASSPHRASE NÀY!** Bạn sẽ cần nó!

### 2. Export PUBLIC key:

```powershell
gpg --armor --export time-capsule-2035 > public-key.asc
```

### 3. Export PRIVATE key:

```powershell
gpg --armor --export-secret-keys time-capsule-2035 > private-key.asc
```

**Lưu ý**: Khi export private key, nhập passphrase bạn vừa tạo!

---

## BƯỚC 3: ADD GITHUB SECRETS (3 phút)

### 1. Vào GitHub Repository Settings:

```
https://github.com/ThanhNguyxn/github-time-capsule-ho-c-dev-time-capsule/settings/secrets/actions
```

Hoặc:
- Vào repository của bạn
- Click **Settings** (tab)
- Click **Secrets and variables** (menu bên trái)
- Click **Actions**

### 2. Add Secret #1: GPG_PUBLIC_KEY

- Click **"New repository secret"**
- Name: `GPG_PUBLIC_KEY`
- Value: 
  ```powershell
  # Mở file public-key.asc và copy TOÀN BỘ nội dung
  notepad public-key.asc
  # Copy tất cả (bao gồm -----BEGIN PGP PUBLIC KEY BLOCK-----)
  ```
- Click **"Add secret"**

### 3. Add Secret #2: GPG_PRIVATE_KEY

- Click **"New repository secret"** lần nữa
- Name: `GPG_PRIVATE_KEY`
- Value:
  ```powershell
  # Mở file private-key.asc và copy TOÀN BỘ nội dung
  notepad private-key.asc
  # Copy tất cả (bao gồm -----BEGIN PGP PRIVATE KEY BLOCK-----)
  ```
- Click **"Add secret"**

### 4. Add Secret #3: GPG_PASSPHRASE

- Click **"New repository secret"** lần nữa
- Name: `GPG_PASSPHRASE`
- Value: Nhập passphrase bạn đã tạo ở bước 2.1
  - Ví dụ: `TimeCapsule@2035#Secret`
- Click **"Add secret"**

### 5. Xác nhận:

Bạn sẽ thấy 3 secrets:
- ✅ GPG_PUBLIC_KEY
- ✅ GPG_PRIVATE_KEY
- ✅ GPG_PASSPHRASE

---

## BƯỚC 4: TEST AUTOMATION (5 phút)

Bây giờ test xem automation có chạy không!

### 1. Tạo test message:

Tạo file `messages/ThanhNguyxn.txt` với nội dung:

```
Ngày: 17 Tháng 10, 2025
Từ: @ThanhNguyxn
Đến: Tôi của năm 2035

Chào tôi của tương lai!

Đây là test message để kiểm tra automation.
Nếu bạn đọc được tin nhắn này vào năm 2035,
nghĩa là automation đã hoạt động hoàn hảo!

Dự đoán của tôi:
- AI sẽ thông minh hơn rất nhiều
- Vietnam sẽ có nhiều startup unicorn
- Tôi sẽ trở thành senior developer

Mục tiêu:
- Build sản phẩm có ích
- Học nhiều công nghệ mới
- Vẫn giữ được đam mê với code

Hẹn gặp lại năm 2035! 🚀

-- @ThanhNguyxn
```

### 2. Commit và push:

```powershell
git add messages/ThanhNguyxn.txt
git commit -m "🧪 Test message for automation"
git push origin main
```

### 3. Tạo Pull Request:

**QUAN TRỌNG**: Để test automation, bạn cần tạo PR từ 1 branch khác:

```powershell
# Tạo branch mới
git checkout -b test-message

# Add test message
# (file đã tạo ở trên)

git add messages/ThanhNguyxn.txt
git commit -m "Add test message"
git push origin test-message
```

Sau đó:
1. Vào: https://github.com/ThanhNguyxn/github-time-capsule-ho-c-dev-time-capsule
2. Click **"Compare & pull request"**
3. Click **"Create pull request"**

### 4. Xem automation chạy:

- Click tab **"Actions"** trong repository
- Bạn sẽ thấy workflow **"Seal the Capsule"** đang chạy
- Sau 30-60 giây, nó sẽ:
  - ✅ Encrypt message
  - ✅ Commit file `.gpg` vào `sealed/`
  - ✅ Comment trong PR
  - ✅ Close PR tự động

**Nếu thấy những bước trên → AUTOMATION HOẠT ĐỘNG 100%!** 🎉

---

## BƯỚC 5: XÁC NHẬN 100% AUTOMATION

### Sealing Automation (Đã test ở bước 4):
- ✅ PR opened → Auto encrypt → Auto commit → Auto close

### Unveiling Automation (Sẽ chạy 1/1/2035):
- ✅ Scheduled workflow: `0 0 1 1 2035`
- ✅ Có 3 secrets cần thiết
- ✅ Sẽ tự động decrypt vào đúng ngày

### Kiểm tra workflow files:

```powershell
# Xem sealing workflow
cat .github/workflows/seal-the-capsule.yml

# Xem unveiling workflow
cat .github/workflows/auto-unveiling.yml
```

Cả 2 workflows đều đã được push lên GitHub!

---

## ✅ HOÀN TẤT!

Sau khi làm xong các bước trên:

- ✅ **Code đã push lên GitHub**
- ✅ **Secrets đã setup (3 secrets)**
- ✅ **Test automation thành công**
- ✅ **Sealing: Tự động 100%**
- ✅ **Unveiling: Tự động 100% (1/1/2035)**

---

## 🎉 KẾT QUẢ

**TỪ GIỜ ĐẾN 2035:**
- Mọi PR được submit → Tự động encrypt & seal
- KHÔNG CẦN bạn làm gì!

**NGÀY 1/1/2035 LÚC 00:00 UTC:**
- Workflow tự động chạy
- Decrypt tất cả messages
- Publish keys & passphrase
- Create GitHub Release
- Create announcement issue
- KHÔNG CẦN bạn làm gì!

---

## 📞 LƯU Ý

### Sau khi export keys xong:

```powershell
# XÓA file keys ở local để bảo mật
rm public-key.asc
rm private-key.asc

# Keys đã lưu trong GitHub Secrets rồi!
```

### Backup (Optional):

Nếu muốn giữ backup private key:
- Copy private-key.asc vào USB
- Lưu ở nơi an toàn
- Đề phòng nếu GitHub Secrets bị mất

---

## 🚨 NẾU CÓ LỖI

### Workflow không chạy?
- Kiểm tra: Settings → Actions → General
- Đảm bảo "Allow all actions" được enable

### Encryption failed?
- Kiểm tra 3 secrets đã add đúng chưa
- Public key phải có format đúng (bao gồm BEGIN/END blocks)

### PR không tự động close?
- Kiểm tra GitHub Actions có permission `pull-requests: write`
- Xem logs trong Actions tab

---

## 📚 TÀI LIỆU THAM KHẢO

- `AUTOMATION.md` - Chi tiết về automation
- `VISUAL-FLOW.md` - Visual flow diagrams
- `SETUP.md` - Setup guide đầy đủ
- `100-PERCENT-AUTOMATIC.md` - Tóm tắt tiếng Việt

---

**CHÚC BẠN THÀNH CÔNG!** 🎉

**Hẹn gặp lại năm 2035!** 🕰️✨
