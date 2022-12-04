//RANDOM CREATE TEAM GENERATOR BOT CODE

// THIS BOT USE LANGUAGE BAHASA INDONESIA
//CREATE BY @awann_nn
//INSTAGRAM : @awan__n
//I hope you include a credit code from me in your bot

var token = "YOUR BOT TOKEN"; //CHANGE THIS
var url = "https://api.telegram.org/bot" + token;
var ssId = "YOUR SHEET ID"; //CHANGE THIS

var sheetData = SpreadsheetApp.openById(ssId).getSheetByName("SHEET NAME"); //CHANGE THIS
var sheetReport = SpreadsheetApp.openById(ssId).getSheetByName("SHEET NAME"); //CHANGE THIS
var index;
var username;
var idAdmin = "ADMIN TELEGRAM ID TYPE DATA NUMBER NOT STRING"; //CHANGE THIS

//MAIN FUCTION
function doPost(e) {
  var stringJson = e.postData.getDataAsString();
  var updates = JSON.parse(stringJson);
  var msg = updates.message;
  let idUser = msg.from.id;
  username = msg.chat.username;

  let temp = binarySearch(idUser, 2, sheetData.getLastRow());
  if (temp != 0) {
    index = temp;
  } else {
    writeUserId(idUser, username);
    index = binarySearch(idUser, 2, sheetData.getLastRow());
  }
  kelolaPesan(msg);
}
//END MAIN FUCTION

//WEBHOOK
var webAppUrl = "YOUR DEPLOY LINK GOOGLE APPS SCRIPT"; //CHSNGE THIS

function setWebhook() {
  var response = UrlFetchApp.fetch(url + "/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText());
}
//END WEBHOOK

//KELOLA PESAN
function kelolaPesan(msg) {
  let idUser = msg.from.id;
  let pesan = msg.text;

  if (/\/start/i.exec(pesan)) {
    resetWait();
    sendText(idUser, startFuction(idUser));
  } else if (/\/team/i.exec(pesan)) {
    resetWait();
    team(idUser);
  } else if (/\/anggota/i.exec(pesan)) {
    resetWait();
    anggota(idUser);
  } else if (/\/help/i.exec(pesan)) {
    resetWait();
    sendText(idUser, startFuction(idUser));
  } else if (/\/report/i.exec(pesan)) {
    resetWait();
    report(idUser);
  } else if (idUser == idAdmin) {
    balasReport(msg);
  } else {
    waitPesan(idUser, pesan);
  }
}

function resetWait() {
  sheetData.getRange(index, 3).setValue(null);
  sheetData.getRange(index, 4).setValue(null);
}

//END KELOLA PESAN

//ANGGOTA
function anggota(idUser) {
  sheetData.getRange(index, 3).setValue(2);
  sendText(idUser, "Setiap team Mau di isi berapa anggota?");
}
//END ANGGOTA

//TEAM
function team(idUser) {
  sheetData.getRange(index, 3).setValue(1);
  sendText(idUser, "Mau di jadikan berapa team?");
}
//END TEAM

//BAGI ANGGOTA
function bagiAnggota(anggota, pesan) {
  let team = 1;
  let hasil = "Hasil Random Team \n";
  let tamp = pesan.split("\n");
  let panjang = tamp.length;

  while (panjang > 0) {
    hasil += "\n\nTeam " + team;
    team++;
    for (let j = 0; j < anggota; j++) {
      if (panjang != 0) {
        let idx = random(1, panjang + 1) - 1;
        if (tamp[idx] != undefined) {
          hasil += "\n- " + tamp[idx];
          tamp = tataArr(tamp[idx], tamp);
          panjang = tamp.length;
        } else {
          j--;
        }
      } else {
        break;
      }
    }
  }

  return hasil;
}
//END BAGI ANGGOTA

//BAGI TIM
function bagiTeam(pesan, jumTeam) {
  let team = 1;
  let hasil = "Hasil Random Team \n";
  let tamp = pesan.split("\n");
  let panjang = tamp.length;
  let arr = Array(jumTeam).fill(0);
  arr = looping(jumTeam, panjang, arr, 0);

  for (let i = 0; i < jumTeam; i++) {
    hasil += "\n\nTeam " + team;
    team++;
    for (let j = 0; j < arr[i]; j++) {
      if (panjang != 0) {
        let idx = random(1, panjang + 1) - 1;
        if (tamp[idx] != undefined) {
          hasil += "\n- " + tamp[idx];
          tamp = tataArr(tamp[idx], tamp);
          panjang = tamp.length;
        } else {
          j--;
        }
      } else {
        break;
      }
    }
  }
  return hasil;
}

function looping(jumTeam, panjang, arr, i) {
  while (i < jumTeam) {
    if (panjang > 0) {
      arr[i] += 1;
      panjang--;
    }
    i++;
  }

  if (panjang > 0) {
    looping(jumTeam, panjang, arr, 0);
  }
  return arr;
}
//END BAGI TIM

//BALAS REPORT
function balasReport(msg) {
  let pesan = msg.text;
  let pesanWait = msg.reply_to_message.text;
  let cut = pesanWait.split("\n");
  let idInt = parseInt(cut[0]).toFixed();

  sendText(idInt, "From : Admin\n\nPesan : '" + pesan + "'");
  sendText(idAdmin, "Berhasil terkirim");
}
//END BALAS REPORT

//BINARY SEARCH
function binarySearch(idUser, start, end) {
  if (start > end) {
    return 0;
  }

  let mid = Math.floor((start + end) / 2);
  let sheet = SpreadsheetApp.openById(ssId).getSheetByName("data");
  let data = sheet.getRange(mid, 1).getValue();

  if (data == idUser) {
    return mid;
  }

  if (data > idUser) {
    return binarySearch(idUser, start, mid - 1);
  } else {
    return binarySearch(idUser, mid + 1, end);
  }
}
//END BINARY SEARCH

//RANDOM
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
//END RANDOM

//REPORT
function report(idUser) {
  sheetData.getRange(index, 3).setValue(3);
  sendText(idUser, "Apa pesannya?");
}
//END REPORT

//SEND TEXT
function sendText(chatid, text, replymarkup) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatid),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(replymarkup),
    },
  };
  UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/", data);
}
//END SEND TEXT

//START HEADLE
function startFuction(idUser) {
  let banyakData = sheetData.getLastRow();
  let ress = binarySearch(idUser, 2, banyakData);

  if (ress != 0) {
    index = ress;
  } else {
    writeUserId(idUser);
    index = binarySearch(idUser, 2, sheetData.getLastRow());
  }
  return "Selamat Datang di Bot Random Team Generator \nCreate By : Awan\n\n /team - membagi menjadi banyak team yang di inginkan\n\n /anggota - membagi sesuai banyak anggota perteam yang di inginkan";
}
//END START HEADLE

//TATA AERRAY
function tataArr(i, arr) {
  const index = arr.indexOf(i);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

//END TATA AERRAY

//PESAN WAIT
function waitPesan(idUser, pesan) {
  let index = binarySearch(idUser, 2, sheetData.getLastRow());
  let wait = sheetData.getRange(index, 3).getValue();

  if (wait == 1) {
    let toInt = parseInt(pesan);
    sheetData.getRange(index, 4).setValue(toInt);
    sheetData.getRange(index, 3).setValue(10);
    sendText(idUser, "Siapa saja yang mau di acak?");
  } else if (wait == 2) {
    let toInt = parseInt(pesan);
    sheetData.getRange(index, 4).setValue(toInt);
    sheetData.getRange(index, 3).setValue(20);
    sendText(idUser, "Siapa saja yang mau di acak?");
  } else if (wait == 3) {
    sendText(idAdmin, idUser + "\n" + username + "\n\n'" + pesan + "'");
    sendText(idUser, "Sukses Terkirim ke Creator");
  } else if (wait == 10) {
    let jumTim = sheetData.getRange(index, 4).getValue();
    sendText(idUser, bagiTeam(pesan, jumTim));
  } else if (wait == 20) {
    let anggota = sheetData.getRange(index, 4).getValue();
    sendText(idUser, bagiAnggota(anggota, pesan, 0));
  } else {
    sendText(idUser, " Bot Tidak Tau yang kamu maksud");
  }
}
//END PESAN WAIT

// CREATE USER
function writeUserId(idUser) {
  for (let i = 2; i <= sheetData.getLastRow(); i++) {
    let dataId = sheetData.getRange(i, 1).getValue();

    if (dataId == idUser) {
      index = 1;
    } else if (dataId > idUser) {
      sheetData.insertRowAfter(i - 1);
      sheetData.getRange(i, 1).setValue(idUser);
      sheetData.getRange(i, 2).setValue(username);
      break;
    }
  }
}
//END CREATE USER
