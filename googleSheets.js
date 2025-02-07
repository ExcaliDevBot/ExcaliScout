function getFirebaseScoutingData() {
  fetchAndWriteScoutingData();
  fetchAndWritePitScoutingData();
  fetchAndWriteSuperScoutingData();
}

function fetchAndWriteScoutingData() {
  const scoutingSheetName = "SCOUTING";
  const firebaseUrlScouting = "https://excaliburscouting-6738e-default-rtdb.firebaseio.com/scoutingData.json";

  const scoutingHeaderOrder = [
    "Match", "Name", "Team", "Alliance", "Notes", "autoL1", "autoL2", "autoL3", "autoL4",
     "L1", "L2", "L3", "L4", "algaeCount",
    "climbOption", "WinnerPrediction", "submittedAt"
  ];

  fetchAndWriteData(firebaseUrlScouting, scoutingSheetName, scoutingHeaderOrder);
}

function fetchAndWritePitScoutingData() {
  const pitScoutingSheetName = "PIT SCOUTING";
  const firebaseUrlPitScouting = "https://excaliburscouting-6738e-default-rtdb.firebaseio.com/pitScoutingResults.json";

  fetchAndWriteData(firebaseUrlPitScouting, pitScoutingSheetName);
}

function fetchAndWriteSuperScoutingData() {
  const superScoutingSheetName = "SUPER SCOUTING";
  const firebaseUrlSuperScouting = "https://excaliburscouting-6738e-default-rtdb.firebaseio.com/superScoutingResults.json";

  fetchAndWriteData(firebaseUrlSuperScouting, superScoutingSheetName);
}

function fetchAndWriteData(firebaseUrl, sheetName, headerOrder = []) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    Logger.log(`No sheet found with the name ${sheetName}. Please ensure the sheet exists.`);
    return;
  }

  sheet.clear(); // Clear existing content

  try {
    const response = UrlFetchApp.fetch(firebaseUrl);
    const data = JSON.parse(response.getContentText());

    if (!data || Object.keys(data).length === 0) {
      Logger.log(`No data found for ${sheetName}.`);
      return;
    }

    let rows = [];

    // Handle dynamic header fetching for PIT SCOUTING and SUPER SCOUTING
    if (sheetName === "PIT SCOUTING" || sheetName === "SUPER SCOUTING") {
      let headersSet = new Set(["Team", "Name"]);
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          const entry = data[key];
          const questions = entry.questions || {};
          Object.keys(questions).forEach(questionNumber => {
            if (questions[questionNumber] && questions[questionNumber].question) {
              headersSet.add(questions[questionNumber].question);
            }
          });
        }
      }
      headerOrder = Array.from(headersSet);
    }

    if (headerOrder.length === 0) {
      Logger.log(`No headers available for ${sheetName}. Aborting.`);
      return;
    }

    sheet.getRange(1, 1, 1, headerOrder.length).setValues([headerOrder]);

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        const entry = data[key];
        const row = new Array(headerOrder.length).fill("");

        row[headerOrder.indexOf("Team")] = entry.team_number || entry.Team || "";
        row[headerOrder.indexOf("Name")] = entry.username || entry.Name || "";

        if (sheetName === "SCOUTING") {
          headerOrder.forEach((header, i) => {
            if (entry.hasOwnProperty(header)) {
              row[i] = entry[header];
            }
          });
        } else {
          const questions = entry.questions || {};
          for (let questionNumber in questions) {
            if (questions.hasOwnProperty(questionNumber)) {
              const questionData = questions[questionNumber];
              const questionText = questionData.question;
              const answer = questionData.answer;

              if (questionText && headerOrder.includes(questionText)) {
                row[headerOrder.indexOf(questionText)] = answer;
              }
            }
          }
        }

        rows.push(row);
      }
    }

    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headerOrder.length).setValues(rows);
    }

    Logger.log(`${sheetName} data successfully written to sheet.`);
  } catch (error) {
    Logger.log(`Error fetching or processing data for ${sheetName}: ` + error);
  }
}

function fetchAndWritePitScoutingData() {
  const pitScoutingSheetName = "PIT SCOUTING";
  const firebaseUrlPitScouting = "https://excaliburscouting-6738e-default-rtdb.firebaseio.com/pitScoutingResults.json";

  const questionHeaders = [
    "גובה הטיפוס (מטר מקסימלי)",
    "האם הטיפוס מפריע לקבוצה אחרת לטפס",
    "האם הרובוט מסוגל לנקד ב L1",
    "האם הרובוט מסוגל לנקד בL2 ",
    "האם הרובוט מסוגל לנקד ב L3",
    "האם הרובוט מסוגל לנקד בL4 ",
    "האם הרובוט מסוגל לאסוף מהרצפה",
    "האם הרובוט מסוגל לאסוף מהפידר",
    "האם הרובוט מסוגל לנקד Algae בפרוססור",
    "האם הרובוט מסוגל לנקד Algae ברשת",
    "האם הרובוט יוצא מאזור ההתחלה באוטונומי",
    "האם אתם מסוגלים להעיף Algae מהריף",
    "תאר פירוט אוטונומיי לגבי כל מסלול",
    "הערות כלליות אחרות"
  ];

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(pitScoutingSheetName);

  if (!sheet) {
    Logger.log(`No sheet found with the name ${pitScoutingSheetName}. Please ensure the sheet exists.`);
    return;
  }

  sheet.clear();

  try {
    const response = UrlFetchApp.fetch(firebaseUrlPitScouting);
    const data = JSON.parse(response.getContentText());

    if (!data || Object.keys(data).length === 0) {
      Logger.log(`No data found for ${pitScoutingSheetName}.`);
      return;
    }

    const headers = ["Team", "Name", ...questionHeaders];
    let rows = [];

    for (let team in data) {
      if (data.hasOwnProperty(team)) {
        const entry = data[team];
        const answers = entry.answers || [];

        const row = new Array(headers.length).fill("");
        row[headers.indexOf("Team")] = team;
        row[headers.indexOf("Name")] = entry.username || "";

        // Map answers to their respective questions
        answers.forEach((answer, index) => {
          if (index < questionHeaders.length) {
            row[headers.indexOf(questionHeaders[index])] = answer;
          }
        });

        rows.push(row);
      }
    }

    // Write headers and data to the sheet
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }

    Logger.log(`${pitScoutingSheetName} data successfully written to sheet.`);
  } catch (error) {
    Logger.log(`Error fetching or processing data for ${pitScoutingSheetName}: ` + error);
  }
}


