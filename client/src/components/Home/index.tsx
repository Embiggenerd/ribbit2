import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form } from '../../components/Article';
import { Dispatch } from 'redux';

import { StoreState, Article } from '../../types';

interface OwnProps {}

interface StateProps {
  articles: [Article];
}

interface DispatchProps {
  onLoad: (data: AxiosResponse) => any;
  onDelete: (id: string) => any;
  setEdit: (article: Article) => any;
}

interface State {
  title: string;
  body: string;
  author: string;
}

type Props = OwnProps & DispatchProps & StateProps;

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    const { onLoad } = this.props;
    axios(' /api/articles')
      .then(res => (res.data ? onLoad(res.data) : {}))
      .catch(e => console.log(e));
  }

  handleDelete(id: string) {
    const { onDelete } = this.props;
    // test this to see if backend delete fail results in front end delete success
    return axios.delete(`/api/articles/${id}`).then(() => onDelete(id));
  }

  handleEdit(article: Article) {
    const { setEdit } = this.props;

    setEdit(article);
  }

  render() {
    const { articles } = this.props;
    return (
      <div className="col">
        <div className="container-fluid">
          <div className="content">
            <div className="row pt-5">
              <div className="col-12 col-lg-6 offset-lg-3">
                <h1 className="text-center">Submit an article!</h1>
              </div>
              <Form />
            </div>

            <div className="row pt-5">
              <div className="col-12 col-lg-6 offset-lg-3">
                {articles.map(article => {
                  return (
                    <div key={article._id} className="card my-3">
                      <div className="card-header">{article.title}</div>
                      <div className="card-body">
                        {article.body}
                        <p className="mt-5 text-muted">
                          <b>{article.author}</b>{' '}
                          {moment(new Date(article.createdAt)).fromNow()}
                        </p>
                      </div>

                      <div className="card-footer">
                        <div className="row">
                          <button
                            onClick={() => this.handleEdit(article)}
                            className="btn btn-primary mx-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => this.handleDelete(article._id)}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState) => ({
  articles: state.home.articles
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onLoad: (data: AxiosResponse) => {
    dispatch({ type: 'HOME_PAGE_LOADED', data });
  },
  onDelete: (id: string) => dispatch({ type: 'DELETE_ARTICLE', id }),
  setEdit: (article: Article) => dispatch({ type: 'SET_EDIT', article })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
