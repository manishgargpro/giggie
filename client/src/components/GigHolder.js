import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'
import {List, ListItem} from 'material-ui/List';

export default class GigHolder extends Component {

  renderList = () => {
    const data = this.props.gigs;
    return (
      data.map((tile) => (
        <Card
          key={tile._id}
          id={tile._id}
        >
          <CardHeader
            title={<h3>{tile.title}</h3>}
            subtitle={
              <div>
                {this.props.loggedInId === tile.authorId._id ?
                  <span>Posted by You</span> :
                  <span>Posted by <a href={`/profile/${tile.authorId._id}`}>{tile.authorId.name}</a></span>
                }
                <br/>
                {tile.workerId &&
                  this.props.loggedInId !== tile.workerId._id &&
                    <span>Accepted By <a href={`/profile/${tile.workerId._id}`}>{tile.workerId.name}</a></span>
                }
              </div>
            }
            actAsExpander={false}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            {tile.description}
            <Card>
              <CardHeader
                title="Comments"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                <List>
                  {tile.comments.map(comment => (
                    <ListItem
                      key={comment._id}
                      primaryText={comment.text}
                      secondaryText={this.props.loggedInId === comment.commentorId._id ?
                        <span>Author: You</span> :
                        <span>Author: <a href={`/profile/${comment.commentorId._id}`}>{comment.commentorId.name}</a></span>
                      }
                      rightIconButton={this.props.loggedInId === comment.commentorId._id ?
                        <RaisedButton
                          label="Delete"
                          onClick={
                            () => {
                              this.props.deleteComment(comment._id, tile._id)
                            }
                          }
                        /> : null
                      }
                    />
                  ))}
                </List>
                <CardActions>
                  <TextField
                    name="text"
                    type="text"
                    multiLine={true}
                    rows={1}
                    value={this.props.text}
                    onChange={this.props.handleInputChange}
                  />
                  <RaisedButton
                    label="Leave a Comment"
                    onClick={() => {
                      this.props.leaveComment(tile._id)
                    }}
                  />
                </CardActions>
              </CardText>
            </Card>
          </CardText>
          <CardActions>
            {!tile.workerId ? (
              this.props.loggedInId === tile.authorId._id ?
                <RaisedButton
                  label="Delete"
                  onClick={() => {
                    this.props.deleteFunction(tile._id, null)
                  }}
                /> :
                <RaisedButton
                  label="Accept"
                  onClick={() => {
                    this.props.acceptFunction(tile._id, true)
                  }}
                />
            ) : (
              this.props.loggedInId === tile.authorId._id ?
                <RaisedButton
                  label="Delete"
                  onClick={() => {
                    this.props.deleteFunction(tile._id, null)
                  }}
                /> :
                this.props.loggedInId === tile.workerId._id ?
                  <RaisedButton
                    label="Cancel"
                    onClick={() => {
                      this.props.acceptFunction(tile._id, false)
                    }}
                  /> :
                  null
            )}
            />
            {this.props.loggedInId === tile.authorId._id && 
              <RaisedButton
                label="Edit"
                onClick={() => this.props.editOpen(true, false, tile._id, tile.title, tile.description, true)}
                id={tile._id}
              />
            }
          </CardActions>
        </Card>
      ))
    )
  }

  render() {
    return (
      <div>
        {this.renderList()}
      </div>
    )
  }

}