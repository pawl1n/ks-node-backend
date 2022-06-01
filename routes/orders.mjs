import { Router } from 'express'
import {
	getAll,
	create,
	update,
	remove,
	getByUserId
} from '../controllers/orders.mjs'
import passport from 'passport'
const router = Router()

router.get('/:userId', getByUserId)
router.get('/', passport.authenticate('jwt', { session: false }), getAll)
router.post('/', passport.authenticate('jwt', { session: false }), create)
router.patch('/:id', passport.authenticate('jwt', { session: false }), update)
router.delete('/:id', passport.authenticate('jwt', { session: false }), remove)

export default router
