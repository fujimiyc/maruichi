import { NextRequest, NextResponse } from 'next/server';

const SHEET_ID = '1mt4MVLIH8m7anp5ypBc9fNVtxHvf_Hvyi7BRbgrBaEg';
const SHEET_NAME = '新規登録者名簿';

async function fetchMembers(): Promise<{ id: string; name: string }[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const csv = await res.text();

  const rows = csv.split('\n').slice(1);
  const members: { id: string; name: string }[] = [];

  for (const row of rows) {
    if (!row.trim()) continue;

    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current);

    // B列(index 1) = ID, C列(index 2) = 名前
    const id = (fields[1] || '').trim().replace(/^"|"$/g, '');
    const name = (fields[2] || '').trim().replace(/^"|"$/g, '');

    if (id && name) {
      members.push({ id, name });
    }
  }

  return members;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !/^\d{6}$/.test(id)) {
    return NextResponse.json({ error: '番号は6桁の数字で指定してください' }, { status: 400 });
  }

  try {
    const members = await fetchMembers();
    const member = members.find((m) => m.id === id);

    if (!member) {
      return NextResponse.json({ error: 'メンバーが見つかりません' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('スプレッドシート取得エラー:', error);
    return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 });
  }
}
