import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Parade} from './Figures';
import {EcgLine, PencilHeart} from './Heart';
import {Lettering} from './Lettering';
import {Paper, PencilCanvas} from './Pencil';
import {C, loadBrandFonts} from './theme';

loadBrandFonts();

export const INTRO_DURATION = 420; // 14s @ 30fps

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const DiaCoracaoIntro: React.FC = () => {
	const frame = useCurrentFrame();

	// Coração nasce no pico do ECG e sobe para o topo
	const move = interpolate(frame, [68, 96], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const heartY = interpolate(move, [0, 1], [470, 300]);
	const heartScale = interpolate(move, [0, 1], [1.25, 0.62]);
	const ecgOpacity = interpolate(frame, [62, 84], [1, 0], clamp);

	const stageStart = 70;
	const stageOpacity = interpolate(frame, [stageStart, stageStart + 18, 388, 408], [0, 1, 1, 0], clamp);
	const heartOpacity = interpolate(frame, [392, 410], [1, 0], clamp);

	return (
		<AbsoluteFill>
			<Paper />
			<PencilCanvas>
				<EcgLine y={520} start={0} dur={34} opacity={ecgOpacity} />
				<PencilHeart id="intro-heart" x={540} y={heartY} scale={heartScale} start={22} opacity={heartOpacity} />
				{frame >= stageStart && (
					<Parade frame={frame - stageStart} groundY={1690} scale={1.05} opacity={stageOpacity} />
				)}
			</PencilCanvas>

			<Lettering
				top={470}
				start={96}
				end={206}
				lines={[
					{text: 'No Dia Mundial', size: 96, weight: 700, color: C.bordo},
					{text: 'do Coração,', size: 96, weight: 700, color: C.bordo},
					{text: 'uma lembrança importante:', size: 62, weight: 400, marginTop: 22},
				]}
			/>

			<Lettering
				top={460}
				start={224}
				end={384}
				lines={[
					{text: 'cuidar do coração', size: 68, weight: 400},
					{text: 'também é colocar', size: 68, weight: 400},
					{text: 'o corpo em', size: 68, weight: 400},
					{text: 'movimento.', size: 132, weight: 700, color: C.bordo, underline: true, marginTop: 4},
				]}
			/>
		</AbsoluteFill>
	);
};
