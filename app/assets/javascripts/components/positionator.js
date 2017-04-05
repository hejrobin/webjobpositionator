import React, {Component} from 'react';
import prefixes from '../data/prefixes';
import suffixes from '../data/suffixes';
import positions from '../data/positions';

export default class Positionator extends Component {

  state = {
    position: 'Frontend Evangelist'
  }

  constructor(newProps) {
    super(newProps);
    this.generate = ::this.generate;
  }

  componentDidMount() {
    this.generate();
  }

  pick(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  generate() {
    let prefix = this.pick(prefixes);
    let suffix = this.pick(suffixes);
    let position = this.pick(positions);
    this.setState({
      position: `${prefix} ${position} ${suffix}`
    });
  }

  render() {
    return (
      <article>
        <p>Some fkn <strong>recruitment agency</strong> looking for a&hellip;</p>
        <h1 data-position={this.state.position}>{this.state.position}</h1>
        <button onClick={this.generate}>Nah, another career plz</button>
      </article>
    )
  }

}
