import fs from 'node:fs';
import path from 'node:path';

function extractTemplateParts(html: string) {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  return {
    style: styleMatch ? styleMatch[1] : '',
    body: bodyMatch ? bodyMatch[1] : html,
  };
}

export default function AuthPage() {
  const htmlPath = path.join(process.cwd(), 'templates', 'auth.html');
  const rawHtml = fs.readFileSync(htmlPath, 'utf8');
  const template = extractTemplateParts(rawHtml);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: template.style }} />
      <div dangerouslySetInnerHTML={{ __html: template.body }} />
    </>
  );
}
