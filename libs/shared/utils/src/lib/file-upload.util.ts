import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import * as fs from 'fs';
import { diskStorage, StorageEngine } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const BASE_UPLOAD_PATH = process.env.UPLOAD_DESTINATION || path.join(process.cwd(), 'public', 'uploads');

export const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
): void => {
    const isImage = file.mimetype.startsWith('image/') && /\.(jpg|jpeg|png|webp)$/i.test(file.originalname);
    const isVideo = file.mimetype.startsWith('video/') && /\.(mp4|mkv|mov)$/i.test(file.originalname);

    if (file.fieldname === 'video' && !isVideo) {
        return callback(new BadRequestException('Video format not supported! (Use mp4/mkv/mov)'), false);
    }

    if ((file.fieldname === 'image' || file.fieldname === 'avatar') && !isImage) {
        return callback(new BadRequestException('Image format not supported! (Use jpg/jpeg/png/webp)'), false);
    }

    callback(null, true);
};

export const editFileName = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
): void => {
    const fileExtName = path.extname(file.originalname);
    const randomName = uuidv4();
    callback(null, `${randomName}${fileExtName}`);
};

export const createStorageConfig = (folderName: string): StorageEngine => {
    const uploadPath = path.join(BASE_UPLOAD_PATH, folderName);

    return diskStorage({
        destination: (req, file, cb) => {
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: editFileName,
    });
};

export const deleteFile = async (filePath: string | null | undefined): Promise<void> => {
    if (!filePath) return;

    try {
        const cleanPath = filePath.replace(/^.*public\/uploads\//, '').replace(/^\//, '');
        const fullPath = path.join(BASE_UPLOAD_PATH, cleanPath);

        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
            console.log(`[File Utils] Successfully deleted: ${fullPath}`);
        }
    } catch (error) {
        console.error(`[File Utils] Failed to delete file at ${filePath}`, error);
    }
};
