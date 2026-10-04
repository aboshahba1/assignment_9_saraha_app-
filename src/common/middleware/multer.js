
import fs from "node:fs";
import multer from "multer";
import { randomUUID } from "node:crypto";

export const multerlocal = ({
    customPath,
    customTypes
}) => {

    const fullPath = `uploads/${customPath}`;

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    const storage = multer.diskStorage({

        destination: (req, file, cb) => {
            cb(null, fullPath);
        },

        filename: (req, file, cb) => {
            cb(null, randomUUID() + "__" + file.originalname);
        }
    });

    function fileFilter(req, file, cb) {
        console.log("File MIME type:", file.mimetype);
        if (!customTypes.includes(file.mimetype)) {
            cb(new Error("Invalid file!"));
        } else {
            cb(null, true);
        }
    }

    const upload = multer({
        storage,
        fileFilter
    });

    return upload;
};

