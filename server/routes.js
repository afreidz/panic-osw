const { Router } = require('express');
const ash = require('express-async-handler');
const { wallpaper, avatar } = require('./status');
const router = new Router();

router.get('/display/wallpaper/:index', ash(async (req, res) => {
	(await wallpaper(req.params.index)).pipe(res);
}));

router.get('/me/avatar', ash(async (req, res) => {
	(await avatar()).pipe(res);
}));

module.exports = router;