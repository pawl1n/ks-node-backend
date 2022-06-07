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
const router = Router()

router.get('/', getAll)
router.get('/:id', getById)
router.get('/get/count/', count)
router.post('/', passport.authenticate('jwt', { session: false }), create)
router.patch('/:id', passport.authenticate('jwt', { session: false }), update)
router.delete('/:id', passport.authenticate('jwt', { session: false }), remove)

export default router
