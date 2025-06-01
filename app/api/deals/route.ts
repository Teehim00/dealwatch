// app/api/deals/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // ต้องเช็คว่า import ถูก path

export async function GET() {
  const { data, error } = await supabase.from('deals').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
