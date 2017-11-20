import React from 'react';

export default class ItemInList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const styles = {
      outer: {
        padding: '1rem',
        borderBottom: '1px solid #ddd',
      },
      title: {
        fontSize: '13px',
        fontWeight: '100',
        paddingBottom: '8px',
      },
      moreInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
      },
    };
    return (
      <div
        style={styles.outer}
        onClick={this.props.setSelected}
      >
        <div style={styles.title}>
          {this.props.item.title}
        </div>
        <div style={styles.moreInfo}>
          <div>Pubdate goes here</div>
          <div>0:00</div>
        </div>
      </div>
    );
  }
}
