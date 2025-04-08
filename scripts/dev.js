const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function getLocalIP() {
  try {
    const { stdout } = await execAsync(
      "ifconfig | grep 'inet ' | grep -v 127.0.0.1 | awk '{print $2}'",
    );
    return stdout.trim();
  } catch (error) {
    console.error('Error getting local IP:', error);
    return 'localhost';
  }
}

async function startDevServer() {
  const localIP = await getLocalIP();

  const { spawn } = require('child_process');
  const nextDev = spawn('next', ['dev', '--hostname', localIP], {
    stdio: 'inherit',
    shell: true,
  });

  nextDev.on('error', (err) => {
    console.error('Failed to start server:', err);
  });
}

startDevServer();
