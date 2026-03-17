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
    
    if (rows.length > 0 && rows[0].tipo_cuenta === 'admin') {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export async function GET(request: Request) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

  const connection = await pool.getConnection();
  try {
    const [candRows]: any = await connection.query(`SELECT COUNT(*) as total FROM users WHERE tipo_cuenta = 'candidato'`);
    const [compRows]: any = await connection.query(`SELECT COUNT(*) as total FROM users WHERE tipo_cuenta = 'empresa'`);
    const [jobsRows]: any = await connection.query(`SELECT COUNT(*) as total FROM job_postings`);
    const [appsRows]: any = await connection.query(`SELECT COUNT(*) as total FROM applications`);

    const stats = {
       candidates: candRows[0].total,
       companies: compRows[0].total,
       jobs: jobsRows[0].total,
       applications: appsRows[0].total
    };
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
