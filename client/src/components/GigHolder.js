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
            title={tile.title}
            subtitle={this.props.loggedInId === tile.authorId._id ?
                "Posted by You" :
                `Posted by ${tile.authorId.name}`
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
                      secondaryText={`Author: ${comment.commentorId.name}`}
                      rightIconButton={this.props.loggedInId === comment.commentorId._id &&
                        <RaisedButton
                          label="Delete"
                          onClick={
                            () => {
                              this.props.deleteComment(comment._id, tile._id)
                            }
                          }
                        />
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
                    this.props.deleteFunction(tile._id, tile.workerId)
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