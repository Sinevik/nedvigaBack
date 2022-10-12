const nodemailer = require('nodemailer');

const email = {
  chooseHtml(purpose, verificationLink) {
    let result;
    switch (purpose) {
      case 'signUp':
        result = `
          <table style="width: 100%;">
            <tr style="width: 100%;">
                <td>
                    <img src="https://res.cloudinary.com/working-by-estate/image/upload/v1658099836/workingByEstate/nedviga_w2jeoo.png">
                </td>
                <td>nedviga.by</td>
            </tr>
            <tr style="width: 100%;">
                <td style="padding: 10px 0px 10px 0px">Для регистрации перейдите по ссылке</td>
            </tr>
            <tr style="width: 100%;">
                <td style="padding: 10px 0px 10px 0px; word-break: break-all">
                    <a href=${verificationLink}>${verificationLink}</a>
                </td>
            </tr>
            </table>
        `;
        break;
      case 'resetPassword':
        result = `
          <table style="width: 100%;">
            <tr style="width: 100%;">
                <td>
                    <img src="https://res.cloudinary.com/working-by-estate/image/upload/v1658099836/workingByEstate/nedviga_w2jeoo.png">
                </td>
                <td>nedviga.by</td>
            </tr>
            <tr style="width: 100%;">
                <td style="padding: 10px 0px 10px 0px">Для сброса пароля перейдите по ссылке</td>
            </tr>
            <tr style="width: 100%;">
                <td style="padding: 10px 0px 10px 0px; word-break: break-all">
                    <a href=${verificationLink}>${verificationLink}</a>
                </td>
            </tr>
            </table>
        `;
        break;
      default:
        result = null;
    }
    return result;
  },

  chooseSubject(purpose) {
    let result;
    switch (purpose) {
      case 'signUp':
        result = 'Регистрация';
        break;
      case 'resetPassword':
        result = 'Сброс пароля';
        break;
      default:
        result = null;
    }
    return result;
  },

  async sendEmail({
    token,
    userEmail,
    purpose,
    req,
  }) {
    const uri = `${req.get('origin')}`;
    const verificationLink = `${uri}/${purpose}/${token}`;
    const transporter = nodemailer.createTransport({
      host: 'mailbe05.hoster.by',
      port: 465,
      secure: true,
      auth: {
        user: 'auth@nedviga.by',
        pass: 'T&xzsS~50K',
      },
    });

    const result = await transporter.sendMail({
      from: '"Nedviga.by" <auth@nedviga.by>',
      to: userEmail,
      subject: this.chooseSubject(purpose),
      text: 'This message was sent from Node js server.',
      html: this.chooseHtml(purpose, verificationLink),
    });
  },
};

email.sendEmail = email.sendEmail.bind(email);
email.chooseSubject = email.chooseSubject.bind(email);

module.exports = email;
