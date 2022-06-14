import multer from 'multer'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderName = req.body.name.replace(' ', '-')
    if (folderName && !fs.existsSync('uploads/' + folderName)) {
      fs.mkdirSync('uploads/' + folderName)
    }
    const path = folderName ? 'uploads/' + folderName : 'uploads/'
    cb(null, path)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${uniqueSuffix}-${file.originalname.replaceAll(' ', '-')}`)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const limits = {
  fileSize: 1024 * 1024 * 5 // 5 Mebibytes
}

export default multer({ storage, fileFilter, limits })
