#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

/** Write the systemd service file */
const createService = ({name, description, dir, cmd}) => {

  fs.writeFileSync(`${os.homedir()}/.config/systemd/user/${name}.service`,
    `[Unit]
Description=${description}

# Cannot use env variables like $USER but systemd provides some very useful
# specifies: https://www.freedesktop.org/software/systemd/man/systemd.unit.html#Specifiers
[Service]
WorkingDirectory=${dir}
ExecStart=${cmd}
Restart=always
RestartSec=2

[Install]
WantedBy=default.target
`);
};

const package = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const nodeExePath = process.env.NODE || process.argv[0];

const cmd =
  package.scripts?.start ? `${nodeExePath.replace('node','npm')} start` :
  package.main ? `${nodeExePath} ${package.main}` :
  null;

if (!cmd) throw Error('Either script or main is required');

const name = package.name.split('/').at(-1);
createService({
  name,
  description: package.description,
  dir: process.env.PWD,
  cmd
});

const result = execSync([
    'systemctl --user daemon-reload',
    `systemctl --user enable ${name}.service`,
    `systemctl --user start ${name}.service`,
    'sleep 2',
    `systemctl --user status ${name}.service`,
  ].join(' && '), { encoding: 'utf8' });

console.log(result);
