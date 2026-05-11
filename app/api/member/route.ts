import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !/^\d{6}$/.test(id)) {
    return NextResponse.json({ error: '番号は6桁の数字で指定してください' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'members.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const member = data.members.find((m: { id: string; name: string }) => m.id === id);

    if (!member) {
      return NextResponse.json({ error: 'メンバーが見つかりません' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Member lookup failed:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
