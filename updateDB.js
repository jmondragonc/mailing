// (A) LOAD MODULES
const fs = require("fs"),
  { registerFont, createCanvas, loadImage } = require("canvas");
const mysql = require("mysql2/promise");
const moment = require("moment");

const config = {
  db: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "volvo_mailing",
    port: 3306,
    connectTimeout: 60000,
  },
};

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.execute(sql, params);

  return results;
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

const getUsers = async () => {
  const rows = await query(`SELECT * FROM usuario`);
  const data = emptyOrRows(rows);

  return data;
};

editUser = async (id, data) => {
  let now = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const rows = await query(
    `UPDATE usuario 
      SET header='${data}', fecha_registro='${now}'
      WHERE id=${id}`
  );

  let message = "Error while updating user...";

  if (rows.affectedRows) {
    message = "User updated successfully!";
  }

  return { message };
};

const getData = async () => {
  const data = await getUsers();
  data.map((item) => {
    let fileName =
      item.dealer
        .split("_")
        .join("")
        .split("-")
        .join("")
        .split("  ")
        .join("")
        .split(" ")
        .join("_") +
      "-" +
      item.asesor
        .split("_")
        .join("")
        .split("-")
        .join("")
        .split("  ")
        .join("")
        .split(" ")
        .join("_");

    finalPath = `${item.id}_header_${fileName.toLocaleLowerCase()}.png`;

    console.log(fileName.toLocaleLowerCase());

    return editUser(item.id, finalPath);
  });

  return data;
};

getData();
