import { Router } from 'express'
import {
	getAll,
	getById,
	create,
	update,
	remove
} from '../controllers/categories.mjs'
import passport from 'passport'
const router = Router()

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', passport.authenticate('jwt', { session: false }), create)
router.patch('/:id', passport.authenticate('jwt', { session: false }), update)
router.delete('/:id', passport.authenticate('jwt', { session: false }), remove)

export default router
