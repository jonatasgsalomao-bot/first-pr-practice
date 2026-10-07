import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Parade} from './Figures';
import {PencilHeart} from './Heart';
import {Lettering} from './Lettering';
import {Paper, PencilCanvas} from './Pencil';
import {C, H, W, loadBrandFonts} from './theme';

loadBrandFonts();

// Logo 480px de largura na escala 1.0 → 1.33 (proporção do SVG 1420.75 × 1644)
const LOGO_SCALE = 1.33;
const LOGO_W = 480 * LOGO_SCALE;
const LOGO_H = (LOGO_W * 1644) / 1420.75;

export const FINAL_DURATION = 690; // 23s @ 30fps

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Props = {showAns: boolean};

export const DiaCoracaoFinal: React.FC<Props> = ({showAns}) => {
	const frame = useCurrentFrame();

	const stageOpacity = interpolate(frame, [0, 18, 575, 590], [0, 1, 1, 0], clamp);
	const smallHeart = interpolate(frame, [422, 440], [1, 0], clamp);
	const bigHeart = interpolate(frame, [440, 441], [0, 1], clamp);

	// Fundo bordô abre em círculo a partir do coração
	const REVEAL = 565;
	const reveal = interpolate(frame, [REVEAL, REVEAL + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const logoIn = interpolate(frame, [REVEAL + 20, REVEAL + 44], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const ansIn = interpolate(frame, [REVEAL + 40, REVEAL + 56], [0, 1], clamp);

	return (
		<AbsoluteFill>
			<Paper />
			<PencilCanvas>
				<Parade frame={frame + 40} groundY={1700} scale={0.95} opacity={stageOpacity} firstX={900} />
				<PencilHeart id="final-heart-sm" x={540} y={290} scale={0.55} start={4} opacity={smallHeart} />
				<PencilHeart id="final-heart-lg" x={540} y={560} scale={1.35} start={440} opacity={bigHeart} />
			</PencilCanvas>

			<Lettering
				top={440}
				start={20}
				end={246}
				stagger={3}
				lines={[
					{text: 'Neste Dia Mundial', size: 84, weight: 700, color: C.bordo},
					{text: 'do Coração,', size: 84, weight: 700, color: C.bordo},
					{text: 'encontre o seu jeito', size: 60, marginTop: 20},
					{text: 'de se movimentar e cuidar', size: 60},
					{text: 'de quem está com você', size: 60},
					{text: 'em todos os momentos.', size: 60, weight: 600},
				]}
			/>

			<Lettering
				top={470}
				start={266}
				end={420}
				stagger={3}
				lines={[
					{text: 'E lembre-se:', size: 88, weight: 700, color: C.bordo, underline: true},
					{text: 'antes de iniciar uma', size: 60, marginTop: 34},
					{text: 'atividade física, procure', size: 60},
					{text: 'orientação de um', size: 60},
					{text: 'profissional de saúde.', size: 60, weight: 600},
				]}
			/>

			<Lettering
				top={780}
				start={462}
				end={562}
				stagger={7}
				lines={[
					{text: 'Dia Mundial do Coração', size: 58, weight: 600, color: C.bordo},
					{text: 'Movimente-se.', size: 96, weight: 700, marginTop: 36},
					{text: 'Cuide-se.', size: 96, weight: 700},
					{text: 'Viva melhor.', size: 96, weight: 700, color: C.bordo, underline: true},
				]}
			/>

			{/* Assinatura: mesmo fundo e posição de logo da vinheta SAUD0166 */}
			<AbsoluteFill style={{clipPath: `circle(${reveal * 2300}px at 540px 560px)`}}>
				{/* Degradê diagonal: vinho escuro no alto à esquerda → bordô claro embaixo à direita */}
				<AbsoluteFill
					style={{
						background: `radial-gradient(ellipse 90% 70% at 100% 85%, rgba(150, 38, 70, 0.55) 0%, rgba(150, 38, 70, 0) 70%),
							linear-gradient(150deg, #40001c 0%, #54032a 35%, #6e0f33 65%, #86203d 100%)`,
					}}
				/>
				<Img
    src={staticFile('dia-coracao/logo-branco.svg')}
    style={{
        position: 'absolute',
        width: LOGO_W,
        left: (W - LOGO_W) / 2,
        top: 960 - LOGO_H / 2,
        opacity: logoIn,
        transform: `scale(${0.92 + 0.08 * logoIn})`,
        filter: `blur(${(1 - logoIn) * 10}px)`,
        scale: 1.1
    }}
/>
				{showAns && (
					<Img
    src={staticFile('dia-coracao/tarja-ans.png')}
    style={{position: 'absolute', width: 230, left: 425, top: H - 170, opacity: ansIn}}
    hidden />
				)}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
