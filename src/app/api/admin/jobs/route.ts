import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(`SELECT tipo_cuenta FROM users WHERE id = ?`, [decoded.id]);
    connection.release();
    if (rows.length > 0 && rows[0].tipo_cuenta === 'admin') return true;
    return false;
  } catch(e) { return false; }
}

export async function GET(request: Request) {
  if (!(await verifyAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const connection = await pool.getConnection();
  try {
    const [jobs]: any = await connection.query(
      `SELECT j.id, j.posicion, j.empresa, j.is_active, j.created_at, u.email as publisher_email
       FROM job_postings j
       JOIN users u ON j.user_id = u.id
       ORDER BY j.created_at DESC`
    );
    return NextResponse.json({ success: true, jobs });
  } finally {
    connection.release();
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const data = await request.json();
  const { jobId, is_active } = data;

  const connection = await pool.getConnection();
  try {
    await connection.query(
      `UPDATE job_postings SET is_active = ? WHERE id = ?`,
      [is_active ? 1 : 0, jobId]
    );
    return NextResponse.json({ success: true, message: 'Job visibility updated' });
  } finally {
    connection.release();
  }
}
