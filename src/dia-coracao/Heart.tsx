import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from './theme';

export const HEART_PATH =
	'M0 70 C-14 58 -104 2 -104 -52 C-104 -104 -44 -124 0 -74 C44 -124 104 -104 104 -52 C104 2 14 58 0 70 Z';

// Batida "tum-tum" (0..1) num ciclo de `period` frames
export const beat = (frame: number, period = 32) => {
	const t = (((frame % period) + period) % period) / period;
	const pulse = (c: number, w: number) => Math.exp(-((t - c) ** 2) / (2 * w * w));
	return pulse(0.1, 0.035) + 0.6 * pulse(0.28, 0.04);
};

const draw = (frame: number, start: number, dur: number) =>
	interpolate(frame, [start, start + dur], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});

export const PencilHeart: React.FC<{
	id: string;
	x: number;
	y: number;
	scale: number;
	start: number;
	drawDur?: number;
	opacity?: number;
}> = ({id, x, y, scale, start, drawDur = 26, opacity = 1}) => {
	const frame = useCurrentFrame();
	const d = draw(frame, start, drawDur);
	const fill = draw(frame, start + drawDur * 0.7, 14);
	const s = scale * (1 + 0.09 * beat(frame - start - drawDur) * fill);
	const hatch = [];
	for (let i = -260; i <= 260; i += 17) hatch.push(`M${i - 130} -130 L${i + 130} 130`);
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
			<defs>
				<clipPath id={id}>
					<path d={HEART_PATH} />
				</clipPath>
			</defs>
			<path d={HEART_PATH} fill={C.papel} opacity={fill} />
			<g clipPath={`url(#${id})`} opacity={fill}>
				<path d={hatch.join(' ')} stroke={C.bordo} strokeWidth={7} strokeLinecap="round" />
			</g>
			<path
				d={HEART_PATH}
				fill="none"
				stroke={C.bordo}
				strokeWidth={10}
				strokeLinejoin="round"
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - d}
			/>
		</g>
	);
};

// Linha de batimento (ECG) desenhada a lápis
export const EcgLine: React.FC<{y: number; start: number; dur: number; opacity?: number}> = ({
	y,
	start,
	dur,
	opacity = 1,
}) => {
	const frame = useCurrentFrame();
	const d = draw(frame, start, dur);
	const path = `M40 ${y} H330 l24 -22 l24 22 H440 l18 36 l30 -210 l30 250 l18 -76 H640 q34 -56 68 0 H1040`;
	return (
		<path
			d={path}
			fill="none"
			stroke={C.grafite}
			strokeWidth={8}
			strokeLinejoin="round"
			strokeLinecap="round"
			pathLength={1}
			strokeDasharray={1}
			strokeDashoffset={1 - d}
			opacity={opacity}
		/>
	);
};
