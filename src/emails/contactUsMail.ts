import dayjs from "dayjs";

type Props = {
  fullName: string;
  email: string;
  message: string;
  date: Date;
};

export const emailTemplateCreator = ({ fullName, email, message, date }: Props) => `
<table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
  <tr>
    <td align="center" style="padding:0;">
      <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
        <tr>
          <td align="center" style="padding:15px 0 0;background:#0A192F;">
            <img src="https://hassanali.tk/logo-secondary.svg" alt="" width="70" style="height:auto;display:block;margin-top:5px" />
            <h2 style="font-family:'Google Sans', 'sans-serif';color: #56dfff;margin-top:5px">Hassan Ali</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:75px 45px;">
            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
              <tr>
                <td style="color:#153643;">
                  <h1 style="font-size:24px;margin:0 0 20px 0;font-family:'Google Sans', 'sans-serif';direction:ltr">New Message From Contact Us Form</h1>
                  <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:'Google Sans', 'sans-serif';direction:ltr">Hi Hassan, There is a new message from contact us form sent to you, check out the message :</p>
                  <hr />
                  <p style="margin: 15px 0 0;font-size:16px;line-height:24px;font-family:'Google Sans', 'sans-serif';">
                    <p style="margin:0;margin-bottom:10px;font-size:16px;font-family:'Google Sans','sans-serif';"><b>From: </b> <span style="padding-left: 10px;">${fullName} &nbsp; - &nbsp; ${email}</span></p>
                    <p style="margin:0;margin-bottom:10px;font-size:16px;font-family:'Google Sans','sans-serif';"><b>Message: </b> <span style="padding: 15px;border: 1px solid #ccc;display: block;border-radius: 5px;margin-top: 7px;">${message}</span></p>
                    <p style="margin:10px 5px 0;font-size:16px;font-family:'Google Sans','sans-serif';">${dayjs(date).format('DD/MM/YYYY  |  hh:mm a')}</p>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:30px;background:#0A192F;">
            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:'Google Sans', 'sans-serif';direction:ltr">
              <tr>
                <td style="padding:0;width:50%;" align="left">
                  <p style="margin:0;font-size:14px;line-height:16px;font-family:'Google Sans', 'sans-serif';color:#56dfff;direction:ltr">
                    Hassan Ali - Portfolio ${new Date().getFullYear()}
                  </p>
                </td>
                <td style="padding:0;width:50%;" align="right">
                  <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                    <tr>
                      <td style="padding:0 0 0 10px;width:38px;direction:ltr">
                        <a href="http://admin.hassanali.tk/contact" style="color:#ffffff;"><img src="https://hassanali.tk/logo-secondary.svg" alt="Logo" width="38" style="height:auto;display:block;border:0;" /></a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;