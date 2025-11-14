import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const cwd = process.cwd();
    const candidates = [
      path.resolve(cwd, '../../docs-generated/api/openapi.json'),
      path.resolve(cwd, '../../../docs-generated/api/openapi.json'),
      path.resolve(cwd, 'public/docs/api/openapi.json'),
    ];

    for (const p of candidates) {
      try {
        const content = await readFile(p, 'utf-8');
        return new Response(content, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=60',
          },
        });
      } catch {
        // try next candidate
      }
    }

    return NextResponse.json({ error: 'OpenAPI spec not found' }, { status: 404 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to serve OpenAPI spec', details: message }, { status: 500 });
  }
}


