import { Request, Response } from "express";

const bucketName = process.env.CONTENT_BUCKET_NAME;
import { S3 } from "aws-sdk";
export class StaticHandler {
  s3: S3;
  constructor({ s3 }: { s3: S3 }) {
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
      const { Body, ContentType } = await this.s3
        .getObject(getObjectParams)
        .promise();

      res.setHeader("Content-Type", ContentType);
      res.status(200).send(Body);
    } catch (error) {
      const { Body, ContentType } = await this.s3
        .getObject({
          Bucket: bucketName,
          Key: "index.html",
        })
        .promise();
      res.setHeader("Content-Type", ContentType);
      res.status(200).send(Body);
      return;

      console.error("Error retrieving object from S3:", error, {
        Bucket: bucketName,
        Key: path,
      });
      res.status(500).send("Internal Server ErrorZ");
    }
  };
}
