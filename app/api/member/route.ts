import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: '番号を指定してください' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'data', 'members.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const member = data.members.find((m: { id: string; name: string }) => m.id === id);

  if (!member) {
    return NextResponse.json({ error: 'メンバーが見つかりません' }, { status: 404 });
  }

  return NextResponse.json(member);
}
