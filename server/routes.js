const actions = require('./actions');
const { Router } = require('express');
const logger = require('../lib/logger');
const ash = require('express-async-handler');
const Validations = require('./lib/validations');
const { wallpaper, avatar } = require('./status');

const router = new Router();

router.get('/display/wallpaper/:index', ash(async (req, res) => {
	(await wallpaper(req.params.index)).pipe(res);
}));

router.get('/me/avatar', ash(async (req, res) => {
	(await avatar()).pipe(res);
}));

router.post('/:target/:action', ash(async (req, res) => {
	const { target, action } = req.params;
	if (!actions[target]) return res.sendStatus(404);
	if (!actions[target][action]) return res.sendStatus(404);

	const validator = await Validations(`${target}.${action}`, req.body);
	const valid = await validator.check();
	const { errors } = validator;
	if (!valid) return res.status(422).json({ errors });
	
	const command = actions[target][action];
	
	if (target === 'network' && action === 'speed') {
		const speed = await command(req.body);
		return res.json(speed);
	} else {
		if (await command(req.body)) return res.json({ msg: 'ok' });
	}

	return res.sendStatus(400);
}));

module.exports = router;