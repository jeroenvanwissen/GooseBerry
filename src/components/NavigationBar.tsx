import { Link } from 'react-router-dom';

function NavigationBar() {
	return (
		<nav className="flex w-full items-center bg-gradient-to-t from-primary-600 to-primary-400 px-2 shadow-md">
			<ul className="text-lg font-bold uppercase text-white text-shadow shadow-primary-600">
				<li className="inline-block px-2 hover:bg-primary-400">
					<Link to="/" className="align-middle">
						Dashboard
					</Link>
				</li>
				<li className="inline-block px-2 hover:bg-primary-400">
					<Link to="/redemptions" className="align-middle">
						Redemptions
					</Link>
				</li>
				<li className="inline-block px-2 hover:bg-primary-400">
					<Link to="/actions" className="align-middle">
						Actions
					</Link>
				</li>
				<li className="inline-block px-2 hover:bg-primary-400">
					<Link to="/rules" className="align-middle">
						Rules
					</Link>
				</li>
				<li className="inline-block px-2 hover:bg-primary-400">
					<Link to="/queues" className="align-middle">
						Queues
					</Link>
				</li>
				<li className="inline-block px-2 hover:bg-primary-400">
					<Link to="/settings" className="align-middle">
						Settings
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default NavigationBar;
