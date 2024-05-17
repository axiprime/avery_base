import path from "path";
import { readdirSync } from "fs";
// Évènements : https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md

const ircTwitchtvents = async function (client, print) {
  const destination = path.dirname(process.argv[1]) + "/modules/server/twitch/irc/events";
  const eventFolders = readdirSync(destination);
  const events = [];
  for (const folder of eventFolders) {
    const eventFiles = readdirSync(`${destination}/${folder}`).filter((file) =>
      file.endsWith(".js")
    );

    for (const file of eventFiles) {
      const command = await import(
        `${process.platform === "win32" ? "file://" : ""
        }${destination}/${folder}/${file}`
      );
      events.push({ folder: folder, file: file });
      client.on(command.name, async (...args) =>
        args.length > 0
          ? await command.execute(client, ...Object.values(...args))
          : await command.execute(client, services)
      );
    }
  }
  if (print)
    console.info(
      `======================== Loaded Events ========================\n${events
        .map((e) => `${e.folder} => ${e.file}`)
        .join(
          "\n"
        )}\n==================================================================\n`
    );
  else
    console.info(`[TWITCH WEBSOCKET] total loaded events : ${events.length}`);
};

const ircWebsocketEvents = async function (client, print) {
  const destination =
    path.dirname(process.argv[1]) +
    "/modules/server/twitch/irc/websocketEvents";
  const eventFolders = readdirSync(destination).filter((file) =>
    file.endsWith(".js")
  );
  const events = [];

  for (const file of eventFolders) {
    const command = await import(
      `${process.platform === "win32" ? "file://" : ""}${destination}/${file}`
    );
    events.push({ file: file });

    client.on(command.name, async (...args) => {
      await command.execute(client, ...args);
    });
  }

  if (print)
    console.info(
      `======================== Loaded Websocket Event ========================\n${events
        .map((e) => `${e.file}`)
        .join(
          "\n"
        )}\n==================================================================\n`
    );
  else
    console.info(
      `[TWITCH WEBSOCKET] total loaded Websocket Event : ${events.length}`
    );
};

export { ircTwitchtvents, ircWebsocketEvents };
