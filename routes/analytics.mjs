import { Router } from 'express'
import { overview, analytics } from '../controllers/analytics.mjs'
import passport from 'passport'
const router = Router()

router.get(
	'/overview',
	passport.authenticate('jwt', { session: false }),
	overview
)
router.get(
	'/analytics',
	passport.authenticate('jwt', { session: false }),
	analytics
)

export default router
