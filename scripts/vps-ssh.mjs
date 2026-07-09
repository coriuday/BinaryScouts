/**
 * Run a remote command on the VPS via SSH (password auth).
 * Usage: VPS_SSH_PASSWORD=... node scripts/vps-ssh.mjs "command"
 */
import { Client } from 'ssh2';

const host = process.env.VPS_HOST || '187.127.178.138';
const user = process.env.VPS_USER || 'root';
const password = process.env.VPS_SSH_PASSWORD;
const cmd = process.argv.slice(2).join(' ');

if (!password) {
  console.error('Set VPS_SSH_PASSWORD');
  process.exit(1);
}
if (!cmd) {
  console.error('Usage: node scripts/vps-ssh.mjs "<command>"');
  process.exit(1);
}

const conn = new Client();
conn
  .on('ready', () => {
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.error(err);
        conn.end();
        process.exit(1);
      }
      stream.on('close', (code) => {
        conn.end();
        process.exit(code ?? 0);
      });
      stream.stderr.on('data', (d) => process.stderr.write(d));
      stream.stdout.on('data', (d) => process.stdout.write(d));
    });
  })
  .on('error', (err) => {
    console.error('SSH error:', err.message);
    process.exit(1);
  })
  .connect({
    host,
    port: 22,
    username: user,
    password,
    readyTimeout: 30000,
  });
