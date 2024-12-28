import { useContext } from 'react';
import { UserContext } from './UserContext';

export function useCurrentUser() {
    const { user } = useContext(UserContext);
    return user;
}
