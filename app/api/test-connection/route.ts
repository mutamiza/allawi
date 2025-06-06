import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

type RequestBody = {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
};

export async function POST(request: Request) {
  try {
    const { host, port, user, password, database } = (await request.json()) as RequestBody;

    const connection = await mysql.createConnection({
      host,
      port: Number(port),
      user,
      password,
      database,
    });

    await connection.execute('SELECT 1');
    await connection.end();

    return NextResponse.json({ success: true, message: 'تم الاتصال بنجاح.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'خطأ غير محدد' });
  }
}
