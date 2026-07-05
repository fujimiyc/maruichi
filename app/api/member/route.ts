import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyHGAsWfdPzwyYrfS8MFpBStLu6rY8cXsLK_PB72eQlmuRiZy4vhI9WObUxgxRWKIGslA/exec';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !/^\d{6}$/.test(id)) {
    return NextResponse.json({ error: '番号は6桁の数字で指定してください' }, { status: 400 });
  }

  try {
    // doPostのlookupアクションを使用（doGetは未デプロイのため）
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'lookup', id }),
    });

    if (!res.ok) {
      throw new Error(`GAS returned ${res.status}`);
    }

    const text = await res.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      console.error('GASレスポンス解析エラー:', text.substring(0, 200));
      return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 });
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      id: result.id,
      name: result.name,
      consent: result.consent === true,
    });
  } catch (error) {
    console.error('メンバー検索エラー:', error);
    return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 });
  }
}
