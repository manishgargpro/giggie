import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

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
            subtitle={tile.authorId.name && (
              this.props.loggedInId === tile.authorId._id ?
                "Posted by You" :
                `Posted by ${tile.authorId.name}`
            )
            }
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            {tile.description}
          </CardText>
          <CardActions>
            <RaisedButton
              label={tile.authorId.name ? (
                this.props.loggedInId === tile.authorId._id ?
                  "Delete" :
                  (
                    this.props.loggedInId === tile.workerId ?
                      "Cancel" :
                      "Accept"
                  )
              ) : (
                this.props.loggedInId === tile.authorId ?
                  "Delete" :
                  "Cancel"
              )
              }
              onClick={tile.authorId.name ? (
                this.props.loggedInId === tile.authorId._id ?
                  () => {
                    this.props.deleteFunction(tile._id)
                  } :
                  (
                    this.props.loggedInId === tile.workerId ?
                      () => {
                        this.props.acceptFunction(tile._id, false)
                      } :
                      () => {
                        this.props.acceptFunction(tile._id, true)
                      }
                  )
              ) : (
                this.props.loggedInId === tile.authorId ?
                  () => {
                    this.props.deleteFunction(tile._id)
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