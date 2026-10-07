import React from 'react';
import { Img, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// A entrada precisa estar resolvida no frame 25: o material de destino e rapido.
// O spring so retorna exatamente 1 a partir de durationInFrames + 1, entao 24 trava
// a escala em 1.0 ja no frame 25 — em 0.99x a imagem reamostra e sai levemente borrada.
const ENTRY_FRAMES = 24;

type AnimationProps = {
	imageSrc: string;
};

type Effect = 'pop' | 'slide' | 'bounce';

export const PopAnimation: React.FC<AnimationProps> = ({ imageSrc }) => (
	<AnimatedImage imageSrc={imageSrc} effect="pop" />
);

export const SlideAnimation: React.FC<AnimationProps> = ({ imageSrc }) => (
	<AnimatedImage imageSrc={imageSrc} effect="slide" />
);

export const BounceAnimation: React.FC<AnimationProps> = ({ imageSrc }) => (
	<AnimatedImage imageSrc={imageSrc} effect="bounce" />
);

const AnimatedImage: React.FC<{ imageSrc: string; effect: Effect }> = ({
	imageSrc,
	effect,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Vai de 0 a 1 dentro de ENTRY_FRAMES e passa de 1 no meio do caminho,
	// e esse overshoot e o que da o estalo. Depois estabiliza e segura.
	const entry = spring({
		frame,
		fps,
		durationInFrames: ENTRY_FRAMES,
		config: { damping: 12, stiffness: 90, mass: 1 },
	});

	const opacity = interpolate(frame, [0, 4], [0, 1], {
		extrapolateRight: 'clamp',
	});

	let scale = 1;
	let rotate = 0;
	let translateX = 0;
	let translateY = 0;

	if (effect === 'pop') {
		scale = interpolate(entry, [0, 1], [0.2, 1]);
		rotate = interpolate(entry, [0, 1], [-12, 0]);
	} else if (effect === 'slide') {
		translateX = interpolate(entry, [0, 1], [-450, 0]);
		rotate = interpolate(entry, [0, 1], [-8, 0]);
	} else {
		translateY = interpolate(entry, [0, 1], [-400, 0]);
		scale = interpolate(entry, [0, 1], [0.7, 1]);
	}

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Img
				src={imageSrc}
				style={{
					// Caixa fixa em vez de so largura: as artes misturam paisagem e
					// retrato, e sem limitar a altura a retrato entra 3x maior.
					width: 900,
					height: 760,
					objectFit: 'contain',
					transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
					opacity,
					filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.2))',
				}}
			/>
		</div>
	);
};
