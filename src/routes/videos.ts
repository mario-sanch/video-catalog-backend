import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// todo: add library to validate request data from client
// add global error handling

router.get("/", async (_req: Request, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        videocategory: true,
        videostatus: true,
      },
      orderBy: {
        CreatedAt: "asc",
      },
    });
    res.status(200).json({ status: "success", videos });
  } catch (err) {
    console.error("Error fetching videos", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    let { id } = req.params ?? 0;
    const videoId = Number(id);

    if (videoId < 1) {
      return res.status(400).json({ status: "error", msg: "invalid id" });
    }

    const video = await prisma.video.findUnique({
      where: { VideoId: videoId },
      include: {
        videocategory: true,
        videostatus: true,
      },
    });

    if (!video) {
      return res.status(404).json({
        status: "success",
        msg: `No video found with id : ${videoId}`,
      });
    }

    return res.status(200).json({ status: "success", video });
  } catch (err) {
    console.error(`Error fetching video with id: ${req.params.id}`, err);
    res.status(500).json({
      status: "error",
      error: `error fetching video with id: ${req.params.id}`,
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { Name, FolderAddress, CategoryId } = req.body;

    const video = await prisma.video.create({
      data: {
        Name,
        FolderAddress,
        CategoryId,
      },
    });

    res.status(201).json({ status: "success", video });
  } catch (err) {
    console.error("Error creating video", err);
    res.status(500).json({ status: "error", msg: "error creating video" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const videoId = Number(id);

    const { Name, FolderAddress, CategoryId, StatusId } = req.body;

    const video = await prisma.video.update({
      where: { VideoId: videoId },
      data: {
        Name,
        FolderAddress,
        CategoryId,
        StatusId,
        UpdatedAt: new Date(),
      },
    });

    res.status(200).json({ status: "success", video });
  } catch (err) {
    console.error("Error updating video", err);
    res.status(500).json({ status: "error", msg: "Error updating video" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const videoId = Number(id);

    const videoFound = await prisma.video.findUnique({
      where: { VideoId: videoId },
    });

    if (!videoFound) {
      return res.status(404).json({
        status: "error",
        msg: `No video found with id: ${req.params.id}`,
      });
    }

    //status deleted = 3 or update accordingly
    const video = await prisma.video.update({
      where: { VideoId: videoId },
      data: {
        StatusId: 3,
      },
    });

    if (video.StatusId === 3) {
      return res.status(200).json({ status: "success", msg: "Video deleted" });
    } else {
      return res
        .status(500)
        .json({ status: "error", msg: "video could not been deleted" });
    }
  } catch (err) {
    console.error("Error deleting video", err);
    res.status(500).json({ status: "error", msg: "Error deleting video" });
  }
});

export default router;
