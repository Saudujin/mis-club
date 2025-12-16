// هذا الكود يجب وضعه في Google Apps Script
// 1. اذهب إلى https://script.google.com/
// 2. أنشأ مشروع جديد
// 3. الصق هذا الكود
// 4. قم بالنشر كـ Web App (Deploy > New deployment > Web app)
// 5. اجعل الوصول (Who has access) = Anyone
// 6. انسخ الرابط وضعه في ملف Join.tsx مكان "YOUR_SCRIPT_ID_HERE"

const SPREADSHEET_ID = "1gR_bchDuBewbnsdBX99f01tAbUb3QhRz_qjrQvoeyvo"; // معرف الشيت الذي زودتني به
const SHEET_NAME = "Sheet1"; // الاسم الافتراضي للورقة الأولى، يرجى التأكد منه في ملفك

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "Sheet not found. Please rename your sheet to 'Sheet1' or update the script." 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // قراءة البيانات المرسلة
    const data = JSON.parse(e.postData.contents);
    
    // إضافة صف جديد بالبيانات
    sheet.appendRow([
      new Date(), // الطابع الزمني
      data.fullName,
      "'" + data.phone, // إضافة فاصلة علوية لمنع تحويل الرقم لصيغة علمية
      "'" + data.universityId,
      data.major,
      data.email,
      data.committee,
      data.contribution,
      Array.isArray(data.skills) ? data.skills.join(", ") : data.skills,
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
  } finally {
    lock.releaseLock();
  }
}

// دالة مساعدة لإعداد ترويسة الأعمدة (شغلها مرة واحدة فقط)
function setupHeaders() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (sheet) {
    sheet.clear();
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
    // تنسيق الترويسة
    sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#024ca5").setFontColor("#ffffff");
  }
}
