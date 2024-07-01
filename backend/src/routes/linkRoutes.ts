import { Router } from "express";
import { LinkController } from "../controller/LinkController";
import { basicAuthHandler } from "../middleware/authHandler";

const router = Router();
const linkController = new LinkController();

router.post("/process", basicAuthHandler, (req, res) => linkController.processWebUrls(req, res));
router.get("/", basicAuthHandler, (req, res) => linkController.getLinks(req, res));

export default router;