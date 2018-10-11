export default (state = { auth: false }, action) => {
  switch (action.type) {
    case 'AUTH_USER':
      return {
        auth: true
      };

    default:
      return state;
  }
};
