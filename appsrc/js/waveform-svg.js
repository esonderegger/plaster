import React from 'react';

export default class WaveformSvg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      waveFormHeight: 0,
      waveFormWidth: 0
    };
  }
  componentDidMount() {
    var svgHeight = this.refs.svgParent.offsetHeight;
    var svgWidth = this.refs.svgParent.offsetWidth;
    this.setState({waveFormHeight: svgHeight, waveFormWidth: svgWidth});
  }
  render() {
    var waveFormStyle = {
      backgroundColor: 'rgba(158, 158, 158, .2)',
      height: '40px',
      position: 'absolute',
      top: '13px',
      width: '100%'
    };
    var waveFormPaths = [];
    var svgHeight = 40;
    var svgWidth = this.state.waveFormWidth;
    var numChannels = this.props.waveforms.length;
    for (var i = 0; i < numChannels; i++) {
      var channelHeight = svgHeight / numChannels;
      var halfHeight = channelHeight / 2;
      var startingY = halfHeight + channelHeight * i;
      waveFormPaths.push('M0 ' + startingY);
      for (var j = 0; j < this.props.waveforms[i].length; j++) {
        var sampleX = (parseFloat(j) /
          (this.props.waveforms[i].length - 1)) *
          svgWidth;
        var sampleY = startingY + this.props.waveforms[i][j] * -halfHeight;
        waveFormPaths[i] += ' L ' + sampleX + ' ' + sampleY;
      }
    }
    return (
      <div style={waveFormStyle} ref="svgParent">
        <svg width={svgWidth}
          height="40"
          xmlns="http://www.w3.org/2000/svg">
          {
            waveFormPaths.map(function(waveformPath, i) {
              return (
                <path key={i}
                  d={waveformPath}
                  fill="transparent"
                  stroke="#607D8B"
                />
              );
            })
          }
        </svg>
      </div>
    );
  }
}
