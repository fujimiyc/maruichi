import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyHGAsWfdPzwyYrfS8MFpBStLu6rY8cXsLK_PB72eQlmuRiZy4vhI9WObUxgxRWKIGslA/exec';

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
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, action }),
    });

    if (!res.ok) {
      throw new Error(`GAS returned ${res.status}`);
    }

    const result = await res.json();

    // GAS側で拒否された場合（保護者同意なし等）はエラーとして返す
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('入退室記録エラー:', error);
    return NextResponse.json({ error: '記録に失敗しました' }, { status: 500 });
  }
}
