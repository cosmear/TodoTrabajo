import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    // Check Auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }
    const userId = decoded.id;

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('cv') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Ningún archivo enviado' }, { status: 400 });
    }

    // Validate type (PDF or Word)
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
       return NextResponse.json({ success: false, error: 'Formato no válido. Sube PDF o Word.' }, { status: 400 });
    }

    // Prepare bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads/cvs
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'cvs');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      // ignore if exists
    }

    const fileExt = file.name.split('.').pop();
    const uniqueName = `cv_${userId}_${Date.now()}.${fileExt}`;
    const filePath = join(uploadsDir, uniqueName);
    
    await writeFile(filePath, buffer);

    const cvUrl = `/uploads/cvs/${uniqueName}`;

    // Update User DB
    const connection = await pool.getConnection();
    try {
      await connection.query(
        `UPDATE users SET cv_url = ? WHERE id = ?`,
        [cvUrl, userId]
      );
    } finally {
      connection.release();
    }

    return NextResponse.json({ success: true, cv_url: cvUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
