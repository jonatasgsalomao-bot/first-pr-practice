import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {C, Center, Cover, Cutout, Grain, Logo, Polaroid, photo} from './parts';

// 01 — VOCÊ: recortes no papel claro, apontando pra quem assiste
export const Voce: React.FC = () => (
	<AbsoluteFill style={{background: C.paper}}>
		<Center style={{gap: 80}}>
			<Cutout text="VOCÊ" size={210} seed={3} />
			<div style={{fontSize: 260, lineHeight: 1}}>🫵</div>
		</Center>
		<Grain opacity={0.25} />
	</AbsoluteFill>
);

// 02 — NÃO: foto do culto escurecida com letreiro gigante
export const Nao: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<Cover src="culto.jpg" style={{filter: 'grayscale(0.3) brightness(0.55) contrast(1.15)'}} />
		<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(43,43,242,0.35), rgba(0,0,0,0) 45%, rgba(233,111,234,0.25))`}} />
		<Center>
			<div style={{fontFamily: 'Impact, sans-serif', fontSize: 470, color: '#fff', lineHeight: 0.9, transform: 'rotate(-5deg)', textShadow: `14px 14px 0 ${C.pink}`}}>NÃO</div>
		</Center>
		<Grain opacity={0.3} />
	</AbsoluteFill>
);

// 03 — PODE: fundo azul do logo, letras rosa com extrusão
export const Pode: React.FC = () => {
	const layers = Array.from({length: 22}, (_, i) => `${-i}px ${i}px 0 ${C.shadow}`).join(', ');
	return (
		<AbsoluteFill style={{background: C.blue}}>
			<Center>
				<div style={{fontFamily: "'Arial Black', sans-serif", fontSize: 330, color: C.pink, letterSpacing: -10, transform: 'rotate(-4deg)', textShadow: layers}}>PODE</div>
			</Center>
			<Grain opacity={0.22} />
		</AbsoluteFill>
	);
};

// 04 — PERDER: arte enviada, só com granulado para casar com o resto
export const Perder: React.FC = () => (
	<AbsoluteFill>
		<Img src={photo('perder.jpg')} style={{width: '100%', height: '100%'}} />
		<Grain opacity={0.2} />
	</AbsoluteFill>
);

// 05 — A: rosa, polaroid do palco e um "A" recortado por cima
export const A: React.FC = () => (
	<AbsoluteFill style={{background: C.pink}}>
		<Center>
			<Polaroid width={720} rotate={5}>
				<Cover src="palco.jpg" />
			</Polaroid>
		</Center>
		<AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0 0 330px 150px'}}>
			<Cutout text="A" size={330} seed={6} />
		</AbsoluteFill>
		<Grain opacity={0.22} />
	</AbsoluteFill>
);

// 06 — BASE!!!: polaroid com o logo sobre as luzes do culto desfocadas
export const Base: React.FC = () => (
	<AbsoluteFill style={{background: '#0B0B14'}}>
		<Cover src="luzes.jpg" style={{filter: 'blur(26px) brightness(0.55) saturate(1.3)', transform: 'scale(1.15)'}} />
		<Center style={{gap: 70}}>
			<Polaroid width={760} rotate={-4}>
				<Cover src="luzes.jpg" style={{filter: 'blur(14px) brightness(0.4)', transform: 'scale(1.2)'}} />
				<Center>
					<Logo size={470} />
				</Center>
			</Polaroid>
			<Cutout text="!!!" size={200} seed={5} gap={22} />
		</Center>
		<Grain opacity={0.28} />
	</AbsoluteFill>
);

// 07 — Espiral hipnótica nas cores da Base, para fechar como na referência
export const Hipnose: React.FC = () => {
	const rings = 26;
	return (
		<AbsoluteFill style={{background: C.blue}}>
			<svg viewBox="-540 -960 1080 1920" width="100%" height="100%">
				{Array.from({length: rings}, (_, i) => (
					<circle key={i} r={(rings - i) * 44} fill={i % 2 ? C.pink : C.blue} />
				))}
			</svg>
			<Center>
				<Logo size={330} />
			</Center>
			<Grain opacity={0.2} />
		</AbsoluteFill>
	);
};

// Espiral de Arquimedes com dois braços: faixa rosa entre r=bθ e r=b(θ+π)
const B = 14;
const spiralPath = (() => {
	const max = 1200 / B;
	const outer: string[] = [];
	const inner: string[] = [];
	for (let t = 0; t <= max; t += 0.04) {
		outer.push(`${(B * t * Math.cos(t)).toFixed(1)} ${(B * t * Math.sin(t)).toFixed(1)}`);
		const r = B * (t + Math.PI);
		inner.unshift(`${(r * Math.cos(t)).toFixed(1)} ${(r * Math.sin(t)).toFixed(1)}`);
	}
	return `M${outer.join(' L')} L${inner.join(' L')} Z`;
})();

export const HIPNOSE_FRAMES = 240;
// Uma volta por segundo; 240 frames = 8 voltas, então o vídeo fecha em loop perfeito
const TURN = 30;

export const HipnoseVideo: React.FC = () => {
	const frame = useCurrentFrame();
	// Logo pulsa uma vez por volta (período divide 240, mantém o loop)
	const pulse = 1 + 0.14 * (0.5 - 0.5 * Math.cos((frame / TURN) * 2 * Math.PI));
	return (
		<AbsoluteFill style={{background: C.blue}}>
			<svg viewBox="-540 -960 1080 1920" width="100%" height="100%">
				<path d={spiralPath} fill={C.pink} transform={`rotate(${(frame / TURN) * 360})`} />
			</svg>
			<Center>
				<div style={{transform: `scale(${pulse})`}}>
					<Logo size={330} />
				</div>
			</Center>
			<Grain opacity={0.2} />
		</AbsoluteFill>
	);
};

export const FRAMES = [
	{id: '01-Voce', component: Voce},
	{id: '02-Nao', component: Nao},
	{id: '03-Pode', component: Pode},
	{id: '04-Perder', component: Perder},
	{id: '05-A', component: A},
	{id: '06-Base', component: Base},
	{id: '07-Hipnose', component: Hipnose},
];
