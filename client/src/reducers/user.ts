import { User } from '../types';
import { Reducer } from 'redux';

const reducer: Reducer<User> = (state = { auth: false }, action) => {
  switch (action.type) {
    case 'AUTH_USER':
      return {
        auth: true
      };

    default:
      return state;
  }
};

export default reducer;
