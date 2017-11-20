import React from 'react';

export default class ItemListHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const styles = {
      outer: {
        backgroundColor: '#459',
        color: '#fff',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
      },
    };
    return (
      <div style={styles.outer}>
        <div>{'Feed items'}</div>
        <div>{'add'}</div>
      </div>
    );
  }
}
