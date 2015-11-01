var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});

var CommentList = React.createClass({
	render: function() {
		return (
			<div className="commentList">
				<Comment author="Matt Cameron">This is a comment.</Comment>
				<Comment author="Neil Armstrong">This is **another** comment.</Comment>
			</div>
		);
	}
});

var CommentForm = React.createClass({
	render: function() {
		return (
			<div className="commentForm">
				And I am a commentForm.
			</div>
		);
	}
});

var Comment = React.createClass({
	rawMarkup: function() {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return { __html: rawMarkup };
	},

	render: function() {
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<span dangerouslySetInnerHTML={this.rawMarkup()} />
				<LikeButton />
			</div>
		);
	}
});

var LikeButton = React.createClass({
	render: function() {
		return (
			<a href="#"> Like</a>
		);
	}
});


ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);