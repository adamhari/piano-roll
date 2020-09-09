import React, {useEffect, useRef, useState} from 'react';
import WaveformData from 'waveform-data';
import {getWaveformFromArrayBuffer} from '../js/utils';
import {usePrevious} from '../js/hooks';

type Props = {
	sampleUrl?: string;
};

const Waveform = ({sampleUrl}: Props) => {
	const prevSampleUrl = usePrevious(sampleUrl);
	const [waveformData, setWaveformData] = useState<WaveformData>();
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// RESPOND TO URL PROP CHANGE BY PROCESSING WAVEFORM DATA INTO STATE
	useEffect(() => {
		const handleNewSampleUrl = async () => {
			if (sampleUrl) {
				const fileFromUrl = await fetch(sampleUrl);
				const waveformData = await getWaveformFromArrayBuffer(await fileFromUrl.arrayBuffer());
				setWaveformData(waveformData);
			}
		};
		sampleUrl !== prevSampleUrl && handleNewSampleUrl();
	}, [prevSampleUrl, sampleUrl]);

	// RESPOND TO WAVEFORM STATE CHANGE BY RE-DRAWING THE CANVAS
	useEffect(() => {
		const clearCanvas = () => (canvasRef.current ? (canvasRef.current.width += 0) : null);

		const scaleY = (amplitude: number, height: number) => {
			const range = 256;
			const offset = 128;

			return height - ((amplitude + offset) * height) / range + 0.5;
		};

		const getContextForWaveform = (canvas: HTMLCanvasElement): CanvasRenderingContext2D | null => {
			const ctx = canvas.getContext('2d');

			if (ctx) {
				ctx.strokeStyle = '#ff2601';
				ctx.fillStyle = 'rgba(255, 38, 1, 1)';
				ctx.shadowColor = 'rgba(255, 38, 1, 0.5)';
				ctx.shadowBlur = 6;
				ctx.filter = 'drop-shadow(0 0 0.25rem rgba(255, 38, 1, 0.5))';
			}

			return ctx;
		};

		const drawWaveformOnCanvas = () => {
			const canvas = canvasRef.current;

			if (canvas && waveformData) {
				const ctx = getContextForWaveform(canvas);

				if (ctx) {
					ctx.beginPath();

					let lineXPos = 0;

					// Loop forwards, drawing the upper half of the waveform
					for (let x = 0; x < waveformData.length; x++) {
						ctx.lineTo(lineXPos, scaleY(waveformData.channel(0).max_sample(x), canvas.height));
						lineXPos += canvas.width / waveformData.length;
					}

					// Loop backwards, drawing the lower half of the waveform
					for (let x = waveformData.length - 1; x >= 0; x--) {
						ctx.lineTo(lineXPos, scaleY(waveformData.channel(0).min_sample(x), canvas.height));
						lineXPos -= canvas.width / waveformData.length;
					}

					ctx.closePath();
					ctx.stroke();
					ctx.fill();
				}
			}
		};

		clearCanvas();
		drawWaveformOnCanvas();
	}, [waveformData]);

	console.log('WAVEFORM DATA', waveformData);

	return (
		<div className='waveform-container'>
			<div className='waveform'>
				<canvas id='waveform-canvas' ref={canvasRef} width='250' />
			</div>
		</div>
	);
};

export default Waveform;
