import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

/*
* Form's values are bound to state.
* If articleToEdit is passed in props, we state the state's values to articleToEdit's values
* This set's the form's values, and allows us to send patch request to server
* because the submit/update button invokes post/patch request depending on if articleToEdit's truthiness*/

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.articleToEdit) {
  //     this.setState({
  //       title: nextProps.articleToEdit.title,
  //       body: nextProps.articleToEdit.body,
  //       author: nextProps.articleToEdit.author
  //     });
  //   }
  // }

  handleSubmit() {
    const { onSubmit } = this.props;
    const { email, password } = this.state;

  
      axios
        .post('/api/signin', {
          email,
          password
        })
        .then(res => {
          console.log('login res.data', res.data);
          onSubmit(res.data);
        })
        .then(() => this.setState({ email: '', password: '' }));
    } 
      
  }

  handleChangeField(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  render() {
    const { email, password } = this.state;

    return (
      <div className="col-12 col-lg-6 offset-lg-3">
        <input
          onChange={ev => this.handleChangeField('email', ev)}
          value={email}
          className="form-control my-3"
          placeholder="Email"
        />
        <textarea
          onChange={ev => this.handleChangeField('password', ev)}
          className="form-control my-3"
          placeholder="Password"
          value={password}
        />
        <button
          onClick={this.handleSubmit}
          className="btn btn-primary float-right"
        >
         Submit
        </button>
      </div>
    );
  }
}

// const mapDispatchToProps = dispatch => ({
//   onSubmit: data => dispatch({ type: 'SUBMIT_LOGIN', data }),
//   onEdit: data => dispatch({ type: 'EDIT_LOGIN', data })
// });

// const mapStateToProps = state => ({
//   articleToEdit: state.home.articleToEdit
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Form);

export default withRouter(Form)