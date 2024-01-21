import { createContext } from 'react';

export type ContextType = {
	state: { [key: string]: any };
	setState: (state: {}) => void;
};

export const Context = createContext<ContextType>({
	state: {},
	// eslint-disable-next-line prettier/prettier
	setState: () => { },
});
