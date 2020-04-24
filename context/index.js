import React, {createContext, useContext, useReducer} from 'react';
import {DEFAULT_APPLICATION_STATE} from './types';
import {RootReducer} from './rootReducer';


const DEFAULT_STORE_STATE = {
    state: DEFAULT_APPLICATION_STATE,
    dispatch: () => {
    }
};

export const StoreContext = createContext(DEFAULT_STORE_STATE);

export const StoreProvider = ({children}) => {
    const [state, dispatch] = useReducer(RootReducer, DEFAULT_APPLICATION_STATE);
    return (
        <StoreContext.Provider value={{state, dispatch}} children={children}/>
    );
};

export const useStore = () => useContext(StoreContext);
