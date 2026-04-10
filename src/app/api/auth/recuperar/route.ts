import { NextResponse } from 'next/server';
import crypto from 'crypto';
import pool from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ success: false, error: 'Email requerido' }, { status: 400 });

    const connection = await pool.getConnection();
    try {
      // 1. Check if user exists
      const [rows]: any = await connection.query(`SELECT id, nombre_completo, is_active FROM users WHERE email = ?`, [email]);
      if (rows.length === 0) {
        // Return success anyway to prevent email enumeration
        return NextResponse.json({ success: true, message: 'Si el correo existe, recibirás instrucciones enviadas a tu casilla.' });
      }

      const user = rows[0];
      if (!user.is_active) {
         return NextResponse.json({ success: false, error: 'Tu cuenta ha sido suspendida.' }, { status: 403 });
      }

      // 2. Generate token
      const resetToken = crypto.randomBytes(32).toString('hex');

      // 3. Save to DB
      await connection.query(
        `UPDATE users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?`,
        [resetToken, user.id]
      );

      // 4. Send Email
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com', // Generic default
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
           user: process.env.SMTP_USER,
           pass: process.env.SMTP_PASS
        }
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

      try {
        await transporter.sendMail({
          from: `"TodoTrabajo" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Recuperar Contraseña - TodoTrabajo',
          html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #13C8EC;">Solicitud de Recuperación de Contraseña</h2>
              <p>Hola ${user.nombre_completo},</p>
              <p>Hemos recibido una solicitud para restablecer tu contraseña en TodoTrabajo. Si no fuiste tú, puedes ignorar este correo.</p>
              <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #13C8EC; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Restablecer mi contraseña</a>
              </div>
              <p>Este enlace es válido por 1 hora.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #888;">El equipo de TodoTrabajo</p>
            </div>
          `
        });
      } catch (mailError) {
         console.error("Error sending mail:", mailError);
         // Fallback if SMTP is not configured, we still print token for dev
         console.log(`[DEV MODE] Reset URL for ${email}: ${resetUrl}`);
      }

      return NextResponse.json({ success: true, message: 'Instrucciones enviadas.' });

    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
