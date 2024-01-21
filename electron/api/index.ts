import express from 'express';
import bodyParser from 'body-parser';

// import GooseBerry from '../gooseberry';
import TwitchRewards from './TwitchRewards';

export default (): void => {
	const api = express();
	api.use(bodyParser.json());

	api.use('/api/rewards', TwitchRewards);
	//TODO: Add other API routes here
	// triggers, actions, devices, rules etc..

	api.listen(3003, () => {
		//Conected
	});
};
