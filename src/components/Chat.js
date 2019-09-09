import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { connect } from "react-redux";
import { likeChat, unlikeChat } from "../redux/actions/dataActions";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import DeleteChat from "./DeleteChat";
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 200,
    objectFit: "contain"
  },
  content: {
    padding: 25
  }
};

class Chat extends Component {
  likedChat = () => {
    return (
      this.props.user.likes &&
      this.props.user.likes.find(like => like.chatId === this.props.chat.chatId)
    );
  };

  likeChat = () => {
    this.props.likeChat(this.props.chat.chatId);
  };

  unlikeChat = () => {
    this.props.unlikeChat(this.props.chat.chatId);
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      chat: {
        body,
        createdAt,
        userImage,
        userHandle,
        chatId,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;

    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </MyButton>
    ) : this.likedChat() ? (
      <MyButton tip="unlike" onClick={this.unlikeChat}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="like" onClick={this.likeChat}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );
    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteChat chatId={chatId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="Profile image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
          <span>{likeCount} Likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments</span>
        </CardContent>
      </Card>
    );
  }
}

Chat.propTypes = {
  likeChat: PropTypes.func.isRequired,
  unlikeChat: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likeChat,
  unlikeChat
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Chat));
