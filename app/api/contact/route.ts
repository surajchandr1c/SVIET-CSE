import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export  async function POST(req: Request) {
  try{
    const { name, asmission_no
, email, message } = await req.json()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Form Submission",
      html: `
      <h2>New Message From Student </h2>
      <p><strong>Name: </strong> ${name}</p>
      <p><strong>admission_no: </strong> ${asmission_no}</p>
      <p><strong>email: </strong> ${email}</p>
      <p><strong>message: </strong> ${message}</p>
      `,
    })

    return NextResponse.json({ success: true})
  } catch (error) {
    console.error("MAIL ERROR:", error);
    return NextResponse.json({ success: false });
  }
}
