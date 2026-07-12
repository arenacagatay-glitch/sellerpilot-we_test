
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

// ─────────────────────────────────────────────────────────────
// ADMIN PANELİ İÇİN: Talepleri okuyup JSON olarak döndürür.
// Telefonda #admin ekranı bu fonksiyondan veri çeker.
// Tarayıcı CORS engeline takılmamak için JSONP (callback) destekler:
//   ...exec?callback=fn   -> fn([...]) döner
//   ...exec               -> düz JSON döner
// ─────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var doc = SpreadsheetApp.openById("14Utuv-uzIrtdEaU31b_7zusCzLas-9oXjhVDS7HMM-Y");
    var sheet = doc.getSheetByName("Sheet1");

    var rows = sheet.getDataRange().getValues(); // [name, email, phone, date, status]
    var leads = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      // Başlık satırını atla (ilk sütunda "İsim"/"name" gibi bir başlık varsa)
      if (i === 0 && String(r[0]).toLowerCase().indexOf("isim") === -1 &&
          String(r[0]).toLowerCase().indexOf("name") === -1 && r[1] === "email") {
        // no-op
      }
      if (!r[0] && !r[1] && !r[2]) continue; // boş satırları atla
      leads.push({
        name:   r[0] ? String(r[0]) : "İsimsiz",
        email:  r[1] ? String(r[1]) : "",
        phone:  r[2] ? String(r[2]) : "",
        date:   r[3] ? String(r[3]) : "",
        status: r[4] ? String(r[4]) : ""
      });
    }

    // En yeni talep en üstte olsun
    leads.reverse();

    var payload = JSON.stringify(leads);
    var callback = e && e.parameter ? e.parameter.callback : null;

    if (callback) {
      return ContentService
        .createTextOutput(callback + "(" + payload + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService
      .createTextOutput(payload)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    var errPayload = JSON.stringify({ result: "error", error: err.toString() });
    var cb = e && e.parameter ? e.parameter.callback : null;
    if (cb) {
      return ContentService.createTextOutput(cb + "(" + errPayload + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(errPayload)
      .setMimeType(ContentService.MimeType.JSON);
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
