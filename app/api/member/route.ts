import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyHGAsWfdPzwyYrfS8MFpBStLu6rY8cXsLK_PB72eQlmuRiZy4vhI9WObUxgxRWKIGslA/exec';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !/^\d{6}$/.test(id)) {
    return NextResponse.json({ error: '番号は6桁の数字で指定してください' }, { status: 400 });
  }

  try {
    const res = await fetch(`${GAS_URL}?action=lookup&id=${id}`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`GAS returned ${res.status}`);
    }

    const result = await res.json();

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ id: result.id, name: result.name });
  } catch (error) {
    console.error('メンバー検索エラー:', error);
    return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 });
  }
}
