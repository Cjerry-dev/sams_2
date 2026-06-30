import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// Assuming DATABASE_URL is in your Vercel Environment Variables
const dbConfig = process.env.DATABASE_URL!;

export async function POST(request: Request) {
  const body = await request.json();
  const { role, full_name, email, password, reg_number, staff_id, rfid_uid } = body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const connection = await mysql.createConnection(dbConfig);
    
    // Start Transaction
    await connection.beginTransaction();

    try {
      // 1. Insert into users table
      const [userResult]: any = await connection.execute(
        'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
        [full_name, passwordHash, role]
      );
      const userId = userResult.insertId;

      // 2. Route to specific table
      if (role === 'student') {
        await connection.execute(
          'INSERT INTO students (full_name, student_id, user_id, rfid_uid, email) VALUES (?, ?, ?, ?, ?)',
          [full_name, reg_number, userId, rfid_uid, email]
        );
      } else {
        await connection.execute(
          'INSERT INTO staff (full_name, staff_id, role, user_id, email) VALUES (?, ?, ?, ?, ?)',
          [full_name, staff_id, role, userId, email]
        );
      }

      await connection.commit();
      await connection.end();
      
      return NextResponse.json({ success: true, message: 'Registration successful' });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
