import { Router } from 'express';
import { Reward } from 'comfy.js';

import GooseBerry from '../gooseberry';

const router = Router();

router.use((req, _res, next) => {
	console.log(req.url);
	next();
});

router.get('/', (_req, res) => {
	if (GooseBerry.ComfyJS.GetChannelRewards) {
		GooseBerry.ComfyJS.GetChannelRewards(
			GooseBerry.config.userPreferences.get('TWITCH_BOT_CLIENT_ID') as string,
			false
		)
			.then((data: Reward[]) => {
				res.json(data);
			})
			.catch(() => {
				res.json([]);
			});
	} else {
		res.json([]);
	}
});

// The ID in the Client-Id header must match the client ID used to create the custom reward,
// or the broadcaster doesn't have partner or affiliate status.

router.put(
	'/:rewardId',
	(req: { params: { rewardId: string }; body: Reward }, res) => {
		if (GooseBerry.ComfyJS.UpdateChannelReward) {
			GooseBerry.ComfyJS.UpdateChannelReward(
				GooseBerry.config.userPreferences.get('TWITCH_BOT_CLIENT_ID') as string,
				req.params.rewardId,
				req.body
			)
				.then((data: Reward) => {
					res.json(data);
				})
				.catch((error: any) => {
					console.log(error);
					res.json({});
				});
		} else {
			res.json({});
		}
	}
);

router.put('/', (_req, res) => {
	res.send('add new twitch channel rewards');
});

router.delete('/:rewardId', (_req, res) => {
	res.send('delete twitch channel reward');
});

export default router;
