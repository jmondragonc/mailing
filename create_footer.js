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
      SET footer='${data}', fecha_registro='${now}'
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
  //console.log(data);

  //for (let i = 0; i < data.length; i++) {
  let i = 0;
  const t = await setInterval(function () {
    generateImages(
      data[i].dealer,
      data[i].cliente,
      data[i].asesor,
      data[i].telefono_asesor,
      data[i].mail_asesor,
      data[i].id
    );
    i++;
    console.log(data.length - 1, i);
    if (data.length == i) {
      clearInterval(t);
    }
  }, 1000);

  // }

  return data;
};

async function generateImages(
  dealer,
  cliente,
  asesor,
  telefono_asesor,
  mail_asesor,
  id
) {
  registerFont("./VolvoNovum-Medium.ttf", { family: "Volvo Novum Medium" }); // CHANGE TO YOUR OWN!

  // Function to remove accents and normalize text
  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  let fileName =
    removeAccents(dealer)
      .split("_")
      .join("")
      .split("-")
      .join("")
      .split("  ")
      .join("")
      .split(" ")
      .join("_") +
    "-" +
    removeAccents(asesor)
      .split("_")
      .join("")
      .split("-")
      .join("")
      .split("  ")
      .join("")
      .split(" ")
      .join("_");

  const sFile = "base-contenido.png", // source image
    sSave = `${id}_footer_${fileName.toLocaleLowerCase()}.png`; // "save as"

  console.log(id + "_footer_" + fileName.toLocaleLowerCase());

  await loadImage(sFile).then((img) => {
    const canvas = createCanvas(img.width, img.height),
      ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    function drawText(sText, fontSize = "24px", yText, aX) {
      ctx.font = `${fontSize} "Volvo Novum Medium"`;
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      let td = ctx.measureText(sText),
        tw = td.width;
      let x = Math.floor((img.naturalWidth - tw) / 2 + aX),
        y = yText;
      ctx.fillText(sText, x, y);

      return true;
    }

    async function generate() {
      // try {
      //const result = await drawText(cliente, "28px", 510, 0);
      //   console.log(`Got the result1: ${result}`);
      //if (result) {
      try {
        const result2 = await drawText(asesor, "24px", 455, 0);
        if (result2) {
          //console.log(`Got the result2: ${result2}`);
          try {
            const result3 = await drawText(dealer, "24px", 485, 0);
            if (result3) {
              //console.log(`Got the result3: ${result3}`);
              try {
                const result4 = await drawText(
                  telefono_asesor,
                  "24px",
                  548,
                  15
                );
                if (result4) {
                  //console.log(`Got the result4: ${result4}`);
                  try {
                    const result5 = await drawText(
                      mail_asesor,
                      "24px",
                      600,
                      15
                    );
                    if (result5) {
                      //console.log(`Got the result5: ${result5}`);
                    }
                  } catch (error) {
                    // failureCallback(error);
                  }
                }
              } catch (error) {
                // failureCallback(error);
              }
            }
          } catch (error) {
            // failureCallback(error);
          }
        }
      } catch (error) {
        // failureCallback(error);
      }
      //}
      // } catch (error) {
      //   //failureCallback(error);
      // }
    }

    generate();

    const out = fs.createWriteStream(sSave, {
      flags: "w",
      encoding: "utf-8",
      mode: "0755",
    });
    out.on("error", function (e) {
      console.error(e);
    });

    editUser(id, sSave);

    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => console.log("Done"));
  });

  return true;
}

getData();
