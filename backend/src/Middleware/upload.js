import multer from 'multer';
import path from 'path';
import Fs from 'fs-extra';
import { v4 as createUUID } from 'uuid';
import util from 'util';

const maxSize = 2 * 1024 * 1024 * 1024;
const base = process.cwd();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `${base}/uploads/${req.body.folder ?? 'avatar'}`;
        console.log(path, '--file.path.path.file--');
        Fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const virtual_img_url = `av-${new Date().valueOf()}${ext}`;
        cb(null, req.body.folder ? `${createUUID()}${ext}` : virtual_img_url);
        req.body.avatar = virtual_img_url;
    }
});

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize }
});

export const uploadAvatar = util.promisify(uploadFile.single('avatar'));
export const uploadTaskPhotos = util.promisify(uploadFile.array('photos[]', Infinity));
export const uploadTaskFile = util.promisify(uploadFile.single('file'));
export const uploadAnyFiles = util.promisify(uploadFile.any());

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.body.folder ?? 'products'; // Default folder is `uploads`
        const uploadPath = path.join(base, 'uploads', folder);

        // Ensure the folder exists
        Fs.mkdirsSync(uploadPath);

        console.log(uploadPath, '-- Upload Path --');
        cb(null, uploadPath);
    },
    filename: async (req, file, cb) => {
        const ext = path.extname(file.originalname);
        console.log('extext', ext)
        const uniqueName = `pr-${new Date().valueOf()}${ext}`;
        cb(null, uniqueName);

        if (!req.body.media) req.body.media = [];
        req.body.media.push({
            type: file.mimetype.startsWith('image') ? 'image' : 'video',
            url: `/${req.body.folder ?? 'products'}/${uniqueName}`,
        });
    },
});

const postUploadFile = multer({
    storage: productStorage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
        console.log(file);
        // Validate file type (images and videos only)
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/mkv',
            'video/quicktime',
            'video/x-matroska',
            'video/x-msvideo',
            'application/octet-stream'
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only images and videos are allowed.'));
        }
        cb(null, true);
    },
});

export const uploadProductPhotos = util.promisify(postUploadFile.array('photos', Infinity));