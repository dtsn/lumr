import express from 'express';
import fs from 'fs';
import path from 'path';
import hue from '../models/hue/index.js';

const router = express.Router();

/**
 * Do we have a correctly setup config
 */
router.get('/config', async (req, res, next) => {
	console.log('fetching config');
	console.log(path.resolve('config.json'));
	try {
		let config = fs.readFileSync(path.resolve('config.json'), 'UTF-8');
		config = JSON.parse(config);
		// if we have an IP we know we have reached step 1 in setup
		if (config.ip) {
			res.status(200).json(config);
		} else {
			res.status(404).json({
				error: 'Config is empty',
			});
		}
	} catch (e) {
		console.log(e);
		res.status(404).json({
			error: e,
		});
	}
});

router.get('/hubs/:hub?', async (req, res, next) => {
	let credentials = false;
    let hub = req.params.hub;
    let hubs = await hue.discover();
	console.log('starting discovery of hubs');

    // look for hubs
    if (!hub) {
        // more than one hub we will need to select one
        if (hubs.length > 1) {
            return res.status(200).json({
                hubs,
            });
        } else {
            // only one hub so just default to that one
            hub = hubs[0];
        }
    } else {
        // passed through a param so select that one
        hubs.forEach(h => {
            if (h.ip === hub) {
                hub = h;
            }
        });
    }

	try {
		credentials = await hue.createUser(hub.ip);
		// write out the credentails to the config file
		let config = JSON.parse(fs.readFileSync(path.resolve('config.json'), 'UTF-8'));
		config = {
			...config,
			...credentials,
		};
		fs.writeFileSync(path.resolve('config.json'), JSON.stringify(config, null, 2));
		res.status(200).json({
			success: 'Hub connect established',
		});
	} catch (e) {
		res.status(408).send('Connection timed out, did you press the button?');
	}
});

export default router;
