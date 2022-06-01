import { Router } from 'express'
import { getAll, create, update } from '../controllers/orders.mjs'
import passport from 'passport'
const router = Router()

router.get('/', getAll)
router.post('/', passport.authenticate('jwt', { session: false }), create)
router.post('/:id', passport.authenticate('jwt', { session: false }), update)

export default router
