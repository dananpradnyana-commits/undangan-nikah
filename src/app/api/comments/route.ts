import { NextResponse } from 'next/server';
import { addComment, listComments } from '@/lib/commentStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ comments: await listComments() });
  } catch {
    return NextResponse.json({ error: 'Gagal memuat ucapan.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: { author?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Data tidak valid.' }, { status: 400 });
  }

  const author = typeof body.author === 'string' ? body.author.trim().slice(0, 80) : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 500) : '';

  if (!author) return NextResponse.json({ error: 'Nama wajib diisi.' }, { status: 400 });
  if (message.length < 2) {
    return NextResponse.json({ error: 'Ucapan minimal 2 karakter.' }, { status: 400 });
  }

  try {
    return NextResponse.json({ comment: await addComment(author, message) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan ucapan. Coba lagi.' }, { status: 500 });
  }
}
