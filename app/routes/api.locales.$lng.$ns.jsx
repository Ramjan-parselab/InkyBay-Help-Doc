import fs from "node:fs/promises";
import path from "path";

export const loader= async ({ request, params }) => {
  const url = new URL(request.url);
//   const lng = url.searchParams.get('lng') || 'en';
  const ns = params?.ns || 'common';
  const lng = params?.lng || "en";

  
  const filePath = path.join(process.cwd(), 'public', 'locales', lng, `${ns}.json`);
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    
    const response =  Response.json(JSON.parse(fileContents), {
      headers: {
        'Cache-Control': 'no-store',
        'ETag': `${Date.now()}`
      }
    });
   return response;
  } catch (error) {
    return Response.json({ error: 'Translations not found' }, { status: 404 });
  }
};