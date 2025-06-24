// lib/supabaseClient.ts
'use client';

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { type SupabaseClient } from '@supabase/supabase-js';

export const createClient = (): SupabaseClient => createBrowserSupabaseClient();
