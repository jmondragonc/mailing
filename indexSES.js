const nodemailer = require("nodemailer");
const mandrillTransport = require("nodemailer-mandrill-transport");
const mysql = require("mysql2/promise");
const moment = require("moment");
const { sendMail } = require("./helpers/amazonSES");

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

const smtpTransport = nodemailer.createTransport(
  mandrillTransport({
    auth: {
      apiKey: "md-Oqqn2lOZ5LlIq-6LiYqo8A",
    },
  })
);

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

const getData = async () => {
  const data = await getUsers();
  data.map((item, i) => {
    if (item.nuevo == "SI" && i == 0) {
      let foto = "";
      if (item.foto != null && item.foto != "") {
        foto = `https://juntosmovemoselmundo.pe/mailing/volvo/2025/10/fotos/${item.foto}`;
      } else {
        foto = "https://juntosmovemoselmundo.pe/mailing/2024/portada_nuevo.jpg";
      }
      console.log("1", item.mail_asesor);
      let mailOptions = {
        from: "no-reply@juntosmovemoselmundo.pe",
        to: "no-reply@juntosmovemoselmundo.pe",
        replyTo: `${item.mail_asesor}`,
        subject:
          "[Volvo Group Peru] ¡Te damos la bienvenida a nuestra gran familia!",
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!DOCTYPE html>
        <!--Quite a few clients strip your Doctype out, and some even apply their own. Many clients do honor your doctype and it can make things much easier if you can validate constantly against a Doctype.-->
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="color-scheme" content="light only" />
            <meta name="supported-color-schemes" content="light" />
            <title></title>
        
            <!-- Please use an inliner tool to convert all CSS to inline as inpage or external CSS is removed by email clients -->
            <!-- important in CSS is used to prevent the styles of currently inline CSS from overriding the ones mentioned in media queries when corresponding screen sizes are encountered -->
        
            <style type="text/css">
              body {
                margin: 0;
              }
              body,
              table,
              td,
              p,
              a,
              li,
              blockquote {
                -webkit-text-size-adjust: none !important;
                font-family: sans-serif;
                font-style: normal;
                font-weight: 400;
              }
              button {
                width: 90%;
              }
        
              @media screen and (max-width: 600px) {
                /*styling for objects with screen size less than 600px; */
                body,
                table,
                td,
                p,
                a,
                li,
                blockquote {
                  -webkit-text-size-adjust: none !important;
                  font-family: sans-serif;
                }
                table {
                  /* All tables are 100% width */
                  width: 100%;
                }
                .footer {
                  /* Footer has 2 columns each of 48% width */
                  height: auto !important;
                  max-width: 48% !important;
                  width: 48% !important;
                }
                table.responsiveImage {
                  /* Container for images in catalog */
                  height: auto !important;
                  max-width: 30% !important;
                  width: 30% !important;
                }
                table.responsiveContent {
                  /* Content that accompanies the content in the catalog */
                  height: auto !important;
                  max-width: 66% !important;
                  width: 66% !important;
                }
                .top {
                  /* Each Columnar table in the header */
                  height: auto !important;
                  max-width: 48% !important;
                  width: 48% !important;
                }
                .catalog {
                  margin-left: 0% !important;
                }
              }
        
              @media screen and (max-width: 480px) {
                /*styling for objects with screen size less than 480px; */
                body,
                table,
                td,
                p,
                a,
                li,
                blockquote {
                  -webkit-text-size-adjust: none !important;
                  font-family: sans-serif;
                }
                table {
                  /* All tables are 100% width */
                  width: 100% !important;
                  border-style: none !important;
                }
                .footer {
                  /* Each footer column in this case should occupy 96% width  and 4% is allowed for email client padding*/
                  height: auto !important;
                  max-width: 96% !important;
                  width: 96% !important;
                }
                .table.responsiveImage {
                  /* Container for each image now specifying full width */
                  height: auto !important;
                  max-width: 96% !important;
                  width: 96% !important;
                }
                .table.responsiveContent {
                  /* Content in catalog  occupying full width of cell */
                  height: auto !important;
                  max-width: 96% !important;
                  width: 96% !important;
                }
                .top {
                  /* Header columns occupying full width */
                  height: auto !important;
                  max-width: 100% !important;
                  width: 100% !important;
                }
                .catalog {
                  margin-left: 0% !important;
                }
                button {
                  width: 90% !important;
                }
              }
            </style>
          </head>
          <body yahoo="yahoo">
            <table width="100%" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td>
                    <table
                      width="750"
                      border="0"
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <span style="font-size: 0; line-height: 0"
                              ><img
                                src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/10/${item.header}"
                                width="750"
                                height="296"
                                alt=""
                                style="display: block"
                            /></span>
                          </td>
                        </tr>
                        <tr>
                          <td height="">
                            <table width="750" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="88"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/left.png" width="89" height="438" alt="" style="display: block;"/></td>
              <td><img src="${foto}" width="575" height="439" alt="" style="display: block;"/></td>
              <td width="87"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/right.png" width="87" height="439" alt="" style="display: block;"/></td>
            </tr>
          </tbody>
        </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/10/${item.footer}"
                              width="750"
                              height="716"
                              alt=""
                              style="display: block"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td><img
                                src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/volar.png"
                                width="750"
                                height="103"
                                alt=""
                                style="display: block; border: 0"
                            /></td>
                        </tr>
                        <tr>
                          <td>
                            <a
                              href="https://www.volvotrucks.pe/content/dam/volvo-trucks/markets/peru/Volvo%20-%20contacto%20de%20concesionarios.pdf"
                              style="display: block; text-decoration: none; border: 0"
                              ><img
                                src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/btn.png"
                                width="750"
                                height="139"
                                alt=""
                                style="display: block; border: 0"
                            /></a>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="font-size: 0; line-height: 0; background: #ffffff"
                            height="10"
                          ><table width="750" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td width="182" height="70"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/left2.png" width="182" height="70" style="display: block;" alt=""/></td>
                                <td width="46"><a href="https://www.facebook.com/VolvoGroupPeru/"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/fb.png" width="46" height="70" alt="" style="display: block;" /></a></td>
                                <td width="61"><a href="https://www.linkedin.com/company/volvogroupperu/"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/lin.png" width="61" height="70" alt="" style="display: block;"/></a></td>
                                <td width="51"><a href="https://www.instagram.com/volvogroupperu/"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/ins.png" width="51" height="70" alt="" style="display: block;"/></a></td>
                                <td width="70"><a href="https://www.youtube.com/user/VolvoCamionesPeru"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/yt.png" width="70" height="70" alt="" style="display: block;"/></a></td>
                                <td width="158"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/web.png" width="158" height="70" alt="" style="display: block;"/></td>
                                <td width="182"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/right2.png" width="182" height="70" alt="" style="display: block;"/></td>
                              </tr>
                            </tbody>
                          </table></td>
                        </tr>
                        <tr>
                          <td>
                            <span
                              style="font-size: 0; line-height: 0; background: #ffffff"
                              ><img
                                src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/copyright.png"
                                width="750"
                                height="99"
                                alt=""
                                style="display: block"
                            /></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <center>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                id="canspamBarWrapper"
                style="background-color: #ffffff; border-top: 1px solid #e5e5e5"
              >
                <tr>
                  <td
                    align="center"
                    valign="top"
                    style="padding-top: 20px; padding-bottom: 20px"
                  >
                    <table border="0" cellpadding="0" cellspacing="0" id="canspamBar">
                      <tr>
                        <td
                          align="center"
                          valign="top"
                          style="
                            color: #606060;
                            font-family: Helvetica, Arial, sans-serif;
                            font-size: 11px;
                            line-height: 150%;
                            padding-right: 20px;
                            padding-bottom: 5px;
                            padding-left: 20px;
                            text-align: center;
                          "
                        >
                          This email was sent to
                          <a
                            href="mailto:*|EMAIL|*"
                            target="_blank"
                            style="color: #404040 !important"
                            >*|EMAIL|*</a
                          >
                          <br />
                          <a
                            href="*|ABOUT_LIST|*"
                            target="_blank"
                            style="color: #404040 !important"
                            ><em>why did I get this?</em></a
                          >&nbsp;&nbsp;&nbsp;&nbsp;<a
                            href="*|UNSUB|*"
                            style="color: #404040 !important"
                            >unsubscribe from this list</a
                          >&nbsp;&nbsp;&nbsp;&nbsp;<a
                            href="*|UPDATE_PROFILE|*"
                            style="color: #404040 !important"
                            >update subscription preferences</a
                          >
                          <br />
                          *|LIST:ADDRESSLINE|*
                          <br />
                          <br />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <style type="text/css">
                @media only screen and (max-width: 480px) {
                  table#canspamBar td {
                    font-size: 14px !important;
                  }
                  table#canspamBar td a {
                    display: block !important;
                    margin-top: 10px !important;
                  }
                }
              </style>
            </center>
          </body>
        </html>
        `,
      };

      // Sending email.
      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          throw new Error("Error in sending email");
        }
        console.log("Message sent: " + JSON.stringify(response));
      });

      //End sending mail.
    } else {
      //console.log("cliente", item.cliente, i);
      if (i == 1) {
        console.log("cliente", item.cliente);
        let foto = "";
        if (item.foto != null && item.foto != "") {
          foto = `https://juntosmovemoselmundo.pe/mailing/volvo/2025/10/fotos/${item.foto}`;
        } else {
          foto =
            "https://juntosmovemoselmundo.pe/mailing/2025/portada_nuevo.jpg";
        }
        console.log("2", item.mail_asesor);
        let mailOptions = {
          from: "no-reply@juntosmovemoselmundo.pe",
          to: "no-reply@juntosmovemoselmundo.pe",
          replyTo: `${item.mail_asesor}`,
          subject:
            "[Volvo Group Peru] ¡Gracias por seguir confiando en nosotros!",
          html: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!DOCTYPE html>
        <!--Quite a few clients strip your Doctype out, and some even apply their own. Many clients do honor your doctype and it can make things much easier if you can validate constantly against a Doctype.-->
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="color-scheme" content="light only" />
            <meta name="supported-color-schemes" content="light" />
            <title></title>
        
            <!-- Please use an inliner tool to convert all CSS to inline as inpage or external CSS is removed by email clients -->
            <!-- important in CSS is used to prevent the styles of currently inline CSS from overriding the ones mentioned in media queries when corresponding screen sizes are encountered -->
        
            <style type="text/css">
              body {
                margin: 0;
              }
              body,
              table,
              td,
              p,
              a,
              li,
              blockquote {
                -webkit-text-size-adjust: none !important;
                font-family: sans-serif;
                font-style: normal;
                font-weight: 400;
              }
              button {
                width: 90%;
              }
        
              @media screen and (max-width: 600px) {
                /*styling for objects with screen size less than 600px; */
                body,
                table,
                td,
                p,
                a,
                li,
                blockquote {
                  -webkit-text-size-adjust: none !important;
                  font-family: sans-serif;
                }
                table {
                  /* All tables are 100% width */
                  width: 100%;
                }
                .footer {
                  /* Footer has 2 columns each of 48% width */
                  height: auto !important;
                  max-width: 48% !important;
                  width: 48% !important;
                }
                table.responsiveImage {
                  /* Container for images in catalog */
                  height: auto !important;
                  max-width: 30% !important;
                  width: 30% !important;
                }
                table.responsiveContent {
                  /* Content that accompanies the content in the catalog */
                  height: auto !important;
                  max-width: 66% !important;
                  width: 66% !important;
                }
                .top {
                  /* Each Columnar table in the header */
                  height: auto !important;
                  max-width: 48% !important;
                  width: 48% !important;
                }
                .catalog {
                  margin-left: 0% !important;
                }
              }
        
              @media screen and (max-width: 480px) {
                /*styling for objects with screen size less than 480px; */
                body,
                table,
                td,
                p,
                a,
                li,
                blockquote {
                  -webkit-text-size-adjust: none !important;
                  font-family: sans-serif;
                }
                table {
                  /* All tables are 100% width */
                  width: 100% !important;
                  border-style: none !important;
                }
                .footer {
                  /* Each footer column in this case should occupy 96% width  and 4% is allowed for email client padding*/
                  height: auto !important;
                  max-width: 96% !important;
                  width: 96% !important;
                }
                .table.responsiveImage {
                  /* Container for each image now specifying full width */
                  height: auto !important;
                  max-width: 96% !important;
                  width: 96% !important;
                }
                .table.responsiveContent {
                  /* Content in catalog  occupying full width of cell */
                  height: auto !important;
                  max-width: 96% !important;
                  width: 96% !important;
                }
                .top {
                  /* Header columns occupying full width */
                  height: auto !important;
                  max-width: 100% !important;
                  width: 100% !important;
                }
                .catalog {
                  margin-left: 0% !important;
                }
                button {
                  width: 90% !important;
                }
              }
            </style>
          </head>
          <body yahoo="yahoo">
            <table width="100%" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td>
                    <table
                      width="750"
                      border="0"
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <span style="font-size: 0; line-height: 0"
                              ><img
                                src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/10/${item.header}"
                                width="750"
                                height="296"
                                alt=""
                                style="display: block"
                            /></span>
                          </td>
                        </tr>
                        <tr>
                          <td height="">
                            <table width="750" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="88"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/left.png" width="89" height="438" alt="" style="display: block;"/></td>
              <td><img src="${foto}" width="575" height="439" alt="" style="display: block;"/></td>
              <td width="87"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/right.png" width="87" height="439" alt="" style="display: block;"/></td>
            </tr>
          </tbody>
        </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/10/${item.footer}"
                              width="750"
                              height="716"
                              alt=""
                              style="display: block"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td><img
                                src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/volar.png"
                                width="750"
                                height="103"
                                alt=""
                                style="display: block; border: 0"
                            /></td>
                        </tr>
                        <tr>
                          <td>
                            <a
                              href="https://www.volvotrucks.pe/content/dam/volvo-trucks/markets/peru/Volvo%20-%20contacto%20de%20concesionarios.pdf"
                              style="display: block; text-decoration: none; border: 0"
                              ><img
                                src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/btn.png"
                                width="750"
                                height="139"
                                alt=""
                                style="display: block; border: 0"
                            /></a>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="font-size: 0; line-height: 0; background: #ffffff"
                            height="10"
                          ><table width="750" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td width="182" height="70"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/left2.png" width="182" height="70" style="display: block;" alt=""/></td>
                                <td width="46"><a href="https://www.facebook.com/VolvoGroupPeru/"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/fb.png" width="46" height="70" alt="" style="display: block;" /></a></td>
                                <td width="61"><a href="https://www.linkedin.com/company/volvogroupperu/"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/lin.png" width="61" height="70" alt="" style="display: block;"/></a></td>
                                <td width="51"><a href="https://www.instagram.com/volvogroupperu/"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/ins.png" width="51" height="70" alt="" style="display: block;"/></a></td>
                                <td width="70"><a href="https://www.youtube.com/user/VolvoCamionesPeru"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/yt.png" width="70" height="70" alt="" style="display: block;"/></a></td>
                                <td width="158"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/web.png" width="158" height="70" alt="" style="display: block;"/></td>
                                <td width="182"><img src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/right2.png" width="182" height="70" alt="" style="display: block;"/></td>
                              </tr>
                            </tbody>
                          </table></td>
                        </tr>
                        <tr>
                          <td>
                            <span
                              style="font-size: 0; line-height: 0; background: #ffffff"
                              ><img
                                src="https://juntosmovemoselmundo.pe/mailing/volvo/2025/copyright.png"
                                width="750"
                                height="99"
                                alt=""
                                style="display: block"
                            /></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <center>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                id="canspamBarWrapper"
                style="background-color: #ffffff; border-top: 1px solid #e5e5e5"
              >
                <tr>
                  <td
                    align="center"
                    valign="top"
                    style="padding-top: 20px; padding-bottom: 20px"
                  >
                    <table border="0" cellpadding="0" cellspacing="0" id="canspamBar">
                      <tr>
                        <td
                          align="center"
                          valign="top"
                          style="
                            color: #606060;
                            font-family: Helvetica, Arial, sans-serif;
                            font-size: 11px;
                            line-height: 150%;
                            padding-right: 20px;
                            padding-bottom: 5px;
                            padding-left: 20px;
                            text-align: center;
                          "
                        >
                          This email was sent to
                          <a
                            href="mailto:*|EMAIL|*"
                            target="_blank"
                            style="color: #404040 !important"
                            >*|EMAIL|*</a
                          >
                          <br />
                          <a
                            href="*|ABOUT_LIST|*"
                            target="_blank"
                            style="color: #404040 !important"
                            ><em>why did I get this?</em></a
                          >&nbsp;&nbsp;&nbsp;&nbsp;<a
                            href="*|UNSUB|*"
                            style="color: #404040 !important"
                            >unsubscribe from this list</a
                          >&nbsp;&nbsp;&nbsp;&nbsp;<a
                            href="*|UPDATE_PROFILE|*"
                            style="color: #404040 !important"
                            >update subscription preferences</a
                          >
                          <br />
                          *|LIST:ADDRESSLINE|*
                          <br />
                          <br />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <style type="text/css">
                @media only screen and (max-width: 480px) {
                  table#canspamBar td {
                    font-size: 14px !important;
                  }
                  table#canspamBar td a {
                    display: block !important;
                    margin-top: 10px !important;
                  }
                }
              </style>
            </center>
          </body>
        </html>`,
        };

        // Sending email.
        smtpTransport.sendMail(mailOptions, function (error, response) {
          if (error) {
            throw new Error("Error in sending email");
          }
          console.log("Message sent: " + JSON.stringify(response));
        });

        //End sending mail.
      }
    }

    return item;
  });
  return data;
};

getData();
