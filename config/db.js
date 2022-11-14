const mysql = require('mysql2');
const mysqlp = require('mysql2/promise')

const conLocalP = mysqlp.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartsys_Monitoring_mach",
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true
})

const conLocal = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartsys_Monitoring_mach",
  multipleStatements: true
})


const conTicket = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartsys_Ticketing"
});

module.exports = { conLocal, conTicket, conLocalP }