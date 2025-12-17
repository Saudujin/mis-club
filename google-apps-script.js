// هذا الكود يجب وضعه في Google Apps Script
// 1. اذهب إلى https://script.google.com/
// 2. أنشأ مشروع جديد
// 3. الصق هذا الكود
// 4. قم بالنشر كـ Web App (Deploy > New deployment > Web app)
// 5. اجعل الوصول (Who has access) = Anyone
// 6. انسخ الرابط واستخدمه في تطبيقك

const SPREADSHEET_ID = "1OJkym7TmTJ2xjj2r4jqUCg6b34p_WHqLmlkZk3xXm1E"; // معرف الشيت الذي زودتني به

// --- التعامل مع الطلبات القادمة (POST) - للتسجيل ---
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const data = JSON.parse(e.postData.contents);
    
    let targetSheetName = "Sheet1"; 
    
    if (data.type === "event_registration" && data.eventId) {
      targetSheetName = "Event_" + data.eventId.replace(/[^a-zA-Z0-9_]/g, "_");
    }

    let sheet = ss.getSheetByName(targetSheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
      if (data.type === "event_registration") {
        setupEventHeaders(sheet);
      } else {
        setupMemberHeaders(sheet);
      }
    }

    if (data.type === "event_registration") {
      sheet.appendRow([
        new Date(),
        data.fullName,
        "'" + data.phone,
        data.email,
        data.linkedin || "لا يوجد",
        data.reason || "لا يوجد",
        "قيد المراجعة"
      ]);
    } else {
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

// --- التعامل مع طلبات الجلب (GET) - لعرض الفعاليات ---
function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let eventsSheet = ss.getSheetByName("Events");
    
    // إذا لم تكن ورقة الفعاليات موجودة، قم بإنشائها وإضافة بيانات تجريبية
    if (!eventsSheet) {
      eventsSheet = ss.insertSheet("Events");
      setupEventsConfigHeaders(eventsSheet);
      addSampleEvent(eventsSheet);
    }

    const rows = eventsSheet.getDataRange().getValues();
    const headers = rows[0];
    const events = [];

    // تحويل الصفوف إلى مصفوفة من الكائنات (Objects)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const event = {};
      
      // تخطي الصفوف الفارغة
      if (!row[0]) continue;

      for (let j = 0; j < headers.length; j++) {
        const key = headers[j];
        let value = row[j];
        
        // معالجة خاصة لبعض الحقول
        if (key === "speakers") {
          value = value ? value.toString().split(",").map(s => s.trim()) : [];
        } else if (key === "isRegistrationOpen") {
          value = value === true || value === "TRUE" || value === "true";
        }
        
        event[key] = value;
      }
      events.push(event);
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      data: events 
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

// --- دوال مساعدة للإعداد ---

function setupEventHeaders(sheet) {
  const headers = ["Timestamp", "Full Name", "Phone", "Email", "LinkedIn", "Reason for Attending", "Status"];
  sheet.appendRow(headers);
  styleHeaders(sheet);
}

function setupMemberHeaders(sheet) {
  const headers = ["Timestamp", "Full Name", "Phone", "University ID", "Major", "Email", "Committee", "Contribution", "Skills", "CV URL"];
  sheet.appendRow(headers);
  styleHeaders(sheet);
}

function setupEventsConfigHeaders(sheet) {
  // هذه هي أسماء الأعمدة التي يجب أن تكون في ورقة "Events"
  // يجب أن تطابق المفاتيح المستخدمة في الكود (Frontend)
  const headers = [
    "id", 
    "title", 
    "date", 
    "time", 
    "location", 
    "image", 
    "description", 
    "isRegistrationOpen", 
    "speakers"
  ];
  sheet.appendRow(headers);
  styleHeaders(sheet);
}

function addSampleEvent(sheet) {
  sheet.appendRow([
    "sample-event-1",
    "ورشة عمل تجريبية",
    "2025-10-20",
    "04:00 م",
    "عن بعد",
    "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000",
    "هذه فعالية تجريبية تم إنشاؤها تلقائياً. يمكنك تعديلها أو حذفها وإضافة فعالياتك الخاصة في هذا الجدول.",
    true,
    "أحمد, سارة"
  ]);
}

function styleHeaders(sheet) {
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight("bold").setBackground("#024ca5").setFontColor("#ffffff");
  sheet.setFrozenRows(1);
}
