const nodemailer = require ('nodemailer') // thư viện gửi email
const asyncHandler = require('express-async-handler')

const sendEmail = asyncHandler(async (req, res) => {
    //kết nối với tài khoản Gmail
    const transporter = nodemailer.createTransport({ // Đối tượng transporter được cấu hình để sử dụng giao thức SMTP để gửi email thông qua Gmail
        // các thông số cấu hình
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD
        }
    })
    const data = req.body;

    const info = await transporter.sendMail({
        form: '"Hey" <qwe@gmail.com>', //địa chỉ email nguồn
        to: data.to, //địa chỉ gửi đến
        subject: data.subject, //tiêu đề
        text: data.text, // nội dung
        hmtl: data.hmtl,
    })
    console.log('Message sent: %s', info.messageId) //in thông báo đã gửi và kèm "id" của tin nhắn
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)) //trả về URL xem trước tin nhắn trong quá trình kiểm tra.

    res.json({ success: true });
})

module.exports = {sendEmail}