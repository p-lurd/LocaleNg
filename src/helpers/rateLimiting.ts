import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-7',
	legacyHeaders: false
});


const strictLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	limit: 5, 
	standardHeaders: 'draft-7',
	legacyHeaders: false
});

export{limiter, strictLimiter};