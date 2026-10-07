import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export const W = 1080;
export const H = 1920;

// Cores tiradas do logo da Base
export const C = {
	blue: '#2B2BF2',
	pink: '#E96FEA',
	shadow: '#0E129E',
	paper: '#E4E4E0',
	ink: '#151515',
};

export const photo = (name: string) => staticFile(`base/${name}`);

// Recortes de revista: cada letra ganha papel, fonte e giro próprios
const CUTS = [
	{bg: '#B6E36C', fg: C.ink, font: 'Georgia', weight: 700},
	{bg: '#F3EEDD', fg: '#4C9BD0', font: 'Arial Black', weight: 900},
	{bg: '#1E3FA3', fg: '#F3EEDD', font: 'Futura', weight: 800},
	{bg: '#E33B22', fg: C.ink, font: 'Didot', weight: 700},
	{bg: C.ink, fg: '#FFFFFF', font: 'Impact', weight: 400},
	{bg: '#F2C21B', fg: C.ink, font: 'American Typewriter', weight: 700},
	{bg: C.pink, fg: C.shadow, font: 'Rockwell', weight: 700},
	{bg: '#FFFFFF', fg: '#E33B22', font: 'Bodoni 72', weight: 700},
	{bg: C.blue, fg: C.pink, font: 'Copperplate', weight: 700},
];

// Pseudo-aleatório determinístico: o mesmo seed gera sempre o mesmo frame
const rand = (seed: number) => {
	const x = Math.sin(seed * 12.9898) * 43758.5453;
	return x - Math.floor(x);
};

const torn = (seed: number) => {
	const j = (i: number) => (rand(seed + i) * 5).toFixed(1);
	return `polygon(${j(1)}% ${j(2)}%, 50% ${j(3)}%, ${100 - +j(4)}% ${j(5)}%, ${100 - +j(6)}% 50%, ${100 - +j(7)}% ${100 - +j(8)}%, 50% ${100 - +j(9)}%, ${j(10)}% ${100 - +j(11)}%, ${j(12)}% 50%)`;
};

export const Cutout: React.FC<{text: string; size: number; seed?: number; gap?: number}> = ({text, size, seed = 1, gap = 10}) => (
	<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap, flexWrap: 'wrap'}}>
		{[...text].map((ch, i) => {
			const s = seed * 7 + i * 3;
			const cut = CUTS[Math.floor(rand(s) * CUTS.length)];
			const lower = rand(s + 40) > 0.75 && ch !== ch.toLowerCase();
			return (
				<div
					key={i}
					style={{
						filter: 'drop-shadow(4px 6px 5px rgba(0,0,0,0.28))',
						transform: `rotate(${(rand(s + 20) - 0.5) * 14}deg) translateY(${(rand(s + 30) - 0.5) * size * 0.15}px)`,
					}}
				>
					<div
						style={{
							background: cut.bg,
							color: cut.fg,
							fontFamily: `'${cut.font}', Georgia, serif`,
							fontWeight: cut.weight,
							fontSize: size * (0.85 + rand(s + 50) * 0.25),
							lineHeight: 1,
							padding: `${size * 0.1}px ${size * 0.12}px ${size * 0.06}px`,
							clipPath: torn(s),
						}}
					>
						{lower ? ch.toLowerCase() : ch}
					</div>
				</div>
			);
		})}
	</div>
);

// Recriação do logo: letras em bloco, A triangular e extrusão azul-escura
export const Logo: React.FC<{size: number; circle?: boolean}> = ({size, circle = true}) => {
	const word = (fill: string) => (
		<g fill={fill}>
			{/* B */}
			<path d="M0 0 H70 C98 0 108 14 108 30 C108 40 102 48 94 51 C106 55 114 64 114 78 C114 96 102 110 74 110 H0 Z M34 24 V44 H62 C70 44 73 40 73 34 C73 28 70 24 62 24 Z M34 66 V86 H66 C74 86 78 82 78 76 C78 70 74 66 66 66 Z" fillRule="evenodd" />
			{/* A */}
			<path d="M122 110 L182 0 L242 110 Z" />
			{/* S */}
			<path d="M250 0 H350 V28 H290 V41 H336 C354 41 362 52 362 70 V86 C362 102 352 110 336 110 H250 V82 H318 V69 H272 C256 69 250 58 250 44 V22 C250 8 258 0 272 0 Z" />
			{/* E */}
			<path d="M372 0 H474 V28 H408 V42 H464 V68 H408 V82 H474 V110 H372 Z" />
		</g>
	);
	const depth = 16;
	return (
		<div style={{width: size, height: size, borderRadius: '50%', background: circle ? C.blue : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<svg viewBox="-24 -10 510 150" style={{width: size * 0.7, overflow: 'visible'}}>
				{Array.from({length: depth}, (_, i) => (
					<g key={i} transform={`translate(${-i * 1.1} ${i})`}>
						{word(C.shadow)}
					</g>
				))}
				{word(C.pink)}
			</svg>
		</div>
	);
};

export const Polaroid: React.FC<{width: number; rotate?: number; children: React.ReactNode}> = ({width, rotate = 0, children}) => (
	<div
		style={{
			width,
			background: '#F6F6F3',
			padding: `${width * 0.06}px ${width * 0.06}px ${width * 0.24}px`,
			transform: `rotate(${rotate}deg)`,
			boxShadow: '0 30px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(0,0,0,0.06)',
			borderRadius: 6,
		}}
	>
		<div style={{width: '100%', aspectRatio: '0.8', overflow: 'hidden', position: 'relative', background: '#111'}}>{children}</div>
	</div>
);

export const Cover: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => (
	<Img src={photo(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style}} />
);

// Granulado de filme por cima de tudo
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.18}) => (
	<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
		<svg width={W} height={H}>
			<filter id="grain">
				<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#grain)" />
		</svg>
	</AbsoluteFill>
);

export const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', ...style}}>{children}</AbsoluteFill>
);
