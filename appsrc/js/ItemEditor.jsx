import React from 'react';

export default class ItemEditor extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    return (
      <div>
        <h1>{this.props.item.title}</h1>
      </div>
    );
  }
}
