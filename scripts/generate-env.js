const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const examplePath = path.resolve(__dirname, '..', '.env.example');

let envContent = '';
try { envContent = fs.readFileSync(envPath, 'utf-8'); console.log('✅ Read .env file'); }
catch {
  try { envContent = fs.readFileSync(examplePath, 'utf-8'); console.log('⚠️  Using .env.example'); }
  catch { console.log('⚠️  No .env found'); }
}

const vars = {};
envContent.split('\n').forEach(line => {
  const t = line.trim();
  if (!t || t.startsWith('#')) return;
  const i = t.indexOf('=');
  if (i === -1) return;
  vars[t.substring(0, i).trim()] = t.substring(i + 1).trim();
});

const template = (prod) => `// Auto-generated from .env — DO NOT EDIT
export const environment = {
  production: ${prod},
  firebase: {
    apiKey: '${vars.FIREBASE_API_KEY || ''}',
    authDomain: '${vars.FIREBASE_AUTH_DOMAIN || ''}',
    projectId: '${vars.FIREBASE_PROJECT_ID || ''}',
    storageBucket: '${vars.FIREBASE_STORAGE_BUCKET || ''}',
    messagingSenderId: '${vars.FIREBASE_MESSAGING_SENDER_ID || ''}',
    appId: '${vars.FIREBASE_APP_ID || ''}',
    measurementId: '${vars.FIREBASE_MEASUREMENT_ID || ''}',
  },
  emailJs: {
    publicKey: '${vars.EMAILJS_PUBLIC_KEY || ''}',
    serviceId: '${vars.EMAILJS_SERVICE_ID || ''}',
    templateId: '${vars.EMAILJS_TEMPLATE_ID || ''}',
  },
};
`;

const envDir = path.resolve(__dirname, '..', 'src', 'environments');
fs.writeFileSync(path.join(envDir, 'environment.ts'), template(false));
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), template(true));
console.log('✅ Generated environment.ts and environment.prod.ts');
