import fs from 'fs';
import path from 'path';

function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getExistingIds(fileContent) {
  const idRegex = /id:\s*'([^']+)'/g;
  const ids = [];
  let match;
  while ((match = idRegex.exec(fileContent)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

function generateUniqueId(name, existingIds) {
  const base = `u-${toKebabCase(name)}`;
  if (!existingIds.includes(base)) return base;
  let counter = 2;
  while (existingIds.includes(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}

function formatCells(cells) {
  return `[${cells.map(([r, c]) => `[${r},${c}]`).join(',')}]`;
}

export default function savePatternPlugin() {
  const patternsPath = path.resolve('src/data/patterns.js');

  return {
    name: 'save-pattern',
    configureServer(server) {
      server.middlewares.use('/__api/save-pattern', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          try {
            const { name, cells } = JSON.parse(body);
            const fileContent = fs.readFileSync(patternsPath, 'utf-8');
            const existingIds = getExistingIds(fileContent);
            const id = generateUniqueId(name, existingIds);

            const entry = `  { id: '${id}', name: '${name.replace(/'/g, "\\'")}', category: 'Special', cells: ${formatCells(cells)} },\n`;

            // Insert before the closing ];
            const insertPos = fileContent.lastIndexOf('];');
            const newContent = fileContent.slice(0, insertPos) + entry + fileContent.slice(insertPos);

            fs.writeFileSync(patternsPath, newContent, 'utf-8');

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ id }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });

      server.middlewares.use('/__api/delete-pattern', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          try {
            const { id } = JSON.parse(body);
            const fileContent = fs.readFileSync(patternsPath, 'utf-8');

            // Match the full line containing this pattern id
            const lineRegex = new RegExp(`^.*id:\\s*'${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'.*\\n`, 'm');
            const newContent = fileContent.replace(lineRegex, '');

            fs.writeFileSync(patternsPath, newContent, 'utf-8');

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}
