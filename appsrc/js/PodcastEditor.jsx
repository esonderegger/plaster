import React from 'react';
const fs = require('fs');
const path = require('path');
import PodcastItemList from './PodcastItemList.jsx';
import ItemEditor from './ItemEditor.jsx';
import ChannelEditor from './ChannelEditor.jsx';

export default class PodcastEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      podcast: null,
      selectedItemIndex: -1,
    };
    this.setSelectedItem = this.setSelectedItem.bind(this);
  }
  componentDidMount() {
    const localPath = path.join(this.props.directory, 'feed.json');
    fs.readFile(localPath, (err, data) => {
      if (err) throw err;
      this.setState({podcast: JSON.parse(data)});
    });
  }
  setSelectedItem(itemIndex) {
    this.setState({selectedItemIndex: itemIndex});
  }
  addItem() {
    const tempFeed = this.state.podcast;
    const newItem = {
      title: '',
    };
    tempFeed.items.push(newItem);
    this.setState({podcast: tempFeed});
  }
  render() {
    const styles = {
      outer: {
        display: 'flex',
        height: '100vh',
      },
      itemList: {
        width: '40%',
        height: '100%',
        overflowY: 'auto',
      },
      editor: {
        width: '60%',
        height: '100%',
      },
    };
    let selectedItem = null;
    if (this.state.selectedItemIndex > -1) {
      selectedItem = (
        <ItemEditor
          item={this.state.podcast.items[this.state.selectedItemIndex]}
        />
      );
    } else if (this.state.podcast) {
      selectedItem = (
        <ChannelEditor podcast={this.state.podcast} />
      );
    }
    return (
      <div style={styles.outer}>
        <div style={styles.itemList}>
          <PodcastItemList
            items={this.state.podcast ? this.state.podcast.items : []}
            setSelectedItem={this.setSelectedItem}
          />
        </div>
        <div style={styles.editor}>
          <div onClick={this.props.goHome}>Home</div>
          {selectedItem}
        </div>
      </div>
    );
  }
}
