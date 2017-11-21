import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

export default class GigHolder extends Component {

  renderList = () => {
    const data = this.props.tilesData;
    if (data) {
      return (
        data.map((tile) => (
          <Card
            key={tile._id}
            id={tile._id}
          >
            <CardHeader
              title={tile.title}
              subtitle={`Posted by ${this.props.subtitle}`}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardActions>
              <RaisedButton
                label="Delete"
                onClick={() => {
                  this.props.onClick(tile._id)
                }}
              />
            </CardActions>
            <CardText expandable={true}>
              {tile.description}
            </CardText>
          </Card>
        ))
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderList()}
      </div>
    )
  }

}