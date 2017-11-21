import React, { Component } from 'react';
import { GridList, GridTile } from 'material-ui/GridList';

export default class GigHolder extends Component {

  renderList = () => {
    const data = this.props.tilesData;
    if (data) {
      return (
        <GridList>
          {data.map((tile) => (
            <GridTile
              key={tile._id}
              id={tile._id}
              title={tile.title}
              subtitle={this.props.subtitle}
            />
          ))}
        </GridList>
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