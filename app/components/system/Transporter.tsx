import nodemailer from 'nodemailer';

export default function mailTransporter() {
const transporter = nodemailer.createTransport({
    host: 'az1-ss26.a2hosting.com',
    port: 465,
    secure: true,
    auth: {
        user: 'test@searcywater.org',
        pass: '300NElm!',
    }
});
return transporter;
}