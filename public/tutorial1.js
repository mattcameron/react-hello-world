var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
  	$.ajax({
  		url: this.props.url,
  		dataType: 'json',
  		cache: false,
  		success: function(data) {
  			this.setState({data: data});
  		}.bind(this),
  		error: function(xhr, status, err) {
  			console.error(this.props.url, status, err.toString());
  		}.bind(this)
  	});
  },
  getInitialState: function() {
  	return {data: []}
  },
  componentDidMount: function() {
  	this.loadCommentsFromServer();
  	setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  handleCommentSubmit: function(comment) {
  	console.log('submitting the new comment');
  	var comments = this.state.data;
  	var newComments = comments.concat([comment]);
  	this.setState({data: newComments});
  	$.ajax({
  		url: this.props.url,
  		dataType: 'json',
  		type: "POST",
  		data: comment,
  		success: function(data) {
  			this.setState({data: data});
  		}.bind(this),
  		error: function(xhr, status, err) {
  			console.error(this.props.url, status, err.toString());
  		}.bind(this)
  	});
	},
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment, index) {
			return (
				<Comment author={comment.author} likes={comment.likes} id={comment.id} key={index}>
					{comment.text}
				</Comment>
			);
		});

		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.refs.author.value.trim();
		var text = this.refs.text.value.trim();
		if (!text || !author) {
			return;
		}
		$.ajax({
			url: '/api/comments',
			type: 'GET',
			success: function(data) {
				this.props.onCommentSubmit({id: (data.length +1), author: author, text: text, likes: 0})
			}.bind(this)
		})

		this.refs.author.value = '';
		this.refs.text.value = '';
		return;
	},
	render: function() {
		return (
			<div className="commentForm">
				<hr />
				<h3>Got something to say?</h3>
				<form className="commentForm" onSubmit={this.handleSubmit}>
					<input type="text" placeholder="Your Name" ref="author" />
					<br />
					<input type="text" placeholder="Say something..." ref="text" />
					<input type="submit" value="Post" />
				</form>
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
				<LikeButton likes={this.props.likes} id={this.props.id} />
			</div>
		);
	}
});

var LikeButton = React.createClass({
	onLike: function(e) {
		e.preventDefault();
		this.updateLikes(this.props);
		return;
	},
	updateLikes: function(comment) {
		var newLikes = parseInt(comment.likes) + 1;
		$.ajax({
  		url: '/api/like',
  		dataType: 'json',
  		type: "POST",
  		data: { id: comment.id, likes: newLikes },
  		success: function(data) {
  			this.setState({data: data});
  		}.bind(this),
  		error: function(xhr, status, err) {
  			console.error(this.props.url, status, err.toString());
  		}.bind(this)
  	});
		return;
	},
	render: function() {
		return (
			<div>
				<a href="#" onClick={this.onLike}>Like</a> ({this.props.likes})
			</div>
		);
	}
});


ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);