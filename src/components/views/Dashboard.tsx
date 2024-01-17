import { useEffect, useState } from 'react';

function Dashboard() {
	const [isOpen, setOpen] = useState(false);
	const [isSent, setSent] = useState(false);
	const [fromMain, setFromMain] = useState<string | null>(null);

	const handleToggle = () => {
		if (isOpen) {
			setOpen(false);
			setSent(false);
		} else {
			setOpen(true);
			setFromMain(null);
		}
	};
	const sendMessageToElectron = () => {
		if (window.Main) {
			window.Main.sendMessage("Hello I'm from React World");
		} else {
			setFromMain(
				'You are in a Browser, so no Electron functions are available'
			);
		}
		setSent(true);
	};

	useEffect(() => {
		if (isSent && window.Main)
			window.Main.on('message', (data: unknown) => {
				setFromMain(data as string);
			});
	}, [fromMain, isSent]);

	return (
		<div className=" flex flex-col justify-center items-center h-full bg-primary-700 space-y-4">
			<h1 className="text-2xl text-gray-200">GooseBerry</h1>
			<p>
				Needs to be a modular system. Each module should be able to hook into
				the Trigger and Actions system. Twitch: Twitch Redepmtions
				administration, uses API to sync with twitch.
				Create/Delete/Edit/Enable/Disable etc. Actions: Actions are !commands
				that can be triggered by a user in chat. Rules: Rules are triggers
				(devices, timers, chat, twitch actions) that will trigger actions and
				have checks.? Queues: Redemptions / Actions can be queued up and will be
				executed in order. Excution can be done manually or automatically.
				Settings: Settings for the application. Twitch auth settings, etc.
			</p>
			<button
				className="bg-yellow-400 py-2 px-4 rounded focus:outline-none shadow hover:bg-yellow-200"
				onClick={handleToggle}
			>
				Click Me
			</button>
			{isOpen && (
				<div className="flex flex-col space-y-4 items-center">
					<div className="flex space-x-3">
						<h1 className="text-xl text-gray-50">
							Trigger a message sent to Twitch Chat
						</h1>
						<button
							onClick={sendMessageToElectron}
							className=" bg-green-400 rounded px-4 py-0 focus:outline-none hover:bg-green-300"
						>
							Send
						</button>
					</div>
					{isSent && (
						<div>
							<h4 className=" text-green-500">Message sent!!</h4>
						</div>
					)}
					{fromMain && (
						<div>
							{' '}
							<h4 className=" text-yellow-200">{fromMain}</h4>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
export default Dashboard;
