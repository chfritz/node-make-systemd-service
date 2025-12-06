# node-make-systemd-service

Script that turns the npm project in the current directory into a systemd user service started on login

## Usage

In a `npm` project folder run
```
npx make-systemd-service
```
It will set up a systemd user service in `~/.config/systemd/user` to run this project using the `start` script if it is defined or running the `main` file specified in `package.json`. If neither is defined it will throw a error.

The systemd user service will run at login of the current user, or on boot if `loginctl enable-linger $USER` was run for the user.

Afterwards you can use `systemctl --user status NAME` to see the status of the new service, where `NAME` is the name of the npm project as specified in `package.json`.
