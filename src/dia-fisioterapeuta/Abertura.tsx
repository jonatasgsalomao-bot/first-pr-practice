import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadBrandFonts} from '../dia-coracao/theme';

loadBrandFonts();

// Abertura "Dia do Fisioterapeuta" — Meu Doutor Novamed (Bradesco Seguros)
// Estrutura espelhada em "Referencia abertura.mov": logo centralizada que sobe/diminui,
// título em Light espaçado com letras entrando em sequência, círculos finos nos cantos.
export const ABERTURA_FPS = 24;
export const ABERTURA_DURATION = 96; // 4s @ 24fps (a animação assenta em ~3,3s; o resto é respiro)
export const ABERTURA_W = 1080;
export const ABERTURA_H = 1920;

export const MD = {
	azul: '#0082C3', // fundo da referência = azul do anel da logo
	azulClaro: '#46BEEB',
	vermelho: '#EB304D', // vermelho do coração da logo
	branco: '#FFFFFF',
};

const FONT = "'Bradesco Sans', 'Helvetica Neue', Arial, sans-serif";

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.inOut(Easing.cubic);

// progresso 0..1 de um trecho [from, from+dur] com easing
const prog = (frame: number, from: number, dur: number, easing: (t: number) => number = outExpo) =>
	interpolate(frame, [from, from + dur], [0, 1], {...clamp, easing});

// Círculo de contorno que se desenha e continua crescendo devagar (como na referência)
const Ring: React.FC<{
	cx: number;
	cy: number;
	r: number;
	frame: number;
	from: number;
	grow: number;
	stroke: string;
	width: number;
	gradId: string;
}> = ({cx, cy, r, frame, from, grow, stroke, width, gradId}) => {
	const draw = prog(frame, from, 40);
	const rr = r + frame * grow;
	const len = 2 * Math.PI * rr;
	return (
		<circle
			cx={cx}
			cy={cy}
			r={rr}
			fill="none"
			stroke={stroke === 'grad' ? `url(#${gradId})` : stroke}
			strokeWidth={width}
			strokeLinecap="round"
			strokeDasharray={len}
			strokeDashoffset={len * (1 - draw)}
			transform={`rotate(-90 ${cx} ${cy})`}
			opacity={interpolate(frame, [from, from + 10], [0, 1], clamp)}
		/>
	);
};

// Linha de pulso (grafismo da marca) — desenha da esquerda para a direita
const Pulse: React.FC<{y: number; frame: number; from: number}> = ({y, frame, from}) => {
	const x0 = 150;
	const x1 = 930;
	const mid = 540;
	// coordenadas: reta, pequeno tremor, pico alto/baixo no centro, reta
	const d = [
		`M ${x0} ${y}`,
		`L ${mid - 190} ${y}`,
		`L ${mid - 160} ${y - 16}`,
		`L ${mid - 130} ${y}`,
		`L ${mid - 60} ${y}`,
		`L ${mid - 30} ${y - 78}`,
		`L ${mid + 10} ${y + 58}`,
		`L ${mid + 40} ${y}`,
		`L ${mid + 120} ${y}`,
		`L ${mid + 150} ${y - 16}`,
		`L ${mid + 180} ${y}`,
		`L ${x1} ${y}`,
	].join(' ');
	const draw = prog(frame, from, 26, Easing.inOut(Easing.quad));
	return (
		<path
			d={d}
			fill="none"
			stroke={MD.azulClaro}
			strokeWidth={5}
			strokeLinecap="round"
			strokeLinejoin="round"
			pathLength={1}
			strokeDasharray={1}
			strokeDashoffset={1 - draw}
			opacity={interpolate(frame, [from, from + 4], [0, 1], clamp)}
		/>
	);
};

const Letters: React.FC<{
	text: string;
	frame: number;
	from: number;
	stagger: number;
	size: number;
	weight: number;
	gap: number;
	color: string;
}> = ({text, frame, from, stagger, size, weight, gap, color}) => {
	const chars = Array.from(text);
	return (
		<div style={{display: 'flex', justifyContent: 'center', gap, fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: 1}}>
			{chars.map((ch, i) => {
				if (ch === ' ') {
					return <span key={i} style={{width: size * 0.7}} />;
				}
				const p = prog(frame, from + i * stagger, 12);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							opacity: p,
							transform: `translateY(${(1 - p) * 34}px)`,
							filter: `blur(${(1 - p) * 6}px)`,
						}}
					>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

export const AberturaDiaDoFisioterapeuta: React.FC<{transparent?: boolean}> = ({transparent = false}) => {
	const frame = useCurrentFrame();

	// Logo: entra no centro, depois sobe e diminui para abrir espaço ao título
	const logoIn = prog(frame, 0, 20);
	const move = prog(frame, 22, 26, inOut);
	const logoY = interpolate(move, [0, 1], [ABERTURA_H / 2, 700]);
	const logoScale = interpolate(logoIn, [0, 1], [0.86, 1]) * interpolate(move, [0, 1], [1, 0.88]);

	// Data em "pílula"
	const pill = prog(frame, 62, 16, Easing.bezier(0.34, 1.56, 0.64, 1));

	return (
		<AbsoluteFill style={{backgroundColor: transparent ? 'transparent' : MD.azul, overflow: 'hidden'}}>
			<svg width={ABERTURA_W} height={ABERTURA_H} style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stopColor={MD.vermelho} />
						<stop offset="1" stopColor="#6A4FB5" />
					</linearGradient>
				</defs>
				{/* canto superior esquerdo */}
				<Ring cx={-30} cy={300} r={320} frame={frame} from={6} grow={0.9} stroke="grad" width={3} gradId="ringGrad" />
				<Ring cx={-30} cy={300} r={400} frame={frame} from={12} grow={0.9} stroke={MD.azulClaro} width={2} gradId="ringGrad" />
				{/* canto inferior direito */}
				<Ring cx={1110} cy={1600} r={330} frame={frame} from={10} grow={0.9} stroke="grad" width={3} gradId="ringGrad" />
				<Ring cx={1110} cy={1600} r={410} frame={frame} from={16} grow={0.9} stroke={MD.azulClaro} width={2} gradId="ringGrad" />
				<Pulse y={1450} frame={frame} from={52} />
			</svg>

			<Img
				src={staticFile('meudoutor/logo-fundo-azul.png')}
				style={{
					position: 'absolute',
					left: ABERTURA_W / 2 - 480,
					top: logoY - 480,
					width: 960,
					height: 960,
					opacity: interpolate(frame, [0, 12], [0, 1], clamp),
					transform: `scale(${logoScale})`,
				}}
			/>

			<div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
				<Letters text="DIA DO" frame={frame} from={34} stagger={2} size={46} weight={400} gap={26} color="#BDE9FA" />
				<Letters text="FISIOTERAPEUTA" frame={frame} from={40} stagger={1.6} size={78} weight={300} gap={18} color={MD.branco} />
			</div>

			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 1262,
					display: 'flex',
					justifyContent: 'center',
					opacity: interpolate(pill, [0, 0.4], [0, 1], clamp),
					transform: `scale(${interpolate(pill, [0, 1], [0.7, 1])})`,
				}}
			>
				<div
					style={{
						fontFamily: FONT,
						fontWeight: 700,
						fontSize: 50,
						letterSpacing: '0.16em',
						color: MD.branco,
						background: MD.vermelho,
						borderRadius: 100,
						padding: '24px 58px 24px 66px',
						lineHeight: 1,
					}}
				>
					13 DE OUTUBRO
				</div>
			</div>
		</AbsoluteFill>
	);
};
