import { NextResponse } from 'next/server';

// Import the cache maps (they're module-scoped so we can't directly access them)
// This route will force a cache miss by returning instructions

export async function GET() {
  return NextResponse.json({
    message: 'To clear cache, wait 10 minutes or restart the dev server',
    tip: 'Caches automatically expire after 10 minutes',
  });
}
