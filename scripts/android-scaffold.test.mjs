import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (file) => readFileSync(resolve(root, file), 'utf8');

test('Android build workflow produces an installable APK artifact', () => {
  const workflow = read('.github/workflows/build.yml');
  assert.match(workflow, /npm run build:android/);
  assert.match(workflow, /gradle --no-daemon assembleDebug/);
  assert.match(workflow, /name: maydan-android-apk/);
  assert.match(workflow, /app-debug\.apk/);
});

test('Android wrapper includes the embedded local server and persistent seed data', () => {
  assert.ok(existsSync(resolve(root, 'android/app/src/main/java/app/maydan/local/LocalMaydanServer.kt')));
  assert.ok(existsSync(resolve(root, 'android/app/src/main/java/app/maydan/local/MaydanServerService.kt')));
  assert.ok(existsSync(resolve(root, 'android/app/src/main/assets/seed/maydan-store.json')));
  const server = read('android/app/src/main/java/app/maydan/local/LocalMaydanServer.kt');
  assert.match(server, /0\.0\.0\.0/);
  assert.match(server, /maydan-store\.json/);
  assert.match(server, /\/api\/submissions\/add/);
  assert.match(server, /\/api\/forms\/save/);
});

test('Android web build uses the native REST client rather than TanStack server functions', () => {
  const config = read('vite.android.config.ts');
  const api = read('src/lib/maydan/api.android.ts');
  assert.match(config, /api\.android\.ts/);
  assert.match(api, /\/api\/snapshot/);
  assert.match(api, /\/api\/submissions\/import/);
  assert.match(api, /fetch\(/);
});
