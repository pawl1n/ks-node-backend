export function overview(req, res) {
	return res.status(200).json({
		overview: true
	})
}

export function analytics(req, res) {
	return res.status(200).json({
		analytics: true
	})
}
