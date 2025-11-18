import { promises as fs } from 'node:fs';
import path from 'node:path';

const locales = ['en', 'zh', 'ko', 'ja', 'es', 'de', 'fr', 'pt'];
const outDir = path.resolve(process.cwd(), 'out');

// Pages that need locale redirects
const localizedPages = ['about', 'faq', 'legal/terms', 'legal/privacy'];

async function copyIfExists(src, dest) {
  try {
    await fs.copyFile(src, dest);
    return true;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`[post-export] Failed to copy ${src} → ${dest}:`, error.message);
    }
    return false;
  }
}

async function createRedirectHTML(targetPath) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${targetPath}">
  <link rel="canonical" href="${targetPath}">
  <script>window.location.href="${targetPath}"</script>
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="${targetPath}">${targetPath}</a>...</p>
</body>
</html>`;
}

async function run() {
  // Copy locale index files
  await Promise.all(
    locales.map(async (locale) => {
      const htmlSrc = path.join(outDir, locale, 'index.html');
      const htmlDest = path.join(outDir, `${locale}.html`);
      const txtSrc = path.join(outDir, locale, 'index.txt');
      const txtDest = path.join(outDir, `${locale}.txt`);

      const htmlCopied = await copyIfExists(htmlSrc, htmlDest);
      const txtCopied = await copyIfExists(txtSrc, txtDest);

      if (htmlCopied || txtCopied) {
        console.log(`[post-export] Ensured flat copies for /${locale}`);
      }
    })
  );
  
  // Create redirect pages for non-locale paths → /en/{path}
  for (const pagePath of localizedPages) {
    const pageDir = path.join(outDir, pagePath);
    const redirectHTML = await createRedirectHTML(`/en/${pagePath}`);
    
    try {
      await fs.mkdir(pageDir, { recursive: true });
      await fs.writeFile(path.join(pageDir, 'index.html'), redirectHTML);
      console.log(`[post-export] Created redirect: /${pagePath} → /en/${pagePath}`);
    } catch (error) {
      console.warn(`[post-export] Failed to create redirect for ${pagePath}:`, error.message);
    }
  }
  
  // Copy 404.html to out directory for GitHub Pages
  try {
    const src404 = path.join(process.cwd(), 'public', '404.html');
    const dest404 = path.join(outDir, '404.html');
    await fs.copyFile(src404, dest404);
    console.log('[post-export] Copied 404.html for GitHub Pages');
  } catch (error) {
    console.warn('[post-export] Failed to copy 404.html:', error.message);
  }
}

run().catch((error) => {
  console.error('[post-export] Fatal error:', error);
  process.exit(1);
});

