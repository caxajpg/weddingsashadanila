/* ========================================
   GOOGLE APPS SCRIPT — RSVP → Google Sheet
   
   ИНСТРУКЦИЯ:
   
   1. Откройте Google Таблицу (sheets.google.com)
   2. Создайте новую таблицу (или используйте существующую)
   3. В таблице: Расширения → Apps Script
   4. Замените весь код в редакторе на этот скрипт
   5. Нажмите "Деплой" → "Новый деплой"
   6. Тип: "Веб-приложение"
   7. "Выполнять от имени:" — "Мне"
   8. "Кто имеет доступ:" — "Все"
   9. Нажмите "Деплой" и скопируйте URL
   10. Вставьте URL в файл script.js (строка GOOGLE_SHEET_URL)
   
   Готово! Теперь данные из формы будут попадать в таблицу.
   ======================================== */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Добавляем строку с данными
    sheet.appendRow([
      new Date(),              // Время отправки
      data.name || '',         // Имя
      data.attending || '',    // Присутствие
      data.drink || '',        // Напиток
      data.wishes || '',       // Пожелания
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('RSVP API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}
