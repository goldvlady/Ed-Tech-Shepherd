import ses from "node-ses";

class SESService {
  private client: ses.Client;

  constructor() {
    if (!process.env.APP_AWS_ACCESS_KEY || !process.env.APP_AWS_SECRET_KEY) {
      throw "invalid AWS access or secret key";
    }

    this.client = ses.createClient({
      key: process.env.APP_AWS_ACCESS_KEY,
      secret: process.env.APP_AWS_SECRET_KEY,
      amazon: "https://email.us-east-2.amazonaws.com",
    });
  }

  getEmailHtml(content: string) {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml"
        xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
        <!--[if gte mso 9]><xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml><![endif]-->
        <title>Shepherd Tutors</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
        <meta name="format-detection" content="telephone=no"/>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,700,700i,900,900i" rel="stylesheet" />
        <!--<![endif]-->
        <style type="text/css">
        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100% !important;
          -ms-text-size-adjust: 100% !important;
          -webkit-font-smoothing: antialiased !important;
          font-family: "Work Sans",Helvetica,Arial,sans-serif;
        }
        img {
          border: 0 !important;
          outline: none !important;
        }
        p {
          Margin: 0px !important;
          Padding: 0px !important;
        }
        table {
          border-collapse: collapse;
          mso-table-lspace: 0px;
          mso-table-rspace: 0px;
        }
        td, a, span {
          border-collapse: collapse;
          mso-line-height-rule: exactly;
        }
        .ExternalClass * {
          line-height: 100%;
        }
        @media only screen and (min-width:481px) and (max-width:649px) {
        .em_main_table {width: 100% !important;}
        .em_wrapper{width: 100% !important;}
        .em_hide{display:none !important;}
        .em_aside10{padding:0px 10px !important;}
        .em_h20{height:20px !important; font-size: 1px!important; line-height: 1px!important;}
        .em_h10{height:10px !important; font-size: 1px!important; line-height: 1px!important;}
        .em_aside5{padding:0px 10px !important;}
        .em_ptop2 { padding-top:8px !important; }
        }
        @media only screen and (min-width:375px) and (max-width:480px) {
        .em_main_table {width: 100% !important;}
        .em_wrapper{width: 100% !important;}
        .em_hide{display:none !important;}
        .em_aside10{padding:0px 10px !important;}
        .em_aside5{padding:0px 8px !important;}
        .em_h20{height:20px !important; font-size: 1px!important; line-height: 1px!important;}
        .em_h10{height:10px !important; font-size: 1px!important; line-height: 1px!important;}
        .em_font_11 {font-size: 12px !important;}
        .em_font_22 {font-size: 22px !important; line-height:25px !important;}
        .em_w5 { width:7px !important; }
        .em_w150 { width:150px !important; height:auto !important; }
        .em_ptop2 { padding-top:8px !important; }
        u + .em_body .em_full_wrap { width:100% !important; width:100vw !important;}
        }
        @media only screen and (max-width:374px) {
        .em_main_table {width: 100% !important;}
        .em_wrapper{width: 100% !important;}
        .em_hide{display:none !important;}
        .em_aside10{padding:0px 10px !important;}
        .em_aside5{padding:0px 8px !important;}
        .em_h20{height:20px !important; font-size: 1px!important; line-height: 1px!important;}
        .em_h10{height:10px !important; font-size: 1px!important; line-height: 1px!important;}
        .em_font_11 {font-size: 11px !important;}
        .em_font_22 {font-size: 22px !important; line-height:25px !important;}
        .em_w5 { width:5px !important; }
        .em_w150 { width:150px !important; height:auto !important; }
        .em_ptop2 { padding-top:8px !important; }
        u + .em_body .em_full_wrap { width:100% !important; width:100vw !important;}
        }
        </style>
        
        </head>
        <body class="em_body" style="margin:0px auto; padding:0px;" bgcolor="#FFF">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center"  bgcolor="#FFF">
            <tr>
              <td align="center" valign="top"><table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed;">
                  <tr>
                    <td align="center" valign="top" style="padding:0 25px;" class="em_aside10"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        <td height="25" style="height:25px;" class="em_h20">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="center" valign="top"><a href="https://shepherdtutors.com" target="_blank" style="text-decoration:none;"><img src="https://shepherd-tutors.netlify.app/images/logo-black.png" height="40" alt="logo" border="0" style="display:block; font-family:Arial, sans-serif; font-size:18px; line-height:25px; text-align:center; color:#1d4685; font-weight:bold; max-width:208px;" class="em_w150" /></a></td>
                      </tr>
                      <tr>
                        <td height="28" style="height:28px;" class="em_h20">&nbsp;</td>
                      </tr>
                    </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
        </table>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#FFF">
          <tr>
            <td align="center" valign="top" class="em_aside5"><table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed;">
                <tr>
                  <td valign="top" style="padding:25px; background-color:#ffffff;" class="em_aside10">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">${content}</table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#FFF">
            <tr>
              <td align="center" valign="top"><table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed;">
                  <tr>
                    <td align="center" valign="top" style="padding:0 25px;" class="em_aside10"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        <td height="40" style="height:40px;" class="em_h20">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="center" valign="top">
                         </td>
                      </tr>
                      <tr>
                        <td height="16" style="height:16px; font-size:1px; line-height:1px; height:16px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td class="em_grey" align="center" valign="top" style="font-family: Arial, sans-serif; font-size: 15px; line-height: 18px; color:#434343; font-weight:bold;">Problems or questions?</td>
                      </tr>
                      <tr>
                        <td height="10" style="height:10px; font-size:1px; line-height:1px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="center" valign="top" style="font-size:0px; line-height:0px;"><table border="0" cellspacing="0" cellpadding="0" align="center">
                          <tr>
                            <td width="9" style="width:9px; font-size:0px; line-height:0px;" class="em_w5"><img src="/assets/pilot/images/templates/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;" /></td>
                            <td class="em_grey em_font_11" align="left" valign="middle" style="font-family: Arial, sans-serif; font-size: 13px; line-height: 15px; color:#434343;"><a href="mailto:hello@shepherdtutors.com" style="text-decoration:none; color:#434343;">hello@shepherdtutors.com</a></td>
                          </tr>
                        </table>
                        </td>
                      </tr>
                       <tr>
                        <td height="9" style="font-size:0px; line-height:0px; height:9px;" class="em_h10"><img src="/assets/pilot/images/templates/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;" /></td>
                      </tr>
                       <tr>
                        <td align="center" valign="top"><table border="0" cellspacing="0" cellpadding="0" align="center">
                          <tr>
                            <td width="12" align="left" valign="middle" style="font-size:0px; line-height:0px; width:12px;"></td>
                            <td width="7" style="width:7px; font-size:0px; line-height:0px;" class="em_w5">&nbsp;</td>
                            <td class="em_grey em_font_11" align="left" valign="middle" style="font-family: Arial, sans-serif; font-size: 13px; line-height: 15px; color:#434343;"><a href="#" target="_blank" style="text-decoration:none; color:#434343;">Shepherd Tutors</a></td>
                          </tr>
                        </table>
                        </td>
                      </tr>
                      <tr>
                        <td height="35" style="height:35px;" class="em_h20">&nbsp;</td>
                      </tr>
                    </table>
                    </td>
                  </tr>
                   <tr>
                    <td height="1" bgcolor="#dadada" style="font-size:0px; line-height:0px; height:1px;"><img src="/assets/pilot/images/templates/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;" /></td>
                  </tr>
                   <tr>
                    <td align="center" valign="top" style="padding:0 25px;" class="em_aside10"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        <td height="16" style="font-size:0px; line-height:0px; height:16px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="center" valign="top"><table border="0" cellspacing="0" cellpadding="0" align="left" class="em_wrapper">
                          <tr>
                            <td class="em_grey" align="center" valign="middle" style="font-family: Arial, sans-serif; font-size: 11px; line-height: 16px; color:#434343;">&copy; Shepherd Tutors 2023</td>
                          </tr>
                        </table>
                        </td>
                      </tr>
                      <tr>
                        <td height="16" style="font-size:0px; line-height:0px; height:16px;">&nbsp;</td>
                      </tr>
                    </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
        </table>
        </body>
        </html>`;
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    tags: string[] = [],
    from = "hello@shepherdtutors.com"
  ) {
    let rlve, rject;

    const promiseResponse = new Promise((resolve, reject) => {
      rlve = resolve;
      rject = reject;
    });

    this.client.sendEmail(
      {
        to,
        from: `Shepherd Tutors <${from}>`,
        bcc: ["shepherd@pipedrivemail.com"],
        subject,
        message: this.getEmailHtml(html),
        replyTo: "hello@shepherdtutors.com",
      },
      function (err, _, res) {
        if (!err) {
          rlve(res);
        } else {
          rject(err);
        }
      }
    );

    return promiseResponse;
  }
}

export default SESService;
