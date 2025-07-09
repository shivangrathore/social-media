import authMiddleware from "@/middlewares/auth";
import { ViewRepository } from "@/repositories/view.repository";
// import { ViewService } from "@/services/view.service";
import { Router } from "express";

const router: Router = Router();
router.use(authMiddleware);
export default router;

// const viewRepository = new ViewRepository();
// const viewService = new ViewService(viewRepository);
//
// router.post("/posts/:postId/views", async (req, res) => {
//   const userId = res.locals["userId"];
//   const postId = parseInt(req.params.postId, 10);
//
//   try {
//     await viewService.logPostView(postId, userId);
//     res.status(200).json({ message: "Post view logged successfully" });
//   } catch (error) {
//     console.error("Error logging post view:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
