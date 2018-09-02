import React, { Component } from 'react';
import SliderControl from './components/SliderControl';

function hslToHex([h, s, l]) {

	const H = (h % 360) / 60;
	const C = (1 - Math.abs((2 * l) - 1)) * s;
	const X = C * (1 - Math.abs((H % 2) - 1));

	const modH = H % 2;
	const divH = Math.floor(H / 2);

	let [r, g, b] = (modH >= 0 && modH <= 1)
		? [C, X, 0]
		: (modH >= 1 && modH <= 2) ? [X, C, 0] : [0, 0, 0];

	[r, g, b] = (divH > 1)
		? [g, b, r]
		: (divH > 0) ? [b, r, g] : [r, g, b];

	const m = l - (C / 2);

	return [r, g, b]
		.map(v => (Math.round((v + m) * 255)).toString(16))
		.map(v => (v.length === 1) ? `0${v}` : v)
		.join('');

}

class App extends Component {

	state = { hue: 180, saturation: 50, lightness: 50 }

	handleSliderValueUpdate = stateProp => value => {
		const { [stateProp]: oldValue } = this.state;

		if (oldValue !== value) {
			return this.setState({ [stateProp]: value });
		}
	}

  render() {
		const { hue, saturation, lightness } = this.state;
		const hexColor = `#${ hslToHex([ hue, (saturation / 100), (lightness / 100) ]) }`;

		const controls = [
			{ min: 0, max: 360, value: hue, label: 'Hue' },
			{ min: 0, max: 100, value: saturation, label: 'Saturation' },
			{ min: 0, max: 100, value: lightness, label: 'Lightness' }
		];

		const colorBoxStyles = {
			width: 150,
			borderRadius: 15,
			background: `hsl(${hue}, ${saturation}%, ${lightness}%)`
		};

		const hexColorStyles = {
			top: -50,
			letterSpacing: 3
		};

		const labelStyles = {
			top: 2,
			width: 100,
			letterSpacing: 1
		};

    return (
			<div className="my-5 py-5 w-100 d-flex justify-content-center">

				<div className="position-relative my-5 mr-5" style={colorBoxStyles}>
					<div className="position-absolute w-100 h3 text-center text-dark font-weight-light text-uppercase" style={hexColorStyles}>{ hexColor }</div>
				</div>

				<div className="py-5 position-relative d-flex flex-column justify-content-between align-items-center">
					{ controls.map((control, index) => {
						const { label, value, ...restProps } = control;
						const updater = this.handleSliderValueUpdate(label.toLowerCase());
						const valueUnit = (label.toLowerCase() === 'hue') ? String.fromCharCode(176) : '%';

						return (
							<div key={index} className="d-flex align-items-center py-3">
								<SliderControl rounded value={value} onValueUpdated={updater} {...restProps} />

								<span className="small d-inline-block text-secondary position-relative pl-3" style={labelStyles}>
									<span>{ label }</span>
									<span className="text-dark px-2">({ `${value}${valueUnit}` })</span>
								</span>
							</div>
						)
					}) }
				</div>

			</div>
    );
	}

}

export default App;
