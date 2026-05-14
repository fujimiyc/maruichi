import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SHEET_NAME = '入退室一覧';

async function ensureSheet(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = meta.data.sheets?.some(
    (s) => s.properties?.title === SHEET_NAME
  );
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: SHEET_NAME },
            },
          },
        ],
      },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${SHEET_NAME}'!A1:D1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['番号', '名前', 'アクション', '日時']],
      },
    });
  }
}

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
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
    const timestamp = new Date().toISOString();

    await ensureSheet(sheets, spreadsheetId);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${SHEET_NAME}'!A:D`,
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
