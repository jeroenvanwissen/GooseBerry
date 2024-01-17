function StatusBar() {
	return (
		<div className="flex-none bg-primary-500 px-2 h-6">
			<div className="flex justify-end items-center h-6 text-md">
				Twitch Connection Status:
				<div className="ml-2 border-secondary-800 border bg-tertiary-400 shadow-inner rounded-full w-4 h-4"></div>
				{/* <div className="ml-2 border-secondary-800 border bg-secondary-400 shadow-inner rounded-full w-4 h-4"></div> */}
			</div>
		</div>
	);
}

export default StatusBar;
