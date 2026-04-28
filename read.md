ฟีเจอร์หลัก
1) Authentication
Login / Register UI น่ารักๆ (Glassmorphism / Minimal)
Login ด้วย
Email/Password
Google Login (ใช้ Gmail + Google Drive)
Outlook Login (เสริมได้)

หน้า Login:

Illustration น่ารัก
ปุ่ม Social Login
Forgot password
OTP/Email Verification
2) ระบบหลายบัญชี (Multi Accounts)

สร้างบัญชีได้หลายแบบ เช่น

บัญชีส่วนตัว
เงินสด
ธนาคาร
บัตรเครดิต
E-Wallet

ตัวอย่าง

บัญชีเงินเดือน
บัญชีลงทุน
บัญชีค่าใช้จ่ายประจำ
3) Shared Account / ชวนเพื่อนหาร

เพิ่มเพื่อนเข้าบัญชีร่วม เช่น

ค่าเช่าห้อง
ค่าเที่ยว
ทริป
ค่าใช้จ่ายในบ้าน

ฟีเจอร์

Add Friend
Split Bill
ใครจ่ายก่อน ใครติดหนี้
สรุปยอดค้างกัน

คล้ายผสมระหว่าง

Splitwise
YNAB
Mint
4) เพิ่มรายรับ / รายจ่าย

กรอกเอง

จำนวนเงิน
หมวดหมู่
วันที่
โน้ต
แนบสลิป

หมวดหมู่:

อาหาร
เดินทาง
ผ่อนบ้าน
ค่าน้ำไฟ
ช้อปปิ้ง
ลงทุน
บันเทิง
5) อัปโหลดสลิปไป Google Drive

Google Drive API

Workflow:

Login Google
อัปโหลดรูปสลิป
เก็บลง Drive Folder อัตโนมัติ
OCR อ่านข้อมูลจากสลิป
บันทึกรายการให้อัตโนมัติ

ใช้:

Google Drive API
Google Vision OCR
Gmail API (ถ้าดึง e-slip จากเมล)
6) อ่านสลิปอัตโนมัติ (AI OCR)

ตัวอย่างอ่านจากสลิปได้:

สลิป:

โอน 450 บาท
ร้าน Café
วันที่ 20/04/2026

ระบบแปลงเป็น
Expense:

Amount: 450
Category: Food
Merchant: Café

Auto classify หมวดหมู่ด้วย AI

7) Dashboard สรุปรายเดือน
สรุปรายรับ/รายจ่าย
เงินเข้า
เงินออก
เงินคงเหลือ
กราฟ
Pie Chart แยกหมวดใช้เงิน
Trend รายเดือน
Cash Flow

ตัวอย่าง:

อาหาร 30%
เดินทาง 20%
ผ่อนบ้าน 35%
อื่นๆ 15%
8) AI วิเคราะห์การใช้เงิน

เช่น

เดือนนี้กินกาแฟ 3,200 บาท
ใช้ Grab มากขึ้น 18%
ค่าใช้จ่ายเกินงบอาหาร

ระบบแนะนำ:

ลดรายจ่ายได้ 2,500/เดือน
9) Budget Planner

ตั้งงบ:

อาหาร 5,000
เดินทาง 2,000

เกินงบแจ้งเตือน

10) Notifications
บิลใกล้ครบกำหนด
เตือนบันทึกรายจ่าย
แจ้งคนแชร์ค่าใช้จ่าย
โครงสร้างหน้าจอ
หน้า Home
Balance Card
เพิ่มรายการ +
กราฟรายเดือน
รายการล่าสุด
หน้า Accounts
หลายบัญชี
Shared wallet
หน้า Slip Scanner
ถ่ายรูปสลิป
OCR อ่านยอด
Reports
รายเดือน
Export PDF/Excel
Database (คร่าวๆ)

Tables

users
accounts
account_members
transactions
categories
receipts
budgets
settlements
Tech Stack (ถ้าทำด้วย Laravel)

Frontend

Laravel + React/Inertia
Tailwind
DaisyUI / Shadcn

Backend

Laravel
MySQL

Integrations

Google OAuth
Google Drive API
OCR API
Mail login

Storage

Google Drive
Laravel Storage
MVP เวอร์ชันแรก

เริ่มก่อน:
✅ Login/Register
✅ หลายบัญชี
✅ เพิ่มรายรับรายจ่าย
✅ อัปโหลดสลิป
✅ OCR อ่านสลิป
✅ Dashboard สรุปรายเดือน
✅ แชร์บัญชีกับเพื่อน

แล้วค่อยเพิ่ม

AI วิเคราะห์
Split Bill
งบประมาณ
Auto categorization
UI Style ที่น่ารักได้แนว
pastel finance app
glassmorphism
neo banking style (คล้าย Revolut / Monzo)