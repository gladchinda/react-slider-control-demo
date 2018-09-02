import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _isBoolean from 'lodash/isBoolean';
import _isFunction from 'lodash/isFunction';
import './index.css';

class SliderControl extends Component {

	constructor(props) {
		super(props);
		const { min, max, value } = this.resolveProps(props);

		this.$rail = React.createRef();
		this.$ball = React.createRef();

		this.state = { min, max, value };
	}

	resolveProps(props) {
		const { min, max, value, rounded } = props;

		const $min = Number.isFinite(min) ? min : 0;
		const $max = (Number.isFinite(max) && max > $min) ? max : 100;

		let $value = Number.isFinite(value)
			? Math.max($min, Math.min(value, $max))
			: $min;

		$value = (!_isBoolean(rounded) || rounded) ? Math.round($value) : $value;

		return { value: $value, max: $max, min: $min };
	}

	refreshBallPosition() {
		const { max, min, value } = this.state;
		const $ballElement = this.$ball.current;

		const { width: $ballWidth } = $ballElement.getBoundingClientRect();
		const { width: $railWidth } = this.$rail.current.getBoundingClientRect();

		$ballElement.style.left = `${(((value - min) / (max - min)) * $railWidth) - ($ballWidth / 2)}px`;
	}

	handleSliding = evt => {
		evt.preventDefault();

		const { max, min } = this.state;
		const { onValueUpdated, rounded } = this.props;
		const $ballElement = this.$ball.current;

		const { width: $ballWidth } = $ballElement.getBoundingClientRect();
		const { width: $railWidth, left: $railLeft } = this.$rail.current.getBoundingClientRect();

		const $ballLeft = Math.max(0, Math.min($railWidth, (evt.clientX - $railLeft)));
		const newValue = (1 - (($railWidth - $ballLeft) / $railWidth)) * (max - min);

		const value = (!_isBoolean(rounded) || rounded) ? Math.round(newValue) : newValue;

		$ballElement.style.left = `${$ballLeft - ($ballWidth / 2)}px`;

		this.setState({ value }, () => {
			_isFunction(onValueUpdated) && onValueUpdated(this.state.value);
		});
	}

	handleMouseDown = (evt) => {
		evt.preventDefault();
		document.addEventListener('mousemove', this.handleSliding, false);
		document.addEventListener('mouseup', this.handleMouseUp, false);
	}

	handleMouseUp = (evt) => {
		evt.preventDefault();
		document.removeEventListener('mousemove', this.handleSliding);
		document.removeEventListener('mouseup', this.handleMouseUp);
	}

	componentDidMount() {
		this.refreshBallPosition();
	}

	componentDidUpdate(prevProps) {
		const { onValueUpdated } = this.props;
		const { min, max, value } = this.resolveProps(this.props);
		const { min: prevMin, max: prevMax, value: prevValue } = this.resolveProps(prevProps);

		if (!(prevMin === min && prevMax === max && prevValue === value)) {

			this.setState({ min, max, value }, () => {
				this.refreshBallPosition();
				_isFunction(onValueUpdated) && onValueUpdated(this.state.value);
			});

		}
	}

	render() {
		return (
			<div className="slider-control">
				<div ref={this.$rail} className="slider-control__rail" onClick={this.handleSliding}></div>
				<div ref={this.$ball} className="slider-control__ball" onMouseDown={this.handleMouseDown}></div>
			</div>
		)
	}

}

SliderControl.propTypes = {
	min: PropTypes.number,
	max: PropTypes.number,
	value: PropTypes.number,
	rounded: PropTypes.bool,
	onValueUpdated: PropTypes.func
};

export default SliderControl;
