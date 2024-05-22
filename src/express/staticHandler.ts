import { Request, Response } from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const bucketName = process.env.CONTENT_BUCKET_NAME;

export class StaticHandler {
  s3: S3Client;
  constructor({ s3 }: { s3: S3Client }) {
    this.s3 = s3;
  }
  handle = async (req: Request, res: Response) => {
    const path = req.path.substring(1) || "index.html";
    try {
      const getObjectParams = {
        Bucket: bucketName,
        Key: path,
      };
      console.log("Getting object from S3:", getObjectParams);
      const { Body, ContentType } = await this.s3.send(new GetObjectCommand(getObjectParams));

      res.setHeader("Content-Type", ContentType);
      res.status(200).send(await Body.transformToString());
    } catch (error) {
      const { Body, ContentType } = await this.s3.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: "index.html",
        })
      );
      res.setHeader("Content-Type", ContentType);
      res.status(200).send(await Body.transformToString());
      return;

      console.error("Error retrieving object from S3:", error, {
        Bucket: bucketName,
        Key: path,
      });
      res.status(500).send("Internal Server ErrorZ");
    }
  };
}
