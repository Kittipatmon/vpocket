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

1) Login ด้วย Google ฟรี

ใช้ Social Login

composer require laravel/socialite

ติดตั้ง provider

php artisan make:controller AuthController

.env

GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

Route

Route::get('/auth/google',[AuthController::class,'redirect']);
Route::get('/auth/google/callback',[AuthController::class,'callback']);

Controller

use Laravel\Socialite\Facades\Socialite;

public function redirect(){
 return Socialite::driver('google')
 ->scopes([
   'openid',
   'profile',
   'email',
   'https://www.googleapis.com/auth/drive.file'
 ])
 ->redirect();
}

drive.file ให้แอปเขียนไฟล์ลง Drive ผู้ใช้ได้

2) สร้างโฟลเดอร์ใน Drive ผู้ใช้

ตอน login ครั้งแรก

VPocket/
   Receipts/

เก็บ folder id ไว้ใน users table

google_drive_folder_id
google_access_token
3) อัปสลิปขึ้น Drive

ผู้ใช้กดเพิ่มรายจ่าย → แนบรูป

$drive->files->create($fileMetadata,[
 'data'=>$content,
 'uploadType'=>'multipart'
]);

รูปไปอยู่ Drive user

4) OCR ฟรีด้วย Tesseract
composer require thiagoalessio/tesseract_ocr

อ่านสลิป

$text=(new TesseractOCR($path))
->lang('tha','eng')
->run();
5) แปลงเป็นรายการเงิน

ตัวอย่าง

Transaction::create([
'type'=>'expense',
'amount'=>120,
'description'=>'ข้าว',
'date'=>now(),
'slip_file_id'=>$googleId
]);
6 Dashboard

มี

รายรับ
รายจ่าย
เงินออม
แนบดูสลิปย้อนหลังได้
กดรายการแล้วเปิดสลิปใน Drive ได้
Database เพิ่ม

users

google_id
google_access_token
google_drive_folder_id

transactions

amount
type
category_id
slip_file_id
ocr_text
date
7 ของฟรีทั้งหมด

✅ Google Login ฟรี
✅ Google Drive ฟรี 15GB
✅ Tesseract OCR ฟรี
✅ Laravel ฟรี