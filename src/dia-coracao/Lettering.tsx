import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEART_PATH, beat} from './Heart';
import {C, FONT} from './theme';

export type LetterLine = {
	text: string;
	size: number;
	weight?: 300 | 400 | 600 | 700;
	color?: string;
	/** Rabisco de lápis sublinhando a linha */
	underline?: boolean;
	/** Coração desenhado no lugar do emoji ❤️ */
	heart?: boolean;
	marginTop?: number;
};

const Underline: React.FC<{progress: number}> = ({progress}) => (
	<svg
		viewBox="0 0 200 24"
		preserveAspectRatio="none"
		style={{opacity: progress > 0 ? 1 : 0, position: 'absolute', left: '-3%', width: '106%', bottom: '-0.2em', height: '0.32em', overflow: 'visible'}}
	>
		{['M2 15 C50 5 130 22 198 9', 'M18 20 C80 13 140 21 186 15'].map((d, i) => (
			<path
				key={d}
				d={d}
				fill="none"
				stroke={C.bordo}
				strokeWidth={i ? 2 : 3.5}
				strokeLinecap="round"
				opacity={i ? 0.55 : 0.95}
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - interpolate(progress, [i * 0.3, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
			/>
		))}
	</svg>
);

// Lettering com entrada palavra a palavra e saída em bloco
export const Lettering: React.FC<{
	lines: LetterLine[];
	start: number;
	end: number;
	top: number;
	stagger?: number;
}> = ({lines, start, end, top, stagger = 4}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < start - 1 || frame > end + 20) return null;

	const exit = interpolate(frame, [end, end + 16], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});

	let wordIndex = 0;
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left: 70,
				right: 70,
				textAlign: 'center',
				fontFamily: FONT,
				opacity: 1 - exit,
				transform: `translateY(${-40 * exit}px)`,
			}}
		>
			{lines.map((ln, li) => {
				const words = ln.text.split(' ');
				const lineStart = start + wordIndex * stagger;
				return (
					<div
						key={li}
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center',
							alignItems: 'center',
							columnGap: '0.24em',
							fontSize: ln.size,
							fontWeight: ln.weight ?? 400,
							color: ln.color ?? C.grafite,
							lineHeight: 1.1,
							letterSpacing: '-0.01em',
							marginTop: ln.marginTop ?? 0,
							position: 'relative',
							// o sublinhado acompanha a largura do texto, não do bloco
							width: ln.underline ? 'fit-content' : undefined,
							marginLeft: 'auto',
							marginRight: 'auto',
						}}
					>
						{ln.heart && (
							<svg
								viewBox="-115 -130 230 210"
								style={{
									width: '0.9em',
									height: '0.82em',
									marginRight: '0.08em',
									opacity: interpolate(frame, [lineStart, lineStart + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
									transform: `scale(${1 + 0.12 * beat(frame - lineStart)})`,
								}}
							>
								<path d={HEART_PATH} fill={C.bordo} />
							</svg>
						)}
						{words.map((w) => {
							const local = frame - start - wordIndex * stagger;
							wordIndex++;
							const s = spring({frame: local, fps, config: {damping: 18, stiffness: 140, mass: 0.7}});
							const o = interpolate(local, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
							return (
								<span
									key={`${w}-${wordIndex}`}
									style={{
										display: 'inline-block',
										opacity: o,
										transform: `translateY(${(1 - s) * 34}px)`,
										filter: `blur(${(1 - o) * 6}px)`,
									}}
								>
									{w}
								</span>
							);
						})}
						{ln.underline && (
							<Underline
								progress={interpolate(frame, [start + wordIndex * stagger + 6, start + wordIndex * stagger + 24], [0, 1], {
									extrapolateLeft: 'clamp',
									extrapolateRight: 'clamp',
								})}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
};
