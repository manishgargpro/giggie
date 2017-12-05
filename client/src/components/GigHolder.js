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
                <span>
                  {this.props.loggedInId === tile.authorId._id ?
                  "Posted by You" :
                  `Posted by ${tile.authorId.name}`}
                </span>
                <br/>
                <span>
                  {this.props.loggedInId === tile.authorId._id &&
                    tile.workerId &&
                      `Accepted By ${tile.workerId.name}`
                  }
                </span>
              </div>
            }
            actAsExpander={true}
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
                      secondaryText={`Author: ${this.props.loggedInId === comment.commentorId._id ?
                        "You" :
                        comment.commentorId.name
                      }`}
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
            <RaisedButton
              label={!tile.workerId ? (
                this.props.loggedInId === tile.authorId._id ?
                  "Delete" :
                  "Accept"
              ) : (
                this.props.loggedInId === tile.authorId._id ?
                  "Delete" :
                  "Cancel"
              )
              }
              onClick={!tile.workerId ? (
                this.props.loggedInId === tile.authorId._id ?
                  () => {
                    this.props.deleteFunction(tile._id, null)
                  } :
                  () => {
                    this.props.acceptFunction(tile._id, true)
                  }
              ) : (
                this.props.loggedInId === tile.authorId._id ?
                  () => {
                    this.props.deleteFunction(tile._id, tile.workerId)
                  } :
                  () => {
                    this.props.acceptFunction(tile._id, false)
                  }
              )
              }
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