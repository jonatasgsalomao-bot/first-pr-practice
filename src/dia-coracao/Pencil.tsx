import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, H, W} from './theme';

// O traço "ferve" (line boil) a cada N frames, como desenho à mão quadro a quadro.
export const BOIL_EVERY = 3;

const PencilFilter: React.FC<{id: string; seedOffset: number}> = ({id, seedOffset}) => {
	const frame = useCurrentFrame();
	const seed = Math.floor(frame / BOIL_EVERY) + seedOffset;
	return (
		<filter id={id} filterUnits="userSpaceOnUse" x={-40} y={-40} width={W + 80} height={H + 80}>
			<feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves={2} seed={seed} result="warp" />
			<feDisplacementMap
				in="SourceGraphic"
				in2="warp"
				scale={5}
				xChannelSelector="R"
				yChannelSelector="G"
				result="wobbly"
			/>
			{/* Grão de grafite: esburaca o traço com ruído fino */}
			<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={1} seed={seed + 11} result="grain" />
			<feColorMatrix
				in="grain"
				type="matrix"
				values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 2.05"
				result="grainAlpha"
			/>
			<feComposite in="wobbly" in2="grainAlpha" operator="in" />
		</filter>
	);
};

// SVG em tela cheia. Tudo que entra aqui ganha traço de lápis, com uma segunda
// passada fantasma deslocada (o "rascunho" por baixo do traço final).
export const PencilCanvas: React.FC<{children: React.ReactNode; opacity?: number}> = ({
	children,
	opacity = 1,
}) => (
	<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, opacity}}>
		<defs>
			<PencilFilter id="lapis" seedOffset={0} />
			<PencilFilter id="lapis-rascunho" seedOffset={53} />
		</defs>
		<g filter="url(#lapis-rascunho)" opacity={0.28} transform="translate(3 -2)">
			{children}
		</g>
		<g filter="url(#lapis)">{children}</g>
	</svg>
);

export const Paper: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: C.papel}}>
		<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
			<defs>
				<filter id="papel-grao" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={4} />
					<feColorMatrix type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.18  0 0 0 0 0.14  0.55 0 0 0 -0.2" />
				</filter>
				<filter id="papel-mancha" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.0035" numOctaves={3} seed={9} />
					<feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.28  0.35 0 0 0 -0.12" />
				</filter>
				<radialGradient id="papel-vinheta" cx="50%" cy="45%" r="75%">
					<stop offset="55%" stopColor="#3c2a20" stopOpacity={0} />
					<stop offset="100%" stopColor="#3c2a20" stopOpacity={0.16} />
				</radialGradient>
			</defs>
			<rect width={W} height={H} filter="url(#papel-mancha)" />
			<rect width={W} height={H} filter="url(#papel-grao)" />
			<rect width={W} height={H} fill="url(#papel-vinheta)" />
		</svg>
	</AbsoluteFill>
);
