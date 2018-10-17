export interface StoreState {
  home: Home;
  user: {
    auth: boolean;
  };
}

export interface Home {
  articles: Article[];
  articleToEdit?: Article;
}

export interface Article {
  title: string;
  body: string;
  author: string;
  _id: string;
  createdAt: number;
}

export interface User {
  auth: boolean;
}
