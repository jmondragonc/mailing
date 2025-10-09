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

  let i = 0;
  const t = await setInterval(function () {
    generateImages(
      data[i].dealer,
      data[i].cliente,
      data[i].asesor,
      data[i].telefono_asesor,
      data[i].id,
      data[i].nuevo
    );
    i++;
    console.log(data.length - 1, i);
    if (data.length == i) {
      clearInterval(t);
    }
  }, 1000);

  return data;
};

async function generateImages(
  dealer,
  cliente,
  asesor,
  telefono_asesor,
  id,
  nuevo
) {
  registerFont("./VolvoBroadProDigital.ttf", {
    family: "Volvo Broad Pro Digital",
  }); // CHANGE TO YOUR OWN!

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

  const sSave = `${id}_header_${fileName.toLocaleLowerCase()}.png`;
  const baseClientesNuevos = "header_clientes_nuevos.jpg";
  const baseClientesAntiguos = "header_clientes_antiguos.jpg";
  const sFile =
    nuevo.toUpperCase() == "SI" ? baseClientesNuevos : baseClientesAntiguos;

  console.log("Procesando ", id + "_header_" + fileName.toLocaleLowerCase());

  await loadImage(sFile).then((img) => {
    const canvas = createCanvas(img.width, img.height),
      ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Function to draw text with line wrapping (only for company name)
    function drawMultilineText(
      sText,
      fontSize = "32px",
      startY = 195,
      maxWidth = img.width - 50
    ) {
      ctx.font = `${fontSize} "Volvo Broad Pro Digital"`;
      ctx.fillStyle = "rgba(255, 255, 255, 1)";

      // Check if text exceeds the maxWidth
      let td = ctx.measureText(sText);
      let tw = td.width;

      // If text fits in one line, draw it and return
      if (tw <= maxWidth) {
        let x = Math.floor((img.width - tw) / 2);
        ctx.fillText(sText, x, startY);
        return true;
      }

      // If text is too long, we need to split it with 60/40 distribution
      const words = sText.split(" ");
      const totalWords = words.length;

      // Calculate font size numeric value for line spacing
      const fontSizeValue = parseInt(fontSize);
      const lineHeight = fontSizeValue * 1.2; // 1.2 is a common line height multiplier

      // Target a 60/40 split for two lines (approximately)
      const firstLineTargetWords = Math.ceil(totalWords * 0.6);

      // Build first line with approximately 60% of words
      let firstLine = words.slice(0, firstLineTargetWords).join(" ");
      let firstLineWidth = ctx.measureText(firstLine).width;

      // If the first line is too long, reduce words until it fits
      let cutOffIndex = firstLineTargetWords;
      while (firstLineWidth > maxWidth && cutOffIndex > 1) {
        cutOffIndex--;
        firstLine = words.slice(0, cutOffIndex).join(" ");
        firstLineWidth = ctx.measureText(firstLine).width;
      }

      // Second line contains the remaining words
      let secondLine = words.slice(cutOffIndex).join(" ");

      // If second line is too long, we might need to split further
      // But for simplicity and your requirements, we'll stick to two lines
      // and just make sure they fit

      // For multiline text, move the starting position 30px lower as requested
      let adjustedStartY = startY;
      adjustedStartY += 20; // Move text 30px lower for multiline text

      // Draw the two lines centered
      const x1 = Math.floor((img.width - firstLineWidth) / 2);
      ctx.fillText(firstLine, x1, adjustedStartY - lineHeight / 2);

      const secondLineWidth = ctx.measureText(secondLine).width;
      const x2 = Math.floor((img.width - secondLineWidth) / 2);
      ctx.fillText(secondLine, x2, adjustedStartY + lineHeight / 2);

      return true;
    }

    async function generate() {
      try {
        // Only draw the company name (cliente) with potential line wrapping
        const result = await drawMultilineText(cliente, "32px", 195);
        console.log(`Company name drawn successfully: ${result}`);
      } catch (error) {
        console.error("Error drawing company name:", error);
      }
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
