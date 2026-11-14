import { Router, type IRouter } from "express";
import { client, botState } from "../bot/index";

const router: IRouter = Router();

const INSTALL_PERMISSIONS = "8";

router.get("/discord/invite", (_req, res) => {
  const applicationId =
    process.env["DISCORD_APPLICATION_ID"] ?? client.user?.id;

  if (!applicationId) {
    res.status(503).json({
      error: "Discord bot is not ready yet",
    });
    return;
  }

  const params = new URLSearchParams({
    client_id: applicationId,
    permissions: INSTALL_PERMISSIONS,
    scope: "bot applications.commands",
  });

  res.json({
    applicationId,
    url: `https://discord.com/oauth2/authorize?${params.toString()}`,
  });
});

router.get("/discord/status", (_req, res) => {
  const ready = client.isReady();
  res.json({
    status: ready ? "online" : botState.status,
    error: botState.error,
    tag: client.user?.tag ?? null,
    applicationId: client.user?.id ?? null,
    guilds: ready ? client.guilds.cache.size : 0,
    ping: ready ? client.ws.ping : null,
  });
});

export default router;