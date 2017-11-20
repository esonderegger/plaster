import React from 'react';
import TextField from 'material-ui/TextField';

export default class ChannelEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    console.log(props);
  }
  handleTextFieldChange(e) {
    this.props.handleChange(e.target.name, e.target.value);
  }
  render() {
    console.log(this.props.podcast);
    const styles = {
      outer: {
        padding: '1rem',
      },
    };
    const channelFields = [
      {id: 'title', name: 'Title', desc: 'The name of this podcast'},
      {id: 'subtitle', name: 'Subtitle', desc: 'The subtitle of this podcast'},
      {
        id: 'home_page_url',
        name: 'Link',
        desc: 'The url of this podcast\'s website',
      },
    ];
    return (
      <div
        style={styles.outer}
      >
        {
          channelFields.map((field, i) => {
            return (
              <TextField
                key={field.id}
                hintText={field.desc}
                floatingLabelText={field.name}
                name={field.id}
                fullWidth={true}
                value={this.props.podcast[field.id]}
                onChange={this.handleTextFieldChange}
              />
            );
          })
        }
      </div>
    );
  }
}
