import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '不正なリクエストです' }, { status: 400 });
  }

  const { id, name, action } = body;

  if (!id || !/^\d{6}$/.test(id)) {
    return NextResponse.json({ error: '無効な番号です' }, { status: 400 });
  }
  if (!name || typeof name !== 'string' || name.length === 0 || name.length > 50) {
    return NextResponse.json({ error: '無効な名前です' }, { status: 400 });
  }
  if (action !== '入室' && action !== '退室') {
    return NextResponse.json({ error: '無効なアクションです' }, { status: 400 });
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const timestamp = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[id, name, action, timestamp]],
      },
    });

    return NextResponse.json({ success: true, log: { id, name, action, timestamp } });
  } catch (error) {
    console.error('Attendance logging failed:', error);
    return NextResponse.json({ error: '記録に失敗しました' }, { status: 500 });
  }
}
