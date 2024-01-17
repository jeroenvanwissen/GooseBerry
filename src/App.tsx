import { Routes, Route } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import StatusBar from './components/StatusBar';

import Dashboard from './components/views/Dashboard';
import Redemptions from './components/views/Redemptions';
import Actions from './components/views/Actions';
import Rules from './components/views/Rules';
import Queues from './components/views/Queues';
import Settings from './components/views/Settings';

function App() {
	return (
		<div className="flex flex-col h-screen w-full">
			<NavigationBar />
			<div className="flex-auto">
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/redemptions" element={<Redemptions />} />
					<Route path="/actions" element={<Actions />} />
					<Route path="/rules" element={<Rules />} />
					<Route path="/queues" element={<Queues />} />
					<Route path="/settings" element={<Settings />} />
				</Routes>
			</div>
			<StatusBar />
		</div>
	);
}

export default App;
