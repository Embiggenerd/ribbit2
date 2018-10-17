import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState, Article } from '../../../types';

/*
* Form's values are bound to state.
* If articleToEdit is passed in props, we state the state's values to articleToEdit's values
* This set's the form's values, and allows us to send patch request to server
* because the submit/update button invokes post/patch request depending on if articleToEdit's truthiness*/

interface StateProps {
  articleToEdit: Article;
}

interface DispatchProps {
  onSubmit: (data: AxiosResponse) => any;
  onEdit: (data: AxiosResponse) => any;
}

interface OwnProps {}

interface State {
  title: string;
  body: string;
  author: string;
}

type StateKeys = keyof State;

type Props = StateProps & DispatchProps & OwnProps;

class Form extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      author: ''
    };

    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.articleToEdit) {
      this.setState({
        title: nextProps.articleToEdit.title,
        body: nextProps.articleToEdit.body,
        author: nextProps.articleToEdit.author
      });
    }
  }

  handleSubmit() {
    const { onSubmit, articleToEdit, onEdit } = this.props;
    const { title, body, author } = this.state;

    if (!articleToEdit) {
      return axios
        .post('/api/articles', {
          title,
          body,
          author
        })
        .then(res => {
          return onSubmit(res.data);
        })
        .then(() => this.setState({ title: '', body: '', author: '' }));
    } else {
      return axios
        .patch(`/api/articles/${articleToEdit._id}`, {
          title,
          body,
          author
        })
        .then(res => onEdit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '' }));
    }
  }

  handleChangeField(key: StateKeys, event: { target: { value: string } }) {
    this.setState({
      [key]: event.target.value
    } as Pick<State, keyof State>);
  }

  render() {
    const { title, body, author } = this.state;
    const { articleToEdit } = this.props;

    return (
      <div className="col-12 col-lg-6 offset-lg-3">
        <input
          onChange={ev => this.handleChangeField('title', ev)}
          value={title}
          className="form-control my-3"
          placeholder="Article Title"
        />
        <textarea
          onChange={ev => this.handleChangeField('body', ev)}
          className="form-control my-3"
          placeholder="Article Body"
          value={body}
        />
        <input
          onChange={ev => this.handleChangeField('author', ev)}
          value={author}
          className="form-control my-3"
          placeholder="Article Author"
        />
        <button
          onClick={this.handleSubmit}
          className="btn btn-primary float-right"
        >
          {articleToEdit ? 'Update' : 'Submit'}
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSubmit: (data: AxiosResponse) => dispatch({ type: 'SUBMIT_ARTICLE', data }),
  onEdit: (data: AxiosResponse) => dispatch({ type: 'EDIT_ARTICLE', data })
});

const mapStateToProps = (state: StoreState) => ({
  articleToEdit: state.home.articleToEdit
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
