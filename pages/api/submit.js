import { SHA256 } from 'crypto-js'
import nextConnect from 'next-connect'
import multer from 'multer'
import { connectToDatabase } from 'util/mongodb'

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
    const { db } = await connectToDatabase()
    const result = await db
        .collection('submissions')
        .insertMany([
            {
                fileNameHash: SHA256(`${req.body.name}photo_1+NaCl`).toString(),
                name: req.body.name,
                coords: req.body.coords_1,
                createdAt: Date.now(),
            },
            {
                fileNameHash: SHA256(`${req.body.name}photo_2+NaCl`).toString(),
                name: req.body.name,
                coords: req.body.coords_2,
                createdAt: Date.now(),
            },
        ])
    return res.status(200).json({ data: 'success' })
})

export default apiRoute

export const config = {
    api: { bodyParser: false },
}
