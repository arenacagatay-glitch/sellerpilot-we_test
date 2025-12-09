
function doPost(e) {
  var lock = LockService.getScriptLock();
  
  // 1. Çakışmayı önlemek için kilitle
  try {
    lock.waitLock(30000); 
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({result: "error", error: "Server busy"})).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var doc = SpreadsheetApp.openById("14Utuv-uzIrtdEaU31b_7zusCzLas-9oXjhVDS7HMM-Y");
    var sheet = doc.getSheetByName("Sheet1");

    // 2. Veriyi Güvenli Parse Et
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      data = e.parameter;
    }

    var name = data.name || "İsimsiz";
    var email = data.email || "Yok";
    var phone = data.phone || "Yok";
    var date = new Date().toLocaleString("tr-TR");

    // 3. KRİTİK ADIM: Önce Sheet'e yaz ve DİSKE KAYDET (Flush)
    // Bunu yapmazsak mail hata verirse veri de kaybolur.
    sheet.appendRow([name, email, phone, date, "Mail Gönderiliyor..."]);
    var lastRow = sheet.getLastRow();
    SpreadsheetApp.flush(); // <--- BU KOMUT VERİYİ GARANTİLER

    // 4. Mail İçeriğini Hazırla
    var htmlBody = 
      '<div style="background:#f5f5f5; padding:20px; font-family:sans-serif;">' +
        '<div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:10px; border:1px solid #eee;">' +
          '<h2 style="color:#FF6B35; margin-top:0;">🚀 Yeni Demo Talebi</h2>' +
          '<div style="background:#fff4e6; padding:15px; border-radius:5px; margin-bottom:20px;">' +
            '<p style="margin:5px 0;"><strong>👤 İsim:</strong> ' + name + '</p>' +
            '<p style="margin:5px 0;"><strong>📧 Email:</strong> <a href="mailto:' + email + '">' + email + '</a></p>' +
            '<p style="margin:5px 0;"><strong>📱 Telefon:</strong> <a href="tel:' + phone + '">' + phone + '</a></p>' +
          '</div>' +
          '<p style="font-size:12px; color:#999; text-align:center;">SellerPilot Web Bildirim Sistemi</p>' +
        '</div>' +
      '</div>';

    // 5. Mail Gönder (MailApp kullanıyoruz)
    MailApp.sendEmail({
      to: "arenacagatay@gmail.com",
      subject: "🔔 SellerPilot: " + name + " Demo İstedi",
      htmlBody: htmlBody,
      noReply: true
    });

    // 6. Başarılı olduysa Sheet'i güncelle
    sheet.getRange(lastRow, 5).setValue("✅ GÖNDERİLDİ");
    SpreadsheetApp.flush();

    return ContentService.createTextOutput(JSON.stringify({result: "success"})).setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    // Hata olursa Sheet'e hatayı yaz
    try {
       var doc = SpreadsheetApp.openById("14Utuv-uzIrtdEaU31b_7zusCzLas-9oXjhVDS7HMM-Y");
       var sheet = doc.getSheetByName("Sheet1");
       // Eğer satır zaten eklendiyse oraya hatayı yaz, eklenmediyse yeni satır aç
       if (typeof lastRow !== 'undefined') {
         sheet.getRange(lastRow, 5).setValue("❌ HATA: " + e.toString());
       } else {
         sheet.appendRow(["SİSTEM HATASI", "-", "-", new Date(), e.toString()]);
       }
       SpreadsheetApp.flush();
    } catch(ex) {}
    
    return ContentService.createTextOutput(JSON.stringify({result: "error", error: e.toString()})).setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    lock.releaseLock();
  }
}

// İZİN VERMEK İÇİN ÖNCE BUNU ÇALIŞTIR
function testSetup() {
  MailApp.sendEmail({
    to: "arenacagatay@gmail.com",
    subject: "Kurulum Testi",
    body: "Sistem çalışıyor."
  });
}
