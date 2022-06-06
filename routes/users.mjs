import { Router } from 'express'
import {
  login,
  getAll,
  getById,
  create,
  update,
  remove,
  register
} from '../controllers/users.mjs'
import passport from 'passport'
const router = Router()

router.post('/login', login)
router.post('/register', register)
router.get('/', passport.authenticate('jwt', { session: false }), getAll)
router.get('/:id', passport.authenticate('jwt', { session: false }), getById)
router.post('/', passport.authenticate('jwt', { session: false }), create)
router.patch('/:id', passport.authenticate('jwt', { session: false }), update)
router.delete('/:id', passport.authenticate('jwt', { session: false }), remove)

export default router
