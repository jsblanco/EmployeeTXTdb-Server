const express = require("express");
const router = express.Router();
import { Request, Response, NextFunction } from "express";

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        
      res.status(200).json("");
    } catch (error) {
      next(error);
    }
  });


module.exports = router;