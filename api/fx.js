import express from 'express';
import fx from '../models/effects/fx.js';
import defaultEffects from '../models/effects/default/index.js';

const router = express.Router();
let effect = null;

/* GET users listing. */
router.get('/:effectName/play', function (req, res, next) {
    console.log(req.params);
	// check to see if the effect is running
	if (effect && effect.isRunning()) {
		// stop the current effect
		effect.pause();
	}
	// create a list of all the effects
	const allEffects = [
        ...defaultEffects
    ];

    console.log(allEffects);

	// search and find the one we want
	let newEffect = allEffects.find((e) => e.id === req.params.effectName);

    console.log(newEffect);

	// make sure we have one
	if (!newEffect) {
		res.status(404).json({
            error: 'Unable to find effect',
        });
		return;
	}

	if (newEffect.effect.prototype instanceof fx) {
		effect = new newEffect.effect();
        console.log('playing');
		effect.play();
	} else {
		// it's just a one off sound effect
		newEffect.effect();
	}
	// send a success message to the API
	res.status(200).send('success');
});

router.get('/pause', function (req, res, next) {
	effect.pause();
	res.status(200).send('success');
});

export default router;
