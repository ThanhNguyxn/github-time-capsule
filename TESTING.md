# 🧪 Testing Guide - GitHub Time Capsule

Hướng dẫn chi tiết về quy trình testing cho dự án GitHub Time Capsule.

---

## 📋 Mục Lục

1. [Testing Workflow](#testing-workflow)
2. [Testing Web Interface](#testing-web-interface)
3. [Testing GitHub Actions](#testing-github-actions)
4. [Cleanup After Testing](#cleanup-after-testing)
5. [Best Practices](#best-practices)

---

## 🔄 Testing Workflow

### 1. Test Local Web Interface

```bash
# Di chuyển vào thư mục web
cd web

# Install dependencies (nếu chưa)
npm install

# Chạy development server
npm run dev

# Mở browser: http://localhost:3000
```

**Kiểm tra:**
- ✅ UI hiển thị đúng
- ✅ Countdown timer hoạt động
- ✅ Authentication flow
- ✅ Form validation
- ✅ Message submission

### 2. Test GitHub Actions Workflow

Có **2 cách** để test workflow:

#### Cách 1: Test với Pre-encrypted Message (giống Web Interface)

```bash
# 1. Tạo test branch
git checkout -b test-workflow-$(date +%s)

# 2. Tạo file test đã mã hóa
mkdir -p sealed/TestUser
cat > sealed/TestUser/TestUser.gpg << 'EOF'
-----BEGIN PGP MESSAGE-----

wcFMA8PH5rk1oAQgAQ/+NXm3+JNyOJxCuP1PSI5SRceNjXFY7CcVNqsbJ/CL
test message
=TEST
-----END PGP MESSAGE-----
EOF

# 3. Commit và push
git add sealed/TestUser/TestUser.gpg
git commit -m "Test: Pre-encrypted message workflow"
git push origin HEAD

# 4. Tạo Pull Request
gh pr create --title "Test: Workflow with Pre-encrypted Message" \
  --body "Testing pre-encrypted message workflow (auto-closed)"

# 5. Xem workflow chạy
gh pr view --web
# hoặc
gh run watch
```

#### Cách 2: Test với Plaintext Message (Manual submission)

```bash
# 1. Tạo test branch
git checkout -b test-plaintext-$(date +%s)

# 2. Tạo file plaintext
mkdir -p messages
echo "This is a test message for the time capsule!" > messages/TestUser.txt

# 3. Commit và push
git add messages/TestUser.txt
git commit -m "Test: Plaintext message workflow"
git push origin HEAD

# 4. Tạo Pull Request
gh pr create --title "Test: Workflow with Plaintext Message" \
  --body "Testing plaintext message encryption workflow (auto-closed)"

# 5. Xem workflow chạy
gh run watch
```

### 3. Xem Kết Quả

```bash
# Xem PR và comments từ bot
gh pr view [PR_NUMBER]

# Xem logs chi tiết
gh run view [RUN_ID] --log

# Xem danh sách workflows
gh run list --workflow "Encrypt Message" --limit 5
```

**Kiểm tra bot comments có:**
- ✅ Processing message với table
- ✅ Success message với badges
- ✅ Message details table
- ✅ Instructions để nhận message 2035
- ✅ PR tự động close

---

## 🌐 Testing Web Interface

### Test Locally

```bash
cd web

# 1. Copy environment variables
cp .env.example .env.local

# 2. Update with your values
nano .env.local

# 3. Run development server
npm run dev
```

### Test Production (Vercel)

```bash
# Push to main để trigger Vercel deployment
git push origin main

# Hoặc deploy manually
cd web
vercel deploy
```

**Test các tính năng:**

1. **Home Page** (`/`)
   - ✅ Countdown timer hiển thị đúng
   - ✅ Statistics load
   - ✅ UI responsive

2. **Submit Page** (`/submit`)
   - ✅ OAuth login
   - ✅ Form validation
   - ✅ Character count
   - ✅ Encryption preview
   - ✅ Submit successful

3. **Success Page** (`/success`)
   - ✅ Status cards
   - ✅ PR link
   - ✅ Instructions displayed

---

## 🧹 Cleanup After Testing

### ⚠️ QUAN TRỌNG: Luôn cleanup sau khi test!

#### 1. Xóa Test Branches (Local)

```bash
# Quay về main
git checkout main

# Xóa test branches local
git branch | grep -E 'test-|Test-' | xargs git branch -D

# Hoặc xóa từng branch cụ thể
git branch -D test-workflow-1234567890
```

#### 2. Xóa Test Branches (Remote)

```bash
# Liệt kê remote branches
gh pr list --state closed --limit 20

# Xóa branches đã đóng
gh pr list --state closed --json headRefName --jq '.[].headRefName' | \
  grep -E 'test-|Test-' | \
  xargs -I {} git push origin --delete {}
```

#### 3. Xóa Test Files

```bash
# Kiểm tra sealed folder
ls -la sealed/

# Xóa test user folders
rm -rf sealed/TestUser/
rm -rf sealed/UITest/

# Commit cleanup
git add sealed/
git commit -m "Cleanup: Remove test files"
git push origin main
```

#### 4. Cleanup Script Tự Động

Tạo file `cleanup-tests.sh`:

```bash
#!/bin/bash

echo "🧹 Cleaning up test files and branches..."

# 1. Xóa test files
echo "Removing test sealed files..."
rm -rf sealed/TestUser/ sealed/UITest/ sealed/*Test*/
rm -f messages/TestUser.txt messages/*Test*.txt

# 2. Checkout main
git checkout main 2>/dev/null || true

# 3. Xóa local test branches
echo "Removing local test branches..."
git branch | grep -E 'test-|Test-' | xargs -r git branch -D

# 4. Xóa remote test branches (optional)
read -p "Delete remote test branches? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing remote test branches..."
    gh pr list --state closed --json headRefName --jq '.[].headRefName' | \
      grep -E 'test-|Test-' | \
      xargs -I {} git push origin --delete {} 2>/dev/null || true
fi

echo "✅ Cleanup completed!"
```

Sử dụng:

```bash
chmod +x cleanup-tests.sh
./cleanup-tests.sh
```

---

## 💡 Best Practices

### ✅ DO's

1. **Đặt tên test branch rõ ràng**
   ```bash
   test-feature-name-$(date +%s)
   test-workflow-pre-encrypted-20251031
   ```

2. **Luôn thêm prefix "Test:" vào PR title**
   ```bash
   gh pr create --title "Test: Description here"
   ```

3. **Cleanup ngay sau khi test xong**
   ```bash
   # Ngay sau khi verify workflow
   git checkout main
   git branch -D test-branch-name
   ```

4. **Dùng TestUser hoặc UITest cho test data**
   ```bash
   sealed/TestUser/TestUser.gpg
   messages/TestUser.txt
   ```

5. **Document test results**
   ```bash
   # Lưu logs nếu có issue
   gh run view [RUN_ID] --log > test-results.log
   ```

### ❌ DON'Ts

1. **KHÔNG để test files trong repo sau khi test**
   - ❌ `sealed/TestUser/`
   - ❌ `sealed/UITest/`
   - ❌ Test branches sau 1 ngày

2. **KHÔNG test với real user data**
   - ❌ `sealed/RealUsername/`
   - ✅ `sealed/TestUser/`

3. **KHÔNG push test commits vào main**
   - ❌ Commit test files trực tiếp vào main
   - ✅ Luôn tạo PR để test workflow

4. **KHÔNG skip cleanup**
   - Cleanup là bắt buộc, không optional!

---

## 🔍 Debugging

### Xem Workflow Logs

```bash
# Xem runs gần nhất
gh run list --workflow "Encrypt Message" --limit 5

# Xem logs chi tiết
gh run view [RUN_ID] --log

# Xem logs với grep
gh run view [RUN_ID] --log | grep -A 5 "Error"
```

### Kiểm tra Environment Variables

```bash
# Kiểm tra GitHub Secrets
gh secret list

# Kiểm tra Web environment
cd web
cat .env.local | grep -v "SECRET"
```

### Common Issues

#### Issue 1: Workflow không trigger
**Solution:**
```bash
# Kiểm tra workflow file
cat .github/workflows/encrypt-msg.yml

# Verify trigger events
grep -A 2 "on:" .github/workflows/encrypt-msg.yml
```

#### Issue 2: Bot comments không hiện
**Solution:**
```bash
# Check workflow permissions
grep -A 5 "permissions:" .github/workflows/encrypt-msg.yml

# Should have:
# permissions:
#   contents: write
#   pull-requests: write
```

#### Issue 3: Encryption fails
**Solution:**
```bash
# Check GPG public key secret
gh secret list | grep GPG_PUBLIC_KEY

# Verify key format in workflow
```

---

## 📊 Test Checklist

Trước khi deploy production, kiểm tra:

### Workflow Tests
- [ ] Test pre-encrypted message workflow
- [ ] Test plaintext message workflow
- [ ] Verify bot comments đẹp
- [ ] Check PR auto-close
- [ ] Verify file sealed vào main

### Web Interface Tests
- [ ] Test OAuth login
- [ ] Test message submission
- [ ] Verify client-side encryption
- [ ] Check success page
- [ ] Test responsive UI

### Cleanup Tests
- [ ] Remove all test files
- [ ] Delete test branches
- [ ] Clean sealed folder
- [ ] Verify repo clean

---

## 🚀 Quick Test Command

Test nhanh toàn bộ workflow:

```bash
#!/bin/bash
# quick-test.sh

TIMESTAMP=$(date +%s)
BRANCH="test-workflow-$TIMESTAMP"

echo "🧪 Running quick test..."

# 1. Create test
git checkout -b $BRANCH
mkdir -p sealed/TestUser
echo "-----BEGIN PGP MESSAGE-----
test
-----END PGP MESSAGE-----" > sealed/TestUser/TestUser.gpg

# 2. Push and create PR
git add sealed/
git commit -m "Test: Quick workflow test"
git push origin HEAD
gh pr create --title "Test: Quick Workflow Test" --body "Auto-test $(date)"

# 3. Wait for workflow
echo "⏳ Waiting for workflow..."
sleep 20

# 4. Check status
gh pr view --json state,closed

# 5. Cleanup
echo "🧹 Cleaning up..."
git checkout main
git branch -D $BRANCH

echo "✅ Test completed!"
```

Sử dụng:
```bash
chmod +x quick-test.sh
./quick-test.sh
```

---

## 📞 Need Help?

- **Issues**: [GitHub Issues](https://github.com/ThanhNguyxn/github-time-capsule/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ThanhNguyxn/github-time-capsule/discussions)
- **Docs**: [FOR-DEVELOPERS.md](FOR-DEVELOPERS.md)

---

<div align="center">

**Made with ❤️ for testing excellence**

</div>

