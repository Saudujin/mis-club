// هذا الكود يجب وضعه في Google Apps Script
// 1. اذهب إلى https://script.google.com/
// 2. أنشأ مشروع جديد
// 3. الصق هذا الكود
// 4. قم بالنشر كـ Web App (Deploy > New deployment > Web app)
// 5. اجعل الوصول (Who has access) = Anyone
// 6. انسخ الرابط واستخدمه في تطبيقك

const SPREADSHEET_ID = "1OJkym7TmTJ2xjj2r4jqUCg6b34p_WHqLmlkZk3xXm1E"; // معرف الشيت الذي زودتني به

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const data = JSON.parse(e.postData.contents);
    
    // تحديد اسم الورقة بناءً على نوع الطلب
    // إذا كان تسجيل عضوية، نستخدم "Members" (أو Sheet1 سابقاً)
    // إذا كان تسجيل فعالية، نستخدم معرف الفعالية (eventId) كاسم للورقة
    let targetSheetName = "Sheet1"; // الافتراضي لتسجيل العضوية
    
    if (data.type === "event_registration" && data.eventId) {
      // تنظيف اسم الفعالية ليكون صالحاً كاسم ورقة
      targetSheetName = "Event_" + data.eventId.replace(/[^a-zA-Z0-9_]/g, "_");
    }

    let sheet = ss.getSheetByName(targetSheetName);
    
    // إذا لم تكن الورقة موجودة (للفعاليات الجديدة)، نقوم بإنشائها
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
      // إعداد ترويسة الأعمدة للورقة الجديدة
      if (data.type === "event_registration") {
        setupEventHeaders(sheet);
      } else {
        setupMemberHeaders(sheet);
      }
    }

    // إضافة البيانات حسب نوع الطلب
    if (data.type === "event_registration") {
      sheet.appendRow([
        new Date(), // الطابع الزمني
        data.fullName,
        "'" + data.phone,
        data.email,
        data.linkedin || "لا يوجد",
        data.reason || "لا يوجد",
        "قيد المراجعة" // حالة الطلب الافتراضية
      ]);
    } else {
      // تسجيل العضوية (النمط القديم)
      sheet.appendRow([
        new Date(),
        data.fullName,
        "'" + data.phone,
        "'" + data.universityId,
        data.major,
        data.email,
        data.committee,
        data.contribution,
        Array.isArray(data.skills) ? data.skills.join(", ") : data.skills,
        data.cvUrl || "لا يوجد"
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data saved successfully",
      sheetName: targetSheetName
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

function setupEventHeaders(sheet) {
  const headers = [
    "Timestamp", 
    "Full Name", 
    "Phone", 
    "Email", 
    "LinkedIn", 
    "Reason for Attending",
    "Status"
  ];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#024ca5").setFontColor("#ffffff");
  sheet.setFrozenRows(1);
}

function setupMemberHeaders(sheet) {
  const headers = [
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
  ];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#024ca5").setFontColor("#ffffff");
  sheet.setFrozenRows(1);
}
