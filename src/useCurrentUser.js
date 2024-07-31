import { useContext } from 'react';
import { UserContext } from './context/UserContext';

export function useCurrentUser() {
    const { user } = useContext(UserContext);
    return user;
}
