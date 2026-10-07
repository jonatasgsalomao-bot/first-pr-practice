import React from 'react';
import {random} from 'remotion';
import {C} from './theme';

// ---------------------------------------------------------------------------
// Rig do boneco
// Ângulos em graus: 0 = para baixo, 90 = para frente (+x), 180 = para cima.
// Braços e coxas são absolutos; cotovelo (e) e joelho (k) são relativos ao segmento anterior.
// Origem = quadril. Chão em y = GROUND.
// ---------------------------------------------------------------------------

export type Pose = {
	lean: number;
	head: number;
	sL: number;
	eL: number;
	sR: number;
	eR: number;
	hL: number;
	kL: number;
	hR: number;
	kR: number;
	x: number;
	y: number;
	rot: number;
};

type Pt = [number, number];

export const GROUND = 184;
const D = {torso: 150, neck: 14, headR: 34, upper: 76, fore: 72, thigh: 92, shin: 92, toe: 22};
const TAU = Math.PI * 2;
const STROKE = C.grafite;

const BASE: Pose = {lean: 0, head: 0, sL: 8, eL: 10, sR: -8, eR: 10, hL: 4, kL: -4, hR: -4, kR: -4, x: 0, y: 0, rot: 0};

const dir = (deg: number): Pt => {
	const r = (deg * Math.PI) / 180;
	return [Math.sin(r), Math.cos(r)];
};
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const along = (from: Pt, deg: number, len: number): Pt => add(from, [dir(deg)[0] * len, dir(deg)[1] * len]);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerpPt = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const smooth = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * u);
const clamp01 = (u: number) => Math.min(1, Math.max(0, u));

export const solve = (p: Pose) => {
	const up = 180 - p.lean;
	const hip: Pt = [0, 0];
	const neck = along(hip, up, D.torso);
	const shoulder = along(hip, up, D.torso - 12);
	const head = along(neck, up - p.head, D.neck + D.headR);
	const elbowL = along(shoulder, p.sL, D.upper);
	const handL = along(elbowL, p.sL + p.eL, D.fore);
	const elbowR = along(shoulder, p.sR, D.upper);
	const handR = along(elbowR, p.sR + p.eR, D.fore);
	const kneeL = along(hip, p.hL, D.thigh);
	const footL = along(kneeL, p.hL + p.kL, D.shin);
	const kneeR = along(hip, p.hR, D.thigh);
	const footR = along(kneeR, p.hR + p.kR, D.shin);
	return {
		hip,
		neck,
		shoulder,
		head,
		elbowL,
		handL,
		elbowR,
		handR,
		kneeL,
		footL,
		toeL: along(footL, p.hL + p.kL + 90, D.toe),
		kneeR,
		footR,
		toeR: along(footR, p.hR + p.kR + 90, D.toe),
	};
};
type Joints = ReturnType<typeof solve>;

// Converte ponto local do boneco para o espaço do "palco" do esporte
const toOuter = (pt: Pt, p: Pose): Pt => {
	const r = (p.rot * Math.PI) / 180;
	return [pt[0] * Math.cos(r) - pt[1] * Math.sin(r) + p.x, pt[0] * Math.sin(r) + pt[1] * Math.cos(r) + p.y];
};

const keyframes = (t: number, kfs: [number, Partial<Pose>][]): Pose => {
	let i = kfs.findIndex(([time]) => time > t);
	if (i <= 0) i = kfs.length - 1;
	const [t0, a] = kfs[i - 1];
	const [t1, b] = kfs[i];
	const u = smooth(clamp01((t - t0) / (t1 - t0)));
	const out = {...BASE};
	(Object.keys(BASE) as (keyof Pose)[]).forEach((k) => {
		out[k] = lerp(a[k] ?? BASE[k], b[k] ?? BASE[k], u);
	});
	return out;
};

const line = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

// Arco de bola entre dois pontos, com altura extra no meio
const arc = (a: Pt, b: Pt, height: number, u: number): Pt => {
	const p = lerpPt(a, b, u);
	return [p[0], p[1] - height * 4 * u * (1 - u)];
};

// ---------------------------------------------------------------------------
// Desenho
// ---------------------------------------------------------------------------

const Body: React.FC<{p: Pose; children?: (j: Joints) => React.ReactNode}> = ({p, children}) => {
	const j = solve(p);
	const limb = {fill: 'none', stroke: STROKE, strokeWidth: 13, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
	return (
		<g transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`}>
			<g opacity={0.5}>
				<path d={line([j.shoulder, j.elbowL, j.handL])} {...limb} />
				<path d={line([j.hip, j.kneeL, j.footL, j.toeL])} {...limb} />
			</g>
			<path d={line([j.hip, j.neck])} {...limb} strokeWidth={22} />
			<circle cx={j.head[0]} cy={j.head[1]} r={D.headR} fill={C.papel} stroke={STROKE} strokeWidth={9} />
			{/* sombreado de lápis na cabeça */}
			<path
				d={`M${j.head[0] - 20} ${j.head[1] + 14} l14 12 M${j.head[0] - 24} ${j.head[1] + 2} l22 20 M${j.head[0] - 22} ${j.head[1] - 10} l28 26`}
				stroke={STROKE}
				strokeWidth={3}
				opacity={0.45}
			/>
			<path d={line([j.hip, j.kneeR, j.footR, j.toeR])} {...limb} />
			<path d={line([j.shoulder, j.elbowR, j.handR])} {...limb} />
			{children?.(j)}
		</g>
	);
};

const Ball: React.FC<{at: Pt; r?: number; seam?: boolean}> = ({at, r = 20, seam = true}) => (
	<g transform={`translate(${at[0]} ${at[1]})`}>
		<circle r={r} fill="#dcd6cc" stroke={STROKE} strokeWidth={6} />
		{seam && <path d={`M${-r} 0 Q0 ${-r * 0.7} ${r} 0 M${-r * 0.4} ${-r * 0.9} Q${r * 0.1} 0 ${-r * 0.3} ${r * 0.95}`} fill="none" stroke={STROKE} strokeWidth={3} />}
	</g>
);

// Rede de praia em perspectiva (ref. foto): poste próximo, faixas brancas largas
// em cima e embaixo, malha quadrada que encurta ao fundo, corda e sombra na areia.
// x = poste próximo, top = topo da faixa no poste, depth = altura da rede no poste,
// dx = para onde a rede se afasta (negativo = para trás do boneco).
const Net: React.FC<{x: number; top: number; depth: number; dx: number}> = ({x, top, depth, dx}) => {
	const FAR = 0.5; // altura relativa da rede na ponta distante
	const K = 1.3; // encurtamento da perspectiva
	const mid = top + depth / 2;
	const persp = (u: number) => (u * (1 + K)) / (1 + K * u);
	const P = (u: number, v: number): Pt => {
		const up = persp(u);
		const h = depth * (1 - (1 - FAR) * up);
		return [x + dx * up, mid - h / 2 + v * h];
	};
	const BAND_TOP = 0.13;
	const BAND_BOTTOM = 0.9;
	const quad = (v0: number, v1: number) => line([P(0, v0), P(1, v0), P(1, v1), P(0, v1)]) + ' Z';

	const mesh: string[] = [];
	const COLS = 16;
	const ROWS = 6;
	for (let i = 1; i < COLS; i++) mesh.push(line([P(i / COLS, BAND_TOP), P(i / COLS, BAND_BOTTOM)]));
	for (let m = 1; m < ROWS; m++) {
		const v = BAND_TOP + ((BAND_BOTTOM - BAND_TOP) * m) / ROWS;
		mesh.push(line([P(0, v), P(1, v)]));
	}
	const farTop = P(1, 0);
	const farGround = mid + (GROUND - mid) * FAR + (GROUND - mid) * 0.1;
	const away = -Math.sign(dx);

	return (
		<g stroke={STROKE} strokeLinecap="round" strokeLinejoin="round">
			{/* sombra na areia */}
			<g opacity={0.3} strokeWidth={5} fill="none">
				<path d={`M${x} ${GROUND + 6} L${x + dx * 0.9 + away * -40} ${GROUND + 58}`} />
				<path d={`M${x + dx * 0.25} ${GROUND + 4} L${x + dx * 1.2 + away * -40} ${GROUND + 40}`} />
			</g>
			{/* poste distante */}
			<path d={`M${farTop[0]} ${farTop[1] - 8} L${farTop[0]} ${farGround}`} strokeWidth={5} />
			{/* malha */}
			<path d={mesh.join(' ')} fill="none" strokeWidth={2.2} opacity={0.75} />
			{/* faixas brancas */}
			<path d={quad(0, BAND_TOP)} fill={C.papel} strokeWidth={4} />
			<path d={quad(BAND_BOTTOM, 1)} fill={C.papel} strokeWidth={3.5} />
			{/* corda de sustentação */}
			<path d={`M${x} ${top + 4} L${x + away * 120} ${GROUND + 10}`} fill="none" strokeWidth={3} opacity={0.6} />
			{/* poste próximo */}
			<rect x={x - 8} y={top - 16} width={16} height={GROUND - top + 16} fill={C.papel} strokeWidth={5} />
		</g>
	);
};

// ---------------------------------------------------------------------------
// Esportes (ordem do roteiro)
// ---------------------------------------------------------------------------

type Terrain = 'areia' | 'agua' | 'pista';
type Sport = {
	id: string;
	period: number;
	terrain: Terrain;
	pose: (t: number) => Pose;
	local?: (j: Joints, p: Pose, t: number) => React.ReactNode;
	back?: (p: Pose, t: number) => React.ReactNode;
	front?: (p: Pose, t: number) => React.ReactNode;
};

const tennisPose = (t: number) =>
	keyframes(t, [
		[0, {lean: 12, sR: 30, eR: 60, sL: 40, eL: 50, hR: 22, kR: -30, hL: -18, kL: -22, y: 14}],
		[0.42, {lean: 0, head: -4, sR: -115, eR: 35, sL: 75, eL: 8, hR: 8, kR: -18, hL: -26, kL: -12, y: 6}],
		[0.55, {lean: 14, sR: 88, eR: 8, sL: 18, eL: 40, hR: 28, kR: -22, hL: -22, kL: -34, y: 10}],
		[0.72, {lean: 18, sR: 172, eR: 45, sL: -25, eL: 60, hR: 30, kR: -26, hL: -24, kL: -36, y: 12}],
		[1, {lean: 12, sR: 30, eR: 60, sL: 40, eL: 50, hR: 22, kR: -30, hL: -18, kL: -22, y: 14}],
	]);
const racketCenter = (j: Joints, p: Pose): Pt => along(j.handR, p.sR + p.eR, 80);

const volleyPose = (t: number) =>
	keyframes(t, [
		[0, {lean: 6, sR: 12, eR: 20, sL: 10, eL: 20, hR: 6, kR: -12, hL: 2, kL: -10}],
		[0.25, {lean: 36, head: -20, sR: -70, eR: 0, sL: -62, eL: 0, hR: 62, kR: -112, hL: 56, kL: -104, y: 56}],
		[0.44, {lean: -4, head: 8, sR: 192, eR: -24, sL: 160, eL: 0, hR: 10, kR: -44, hL: -12, kL: -62, y: -150}],
		[0.55, {lean: 22, sR: 118, eR: 0, sL: 40, eL: 30, hR: 30, kR: -54, hL: 10, kL: -74, y: -140}],
		[0.74, {lean: 26, sR: 40, eR: 20, sL: 30, eL: 20, hR: 48, kR: -84, hL: 42, kL: -80, y: 34}],
		[1, {lean: 6, sR: 12, eR: 20, sL: 10, eL: 20, hR: 6, kR: -12, hL: 2, kL: -10}],
	]);

const footvolleyPose = (t: number) =>
	keyframes(t, [
		[0, {lean: -8, head: 14, sR: 70, eR: 20, sL: -60, eL: -20, hR: 72, kR: -30, hL: -4, kL: -10, y: 4}],
		[0.22, {lean: -2, head: 10, sR: 45, eR: 20, sL: -40, eL: -10, hR: 22, kR: -24, hL: -2, kL: -10}],
		[0.5, {lean: 0, head: 20, sR: 30, eR: 30, sL: -28, eL: -10, hR: 6, kR: -14, hL: -6, kL: -12, y: 10}],
		[0.82, {lean: 6, head: 20, sR: 55, eR: 20, sL: -52, eL: -20, hR: -24, kR: -46, hL: 4, kL: -16, y: 12}],
		[1, {lean: -8, head: 14, sR: 70, eR: 20, sL: -60, eL: -20, hR: 72, kR: -30, hL: -4, kL: -10, y: 4}],
	]);

export const SPORTS: Sport[] = [
	{
		id: 'beach-tennis',
		period: 46,
		terrain: 'areia',
		pose: tennisPose,
		local: (j, p) => {
			const ang = p.sR + p.eR;
			const c = racketCenter(j, p);
			const handleEnd = along(j.handR, ang, 32);
			return (
				<g>
					<path d={line([j.handR, handleEnd])} stroke={STROKE} strokeWidth={10} strokeLinecap="round" />
					<g transform={`translate(${c[0]} ${c[1]}) rotate(${90 - ang})`}>
						<ellipse rx={48} ry={38} fill="#e6e0d6" stroke={STROKE} strokeWidth={7} />
						{[-24, -8, 8, 24].map((dx) =>
							[-14, 0, 14].map((dy) => <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={3} fill={STROKE} opacity={0.6} />),
						)}
					</g>
				</g>
			);
		},
		back: () => <Net x={235} top={-175} depth={140} dx={150} />,
		front: (_p, t) => {
			const cp = tennisPose(0.55);
			const contact = toOuter(racketCenter(solve(cp), cp), cp);
			if (t > 0.22 && t <= 0.55) {
				const u = (t - 0.22) / 0.33;
				return <g opacity={clamp01(u * 5)}><Ball at={arc([470, -330], contact, 150, u)} r={12} seam={false} /></g>;
			}
			if (t > 0.55 && t < 0.92) {
				const u = (t - 0.55) / 0.37;
				return <g opacity={clamp01((1 - u) * 5)}><Ball at={arc(contact, [480, -400], 180, u)} r={12} seam={false} /></g>;
			}
			return null;
		},
	},
	{
		id: 'natacao',
		period: 40,
		terrain: 'agua',
		pose: (t) => {
			const a = t * TAU;
			return {
				...BASE,
				rot: 90,
				x: -110,
				y: 96,
				head: -10,
				sR: 180 - 360 * t,
				eR: -14 * Math.sin(a),
				sL: 360 - 360 * t,
				eL: -14 * Math.sin(a + Math.PI),
				hR: 6 + 14 * Math.sin(a * 4),
				kR: -14,
				hL: 6 - 14 * Math.sin(a * 4),
				kL: -14,
			};
		},
		front: (p, t) => {
			const splash = Math.max(0, Math.cos(4 * Math.PI * t)) ** 4;
			return (
				<g>
					{/* linhas d'água por cima do corpo = parte submersa */}
					<path d={`M-240 ${p.y + 10} q40 -12 80 0 t80 0 t80 0 t80 0 t80 0 t80 0`} fill="none" stroke={STROKE} strokeWidth={5} opacity={0.7} />
					<g opacity={splash} stroke={STROKE} strokeWidth={5} strokeLinecap="round" fill="none">
						<path d={`M190 ${p.y - 18} q10 -26 26 -30`} />
						<path d={`M170 ${p.y - 26} q-2 -24 8 -40`} />
						<path d={`M214 ${p.y - 6} q16 -10 34 -8`} />
					</g>
				</g>
			);
		},
	},
	{
		id: 'futevolei',
		period: 42,
		terrain: 'areia',
		pose: footvolleyPose,
		back: () => <Net x={235} top={-240} depth={160} dx={150} />,
		front: (_p, t) => {
			const cp = footvolleyPose(0);
			const contact = toOuter(solve(cp).toeR, cp);
			const at: Pt = [contact[0] - 10, contact[1] - 26 - 340 * 4 * t * (1 - t)];
			return <Ball at={at} />;
		},
	},
	{
		id: 'volei',
		period: 52,
		terrain: 'areia',
		pose: volleyPose,
		back: () => <Net x={235} top={-245} depth={160} dx={150} />,
		front: (_p, t) => {
			const cp = volleyPose(0.55);
			const hand = toOuter(solve(cp).handR, cp);
			const contact: Pt = [hand[0] + 14, hand[1] - 22];
			if (t > 0.18 && t <= 0.55) {
				const u = (t - 0.18) / 0.37;
				return <g opacity={clamp01(u * 5)}><Ball at={arc([-240, -120], contact, 300, u)} /></g>;
			}
			if (t > 0.55 && t <= 0.7) {
				return <Ball at={lerpPt(contact, [560, GROUND - 20], (t - 0.55) / 0.15)} />;
			}
			if (t > 0.7 && t < 0.95) {
				const u = (t - 0.7) / 0.25;
				return <g opacity={1 - u}><Ball at={arc([560, GROUND - 20], [650, GROUND - 20], 70, u)} /></g>;
			}
			return null;
		},
	},
	{
		id: 'corrida',
		period: 20,
		terrain: 'pista',
		pose: (t) => {
			const a = t * TAU;
			const leg = (ph: number) => ({h: 12 + 44 * Math.sin(ph), k: -12 - 82 * Math.max(0, Math.cos(ph))});
			const R = leg(a);
			const L = leg(a + Math.PI);
			return {
				...BASE,
				lean: 16,
				head: -10,
				sR: 8 - 50 * Math.sin(a),
				eR: 95,
				sL: 8 + 50 * Math.sin(a),
				eL: 95,
				hR: R.h,
				kR: R.k,
				hL: L.h,
				kL: L.k,
				y: 16 - 14 * Math.abs(Math.sin(a)),
			};
		},
		back: (_p, t) => (
			<g stroke={STROKE} strokeWidth={5} strokeLinecap="round" opacity={0.35 + 0.25 * Math.sin(t * TAU * 2)}>
				<path d="M-150 -170 h-90" />
				<path d="M-170 -80 h-120" />
				<path d="M-140 10 h-80" />
			</g>
		),
	},
];

// ---------------------------------------------------------------------------

const TerrainDraw: React.FC<{kind: Terrain; seed: string; half: number}> = ({kind, seed, half}) => {
	if (kind === 'agua') {
		const wave = (y: number, amp: number, len: number) => {
			let d = `M${-half} ${y}`;
			for (let x = -half; x < half; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
			return d;
		};
		return (
			<g fill="none" stroke={STROKE} strokeLinecap="round">
				<path d={wave(104, 10, 90)} strokeWidth={6} />
				<path d={wave(150, 7, 110)} strokeWidth={4} opacity={0.5} />
				<path d={wave(196, 6, 130)} strokeWidth={3} opacity={0.3} />
			</g>
		);
	}
	const ticks = [];
	for (let k = 0; k < 16; k++) {
		const x = -half + random(`${seed}-x${k}`) * half * 2;
		const y = GROUND + 14 + random(`${seed}-y${k}`) * 40;
		ticks.push(
			kind === 'areia' ? (
				<circle key={k} cx={x} cy={y} r={2.5 + random(`${seed}-r${k}`) * 2} fill={STROKE} opacity={0.5} />
			) : (
				<path key={k} d={`M${x} ${y} l${26 + random(`${seed}-l${k}`) * 30} 0`} stroke={STROKE} strokeWidth={3} opacity={0.35} />
			),
		);
	}
	return (
		<g>
			<path d={`M${-half} ${GROUND} L${half} ${GROUND}`} stroke={STROKE} strokeWidth={7} strokeLinecap="round" />
			{ticks}
		</g>
	);
};

export const SportFigure: React.FC<{sport: Sport; frame: number; half: number; seed: string}> = ({
	sport,
	frame,
	half,
	seed,
}) => {
	const t = (((frame % sport.period) + sport.period) % sport.period) / sport.period;
	const p = sport.pose(t);
	return (
		<g>
			<TerrainDraw kind={sport.terrain} seed={seed} half={half} />
			{sport.back?.(p, t)}
			<Body p={p}>{sport.local ? (j) => sport.local!(j, p, t) : undefined}</Body>
			{sport.front?.(p, t)}
		</g>
	);
};

// Faixa horizontal que desliza com os bonecos, na ordem do roteiro.
export const Parade: React.FC<{
	frame: number;
	groundY: number;
	scale?: number;
	speed?: number;
	spacing?: number;
	firstX?: number;
	opacity?: number;
}> = ({frame, groundY, scale = 1, speed = 11, spacing = 820, firstX = 620, opacity = 1}) => {
	const offset = firstX - speed * frame;
	const items = [];
	const iMin = Math.max(0, Math.ceil((-spacing - offset) / spacing));
	const iMax = Math.floor((1080 + spacing - offset) / spacing);
	for (let i = iMin; i <= iMax; i++) {
		const sport = SPORTS[i % SPORTS.length];
		items.push(
			<g key={i} transform={`translate(${offset + i * spacing} ${groundY}) scale(${scale}) translate(0 ${-GROUND})`}>
				<SportFigure sport={sport} frame={frame + i * 7} half={spacing / scale / 2} seed={`${sport.id}-${i}`} />
			</g>,
		);
	}
	return <g opacity={opacity}>{items}</g>;
};
