import { ExtractJwt, Strategy } from 'passport-jwt'
import mongoose from 'mongoose'
import User from '../models/User.mjs'

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET
}

export default (passport) => {
	passport.use(
		new Strategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.SECRET
			},
			async (payload, done) => {
				if (!mongoose.isValidObjectId(payload.userId)) {
					done(null, false)
				}
				const user = await User.findById(payload.userId).select(
					'email id'
				)
				if (user) {
					done(null, user)
				} else {
					done(null, false)
				}
			}
		)
	)
}
