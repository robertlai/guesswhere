import { SHA256 } from 'crypto-js'
import nextConnect from 'next-connect'
import multer from 'multer'
import { connectToDatabase } from 'util/mongodb'

const center = {
    lat: 51.505,
    lng: -0.09,
};

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            const hash = SHA256(`${req.body.name}${file.fieldname}+NaCl`)
            const extension = file.originalname.split('.').pop()
            return cb(null, `${hash}.${extension}`)
        },
    }),
})

const apiRoute = nextConnect({
    onError: (error, req, res) => res.status(501).json({ error: `Something went wrong: ${error.message}` }),
})

apiRoute.use(upload.fields([
    { name: 'photo_1', maxCount: 1 },
    { name: 'photo_2', maxCount: 1 },
]))

apiRoute.post(async (req, res) => {
    if (!req.body.name) {
        res.status(400).send('Please enter your name!')
        return
    }
    if (!req.files.photo_1 || !req.files.photo_2) {
        res.status(400).send('Please upload 2 photos!')
        return
    }
    if (
        req.body.coords_1 === JSON.stringify(center) ||
        req.body.coords_2 === JSON.stringify(center)
    ) {
        res.status(400).send('Please set both locations!')
        return
    }

    const { db } = await connectToDatabase()
    const result = await db
        .collection('submissions')
        .insertMany([
            {
                fileName: req.files.photo_1[0].filename,
                name: req.body.name,
                coords: req.body.coords_1,
                createdAt: Date.now(),
            },
            {
                fileName: req.files.photo_2[0].filename,
                name: req.body.name,
                coords: req.body.coords_2,
                createdAt: Date.now(),
            },
        ])
    return res.status(200).send('Submission received. Thanks!')
})

export default apiRoute

export const config = {
    api: { bodyParser: false },
}
