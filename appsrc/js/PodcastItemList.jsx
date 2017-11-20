import React from 'react';
import ItemInList from './ItemInList.jsx';
import ItemListHeader from './ItemListHeader.jsx';

export default class PodcastItemList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <ItemListHeader />
        {
          this.props.items.map((item, i) => {
            return (
              <ItemInList
                key={item.id}
                item={item}
                setSelected={() => {
                  this.props.setSelectedItem(i);
                }}
              />
            );
          })
        }
      </div>
    );
  }
}
