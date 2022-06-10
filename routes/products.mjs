import { Router } from 'express'
import {
  getAll,
  getById,
  count,
  create,
  update,
  remove
} from '../controllers/products.mjs'
import passport from 'passport'
import uploadOptions from '../middleware/uploads.mjs'
const router = Router()

router.get('/', getAll)
router.get('/:id', getById)
router.get('/get/count/', count)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  uploadOptions.array('files'),
  create
)
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  uploadOptions.any(),
  update
)
router.delete('/:id', passport.authenticate('jwt', { session: false }), remove)

export default router
