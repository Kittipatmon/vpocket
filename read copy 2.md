Flow ระบบ
สมัคร/ล็อกอินด้วย Gmail
   ↓
ผู้ใช้เชื่อม Google Drive ของตัวเอง
   ↓
อัปโหลดสลิป
   ↓
เก็บรูปเข้าโฟลเดอร์ VPocket ใน Drive ผู้ใช้
   ↓
OCR อ่านข้อมูลสลิป
   ↓
บันทึก รายรับ/รายจ่าย ลงฐานข้อมูล
   ↓
Dashboard / รายงานรายเดือน


วิธีฟรี 100%
วิธีที่ 1 (แนะนำสุด) เก็บรูปใน Google Drive + Laravel ดึง metadata

ใช้ Google Drive ฟรี 15GB ได้เลย

ผู้ใช้ upload สลิป → อัปไป Google Drive

Laravel ใช้ Google Drive API ฟรี

composer require google/apiclient:^2.0
ใช้ OCR ฟรีแทน Google Vision
ตัวเลือก A — Tesseract OCR (ฟรี)

ติดตั้ง

composer require thiagoalessio/tesseract_ocr

Windows (XAMPP) ลง Tesseract:
https://github.com/tesseract-ocr/tesseract

ตัวอย่าง

use thiagoalessio\TesseractOCR\TesseractOCR;

$text = (new TesseractOCR($imagePath))
            ->lang('tha','eng')
            ->run();

echo $text;

อ่านสลิปฟรี

ตัวเลือก B (ง่ายกว่า) ให้ user กรอกตอนอัปโหลด

แนบสลิป + กรอก

จำนวนเงิน
รายรับ/รายจ่าย
หมวดหมู่
วันที่

แล้วเก็บรูปไว้ Drive

เหมือนแนบหลักฐาน

แยกเดือน/ปี อัตโนมัติ

ไม่ต้องแยกโฟลเดอร์ใน Drive ก็ได้
ใช้ database แยก

date
type
amount
slip_file_id

Query รายเดือน

Transaction::whereMonth('date',4)
->whereYear('date',2026)
->get();
ฟรีแบบ Auto Sync จาก Google Drive

ตั้ง folder เช่น

slips/
 ├─ income
 └─ expense

Laravel ดึงทุกวัน

php artisan make:command SyncSlips

Cron

Schedule::command('slips:sync')->daily();

ฟรีทั้งหมด

✅ Google Drive ฟรี
✅ Google API ฟรีระดับใช้งานทั่วไป
✅ Tesseract ฟรี
✅ Laravel ฟรี

Stack ฟรีที่ผมแนะนำ
Laravel
React/Inertia
Google Drive (เก็บสลิป)
Tesseract OCR (อ่านสลิป)
SQLite/MySQL
ถ้าทำแอปรายจ่ายจริง ผมแนะนำแบบนี้
อัปสลิปเข้า Drive
OCR อ่านยอดเงินอัตโนมัติ
User กดยืนยันแก้ไขได้
บันทึกเข้ารายรับ/รายจ่าย
Dashboard สรุปรายเดือน

เหมือนแอปธนาคารเลย