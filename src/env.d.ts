/// <reference types="astro/client" />

import type { SupabaseClient, User } from '@supabase/supabase-js';

declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string;
    readonly PUBLIC_SUPABASE_ANON_KEY: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;
    readonly PUBLIC_VAPID_KEY: string;
    readonly VAPID_PRIVATE_KEY: string;
    readonly CRON_SECRET: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      user: User | null;
    }
  }
}
