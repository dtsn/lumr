import express from 'express';
import fs from 'fs';
import path from 'path';
import lights from '../models/lights/index.js';

const router = express.Router();

// the ability to switch the lights on or off
router.get('/off', () => {
	lights.off();
});

router.get('/on', () => {
	lights.on();
});

router.get('/list', async (req, res, next) => {
	const l = await lights.getAll();
	return res.status(200).json(l);
});

router.get('/connect', async (req, res, next) => {
    try {
        await lights.connect();
        res.status(200).json({'success':'Connect to the hub'});
    } catch (e) {
        res.status(500).json({error: e});
    }
})

router.post('/add', async (req, res, next) => {
	if (!req.body || !req.body.lights || req.body.lights.length === 0) {
		return res.status(400).json({
			error: 'Please provide an array of lights to add',
		});
	}
	const lights = req.body.lights;
	// write the lights to the file
	let config = JSON.parse(fs.readFileSync(path.resolve('config.json'), 'UTF-8'));
	config = {
		...config,
		lights,
	};
	fs.writeFileSync(path.resolve('config.json'), JSON.stringify(config, null, 4));
	res.status(200).json({
		success: 'Lights added',
	});
});

export default router;
