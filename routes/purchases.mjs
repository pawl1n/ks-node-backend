import { Router } from 'express'
import {
  getAll,
  create,
  update,
  remove,
  getById
} from '../controllers/purchases.mjs'
import passport from 'passport'
const router = Router()

router.get('/:id', passport.authenticate('jwt', { session: false }), getById)
router.get('/', passport.authenticate('jwt', { session: false }), getAll)
router.post('/', passport.authenticate('jwt', { session: false }), create)
router.patch('/:id', passport.authenticate('jwt', { session: false }), update)
router.delete('/:id', passport.authenticate('jwt', { session: false }), remove)

export default router
