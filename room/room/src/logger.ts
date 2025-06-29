import fs from "fs";
import path from "path";

//Set up dates
const startedDate = new Date();
let now = startedDate;

let year = now.getFullYear();
let month = String(now.getMonth() + 1).padStart(2, "0");
let day = String(now.getDate()).padStart(2, "0");
let hours = now.getHours();
let minutes = now.getMinutes().toString().padStart(2, "0");
let seconds = now.getSeconds().toString().padStart(2, "0");
let ampm = hours >= 12 ? "PM" : "AM";

let formattedDate = `${year}-${month}-${day}`;
let formattedTime = `[${hours % 12 || 12};${minutes};${seconds} ${ampm}]`;

//Initialize File Path
const BASE_FOLDER = __dirname.substring(0, __dirname.length - 6);
let logsDirectory = path.join(BASE_FOLDER, `logs/${formattedDate}`);
let logFileName = path.join(
  logsDirectory,
  `${now.getTime()}${formattedTime}.log`
);

let previousDay = day;
function updateDateAndDirectory() {
  now = new Date();
  year = now.getFullYear();
  month = String(now.getMonth() + 1).padStart(2, "0");
  day = String(now.getDate()).padStart(2, "0");
  hours = now.getHours();
  minutes = now.getMinutes().toString().padStart(2, "0");
  seconds = now.getSeconds().toString().padStart(2, "0");
  ampm = hours >= 12 ? "PM" : "AM";
  formattedDate = `${year}-${month}-${day}`;
  formattedTime = `[${hours % 12 || 12};${minutes};${seconds} ${ampm}]`;

  if (day != previousDay) {
    // new day new folder
    logsDirectory = path.join(BASE_FOLDER, `logs/${formattedDate}`);
    logFileName = path.join(
      logsDirectory,
      `${now.getTime()}${formattedTime}.log`
    );
    fs.mkdir(
      logsDirectory,
      { recursive: true },
      (dirErr: NodeJS.ErrnoException | null) => {
        if (dirErr) {
          console.error("Error creating logs directory:", dirErr);
        } else {
          console.log("Logs directory created:", logsDirectory);

          // Now, create or append to the log file
          fs.writeFile(
            logFileName,
            "",
            { flag: "a+" },
            (fileErr: NodeJS.ErrnoException | null) => {
              if (fileErr) {
                console.error("Error creating log file:", fileErr);
              } else {
                console.log("Log file created:", logFileName);
              }
            }
          );
        }
      }
    );
  }
  previousDay = day;
}

export const SERVER = {
  /*
    Why use SERVER instead of console.log()? For future additions. Eventually I want to write console logs to a file for debugging
    SERVER system should make that easier
    Separating by room should also help because it will make individual "room history" logs
    */
  logToFile: (info: string) => {
    updateDateAndDirectory();

    fs.appendFile(
      logFileName,
      info + "\n",
      (err: NodeJS.ErrnoException | null) => {
        if (err) {
          console.error("Error writing to log file:", err);
        }
      }
    );
  },

  initLogFile: () => {
    // Create the 'logs' directory if it doesn't exist
    fs.mkdir(
      logsDirectory,
      { recursive: true },
      (dirErr: NodeJS.ErrnoException | null) => {
        if (dirErr) {
          console.error("Error creating logs directory:", dirErr);
        } else {
          console.log("Logs directory created:", logsDirectory);

          // Now, create or append to the log file
          fs.writeFile(
            logFileName,
            "",
            { flag: "a+" },
            (fileErr: NodeJS.ErrnoException | null) => {
              if (fileErr) {
                console.error("Error creating log file:", fileErr);
              } else {
                console.log("Log file created:", logFileName);
              }
            }
          );
        }
      }
    );
  },
  logLevel: 3,
  error: (info: string, rn: string) => {
    if (typeof rn !== "undefined") {
      console.warn("ERROR IN ROOM " + rn + ": " + info);
      SERVER.logToFile(info);
    } else if (SERVER.logLevel >= 1) {
      console.warn("SERVER ERROR: " + info);
      SERVER.logToFile(info);
    }
  },
  errorTrace: (info: string, rn: string) => {
    if (typeof rn !== "undefined") {
      console.trace("ERROR - STACK TRACE FOR ROOM " + rn + ": " + info);
      SERVER.logToFile(info);
    } else if (SERVER.logLevel >= 1) {
      console.trace("ERROR - SERVER STACK TRACE: " + info);
      SERVER.logToFile(info);
    }
  },
  warn: (info: string, rn: string) => {
    if (typeof rn !== "undefined") {
      console.trace("Warning - Room " + rn + ": " + info);
      SERVER.logToFile(info);
    } else if (SERVER.logLevel >= 2) {
      console.trace("Warning - Server: " + info);
      SERVER.logToFile(info);
    }
  },
  log: (info: string, rn: string) => {
    if (typeof rn !== "undefined") {
      console.log("Room " + rn + ": " + info);
      SERVER.logToFile(info);
    } else if (SERVER.logLevel >= 3) {
      console.log("Server: " + info);
      SERVER.logToFile(info);
    }
  },
  debug: (info: string, rn: string) => {
    if (typeof rn !== "undefined") {
      console.log("(Debug) Room " + rn + ": " + info);
      SERVER.logToFile(info);
    } else if (SERVER.logLevel >= 4) {
      console.warn("(Debug) Server: " + info);
      SERVER.logToFile(info);
    }
  },
  trace: (info: string, rn: string) => {
    if (typeof rn !== "undefined") {
      console.trace("Trace - Room " + rn + ": " + info);
      SERVER.logToFile(info);
    } else if (SERVER.logLevel >= 5) {
      console.trace("Trace - Server: " + info);
      SERVER.logToFile(info);
    }
  },
  functionCall: (
    name: string,
    ...parameters: { name: string; value: string }[]
  ) => {
    if (SERVER.logLevel >= 4) {
      let paramString = "";
      parameters.map((p) => {
        if (p) {
          paramString += " " + p.name + ": " + p.value;
        }
      });
      console.log(name + "() called | " + paramString);
      SERVER.logToFile(name + "() called | " + paramString);
    }
  },
};

SERVER.initLogFile();

module.exports = SERVER;
