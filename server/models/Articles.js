const mongoose = require('mongoose');

const { Schema } = mongoose;

const ArticlesSchema = new Schema(
  {
    title: String,
    body: String,
    author: String,
    authorId: Schema.Types.ObjectId
  },
  { timestamps: true }
);

ArticlesSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    title: this.title,
    body: this.body,
    author: this.author,
    authorId: this.authorId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Articles', ArticlesSchema);
