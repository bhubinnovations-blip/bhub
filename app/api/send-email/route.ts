"use server"

import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {


    const resend = new Resend(process.env.RESEND_API_KEY);

    try {

        const { to, subject, html } = await req.json();
        const email = {
            from: 'BHub <admin@bhubcare.com>',
            to: [to],
            subject: subject,
            html: html
        }

        const response = await resend.emails.send(email);

        console.log(response);

        return NextResponse.json({ success: true, response });

    } catch (error: any) {
        console.error("Error sending email:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

}