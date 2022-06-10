export default (err, req, res, next) => {
  console.log(err)
  if (err.code == 'LIMIT_FILE_SIZE') {
    return res.status(500).json({
      success: false,
      message: 'Файл занадто великий'
    })
  }
  return res.status(500).json({
    success: false,
    message: err.message ? err.message : err
  })
}
