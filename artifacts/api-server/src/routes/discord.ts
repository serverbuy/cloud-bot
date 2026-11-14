import { Router, type IRouter } from "express";
import { client } from "../bot/index";

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

export default router;