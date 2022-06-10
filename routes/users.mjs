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

router.get('/:id', getById)
router.post('/login', login)
router.post('/register', register)
router.get('/', passport.authenticate('jwt', { session: false }), getAll)
router.post('/', passport.authenticate('jwt', { session: false }), create)
router.patch('/:id', passport.authenticate('jwt', { session: false }), update)
router.delete('/:id', passport.authenticate('jwt', { session: false }), remove)

export default router
