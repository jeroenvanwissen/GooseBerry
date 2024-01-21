/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContext, useEffect, useState } from 'react';
import { Context, ContextType } from '../../Context';

function Rewards() {
	const { state } = useContext<ContextType>(Context);
	const [redemptions, setRedemptions] = useState([]);

	useEffect(() => {
		console.log('state', state);
		setRedemptions(state.redemptions as []);
	}, [state]);

	//TODO: Fix this any at some point, we're still prototyping...
	return (
		<div className="flex flex-col items-center h-full bg-primary-700 space-y-4">
			<h1 className="text-2xl text-gray-200">Redemptions</h1>
			{/* {console.log(state)} */}
			{redemptions &&
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
				redemptions.map((redemption: { title: string }) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					return <>{console.log(redemption)}</>;
				})}
			<p>
				Twitch Redemptions administration, uses API to sync with twitch.
				Create/Delete/Edit/Enable/Disable etc.
			</p>
		</div>
	);
}
export default Rewards;
