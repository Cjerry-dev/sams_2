import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const reg_number = formData.get('reg_number') as string;
    const rfid_uid = formData.get('rfid_uid') as string;

    // 1. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Connect to TiDB
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    // 3. Start Transaction (same logic as your PHP process_register.php)
    await connection.beginTransaction();

    try {
      // Insert User
      const [userResult]: any = await connection.execute(
        'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
        [full_name, hashedPassword, role]
      );
      const userId = userResult.insertId;

      // Insert Student
      await connection.execute(
        'INSERT INTO students (full_name, student_id, user_id, rfid_uid, email) VALUES (?, ?, ?, ?, ?)',
        [full_name, reg_number, userId, rfid_uid, email]
      );

      await connection.commit();
      await connection.end();

      return NextResponse.json({ success: true });
    } catch (dbError) {
      await connection.rollback();
      throw dbError;
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
