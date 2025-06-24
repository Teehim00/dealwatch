// app/api/chart/new-deals/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const days = Number(url.searchParams.get('days') || 7);
  const supabase = createRouteHandlerClient({ cookies });

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const { data, error } = await supabase
    .from('deals')
    .select('id, created_at')
    .gte('created_at', sinceDate.toISOString());

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Group by day
  const countPerDay = data.reduce((acc, deal) => {
    const date = new Date(deal.created_at).toISOString().slice(0, 10);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Response.json(countPerDay);
}
