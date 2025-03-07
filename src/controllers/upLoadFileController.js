// uploadFileController.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  DO_SPACES_KEY,
  DO_SPACES_SECRET,
  DO_SPACES_ENDPOINT,
} from "../config/index.js";

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: DO_SPACES_ENDPOINT,
  forcePathStyle: false,
  credentials: {
    accessKeyId: DO_SPACES_KEY,
    secretAccessKey: DO_SPACES_SECRET,
  },
});

export const uploadFile = async (req, res) => {
  const { tipo, id } = req.body;
  const file = req.file;
  
  const fileExtension = file.originalname.split(".").pop();

  try {
    if (!tipo || !id) {
      return res.status(400).json({ error: "El tipo y el ID son requeridos" });
    }

    const fileKey = `${tipo}/${id}.${fileExtension}`;

    const params = {
      Bucket: "sermente",
      Key: fileKey,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    res.json({
      message: "Archivo subido con éxito",
      url: `https://sermente.nyc3.digitaloceanspaces.com/${fileKey}`,
    });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    res.status(500).json({ error: "Error al subir el archivo" });
  }
};
