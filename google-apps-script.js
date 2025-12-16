// هذا الكود يجب وضعه في Google Apps Script
// 1. اذهب إلى https://script.google.com/
// 2. أنشأ مشروع جديد
// 3. الصق هذا الكود
// 4. قم بالنشر كـ Web App (Deploy > New deployment > Web app)
// 5. اجعل الوصول (Who has access) = Anyone
// 6. انسخ الرابط وضعه في ملف Join.tsx

const SPREADSHEET_ID = "1gR_bchDuBewbnsdBX99f01tAbUb3QhRz_qjrQvoeyvo"; // معرف الشيت الخاص بك
const SHEET_NAME = "Sheet1"; // تأكد من اسم الورقة

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // إذا لم تكن الورقة موجودة، قم بإنشائها
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "Sheet not found" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // قراءة البيانات المرسلة
    const data = JSON.parse(e.postData.contents);
    
    // إضافة صف جديد بالبيانات
    // الترتيب: الاسم، الجوال، الرقم الجامعي، التخصص، الإيميل، اللجنة، المساهمة، المهارات، رابط السيرة
    sheet.appendRow([
      new Date(), // الطابع الزمني
      data.fullName,
      data.phone,
      data.universityId,
      data.major,
      data.email,
      data.committee,
      data.contribution,
      data.skills.join(", "), // تحويل مصفوفة المهارات لنص
      data.cvUrl || "لا يوجد"
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data saved successfully" 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// لإعداد الأعمدة في الشيت لأول مرة (اختياري)
function setupSheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow([
    "Timestamp", 
    "Full Name", 
    "Phone", 
    "University ID", 
    "Major", 
    "Email", 
    "Committee", 
    "Contribution", 
    "Skills", 
    "CV URL"
  ]);
}
