import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, name, action } = body;

  if (!id || !name || !action) {
    return NextResponse.json({ error: 'パラメータが不足しています' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'data', 'attendance.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const log = {
    id,
    name,
    action,
    timestamp: new Date().toISOString(),
  };

  data.logs.push(log);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  return NextResponse.json({ success: true, log });
}
