import { withRouter } from 'react-router-dom';
import { setAuthToken } from '../../utils';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {}

const Logout = ({ history }: Props): null => {
  setAuthToken('');
  localStorage.removeItem('jwtToken');
  history.push('/');
  return null;
};

export default withRouter(Logout);
