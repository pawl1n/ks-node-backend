import multer from 'multer'

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const path = req.body.name ? 'uploads/' + req.body.name : 'uploads/'
		cb(null, path)
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, file.fieldname + '-' + uniqueSuffix)
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

export default uploadOptions = multer({ storage, fileFilter, limits })
