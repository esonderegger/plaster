import React from 'react';
import IconButton from 'material-ui/IconButton';
import SvgPlay from 'material-ui/svg-icons/av/play-arrow';
import SvgPause from 'material-ui/svg-icons/av/pause';
import Slider from 'material-ui/Slider';

export default class MaterialAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      duration: 1.0,
      position: 0.0
    };
    this.playPause = this.playPause.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.audioElement = null;
  }
  componentDidMount() {
    var audioElement = this.refs.audioElement;
    var t = this;
    audioElement.addEventListener('durationchange', function() {
      t.setState({duration: audioElement.duration});
    });
    audioElement.addEventListener('timeupdate', function() {
      t.setState({position: audioElement.currentTime});
    });
    audioElement.addEventListener('ended', function() {
      t.setState({playing: false});
    });
    t.audioElement = audioElement;
  }
  zeroPad(n, p, c) {
    var padChar = typeof c === 'undefined' ? '0' : c;
    var pad = new Array(1 + p).join(padChar);
    return (pad + n).slice(-pad.length);
  }
  prettyTime(floatSeconds) {
    if (!parseFloat(floatSeconds)) {
      floatSeconds = 0.0;
    }
    var outStr = '';
    var hours = Math.floor(floatSeconds / 3600);
    floatSeconds -= hours * 3600;
    var minutes = Math.floor(floatSeconds / 60);
    floatSeconds -= minutes * 60;
    if (hours > 0) {
      outStr += hours + ':' + this.zeroPad(minutes, 2) + ':';
    } else {
      outStr += minutes + ':';
    }
    outStr += this.zeroPad(Math.round(floatSeconds), 2);
    return outStr;
  }
  playPause() {
    if (this.audioElement.duration > 0 && !this.audioElement.paused) {
      this.audioElement.pause();
      this.setState({playing: false});
    } else {
      this.audioElement.play();
      this.setState({playing: true});
    }
  }
  handleSlider(event, value) {
    this.audioElement.currentTime = value;
  }
  render() {
    var prettyPosition = this.prettyTime(this.state.position);
    var prettyDuration = this.prettyTime(this.state.duration);
    var outerStyle = {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between'
    };
    var playStyle = {
      left: '-10px',
      marginTop: '8px',
      position: 'relative',
      width: '48px'
    };
    // var playColor = 'rgba(0, 188, 212, .87)';
    var playColor = 'rgba(0, 0, 0, .87)';
    var counterStyle = {
      color: 'rgba(0, 0, 0, .54)',
      fontSize: '12px',
      left: '-16px',
      marginTop: '26px',
      position: 'relative',
      textAlign: 'center',
      width: '82px'
    };
    var sliderStyle = {
      width: 'calc(100% - 130px)'
    };
    return (
      <div style={outerStyle}>
        <div style={playStyle}>
          <IconButton onTouchTap={this.playPause}>
            {this.state.playing ? (
              <SvgPause color={playColor} />
            ) : (
              <SvgPlay color={playColor} />
            )}
          </IconButton>
        </div>
        <div style={counterStyle}>{prettyPosition} / {prettyDuration}</div>
        <div style={sliderStyle}>
          <Slider
            min={0.0}
            max={this.state.duration}
            defaultValue={0.0}
            value={this.state.position}
            onChange={this.handleSlider}
          />
        </div>
        <audio src={this.props.src} ref="audioElement"></audio>
      </div>
    );
  }
}
