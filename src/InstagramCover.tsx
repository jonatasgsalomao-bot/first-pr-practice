import React from 'react';
import { Img, staticFile, AbsoluteFill } from 'remotion';

const VERMELHO = '#CC092F';

// Area segura do Reels (guia oficial da marca): topo 250, base 320, laterais 120,
// e uma coluna a direita de 768px de altura onde a interface poe os botoes.
const MARGEM = 120;
const SEGURO_BASE = 1600;
const COLUNA_BOTOES_X = 840;

const FONT_FACE = `
	@font-face { font-family: 'BradescoSans'; src: url('fonts/BradescoSans-XBold.ttf'); font-weight: 800; }
	@font-face { font-family: 'BradescoSans'; src: url('fonts/BradescoSans-Bold.ttf'); font-weight: 700; }
	@font-face { font-family: 'BradescoSans'; src: url('fonts/BradescoSans-Medium.ttf'); font-weight: 500; }
	@font-face { font-family: 'BradescoSansCond'; src: url('fonts/BradescoSans-CondensedBold.ttf'); font-weight: 700; }
`;

type CoverProps = {
	frame?: string;
};

export const InstagramCover: React.FC<CoverProps> = ({ frame = 'frames/f1.jpg' }) => {

	const corteFoto = 1460;

	return (
		<>
			<style>{FONT_FACE}</style>
			<AbsoluteFill style={{ backgroundColor: VERMELHO, fontFamily: 'BradescoSans, sans-serif' }}>
			{/* Foto sangrando do topo ate o corte */}
			<div style={{ position: 'absolute', inset: `0 0 ${1920 - corteFoto}px 0`, overflow: 'hidden' }}>
				<Img
					src={staticFile(frame)}
					style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 32%' }}
				/>
				{/* Escurece o rodape da foto para a emenda com o vermelho nao bater seca */}
				<AbsoluteFill
					style={{
						background: `linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 80%, ${VERMELHO} 100%)`,
					}}
				/>
			</div>

			{/* Assinatura da produtora: autoria no topo, dentro da area segura */}
			<div style={{ position: 'absolute', left: MARGEM, top: 268, display: 'flex', alignItems: 'center', gap: 20 }}>
				<div style={{ width: 56, height: 6, backgroundColor: '#fff' }} />
				<span
					style={{
						color: '#fff',
						fontSize: 30,
						fontWeight: 700,
						letterSpacing: 6,
						textShadow: '0 2px 12px rgba(0,0,0,0.45)',
					}}
				>
					CASA B FILMES
				</span>
			</div>

			{/* Selo da campanha atravessando a emenda */}
			<Img
				src={staticFile('SPLASH.png')}
				style={{
					position: 'absolute',
					left: MARGEM - 20,
					top: corteFoto - 340,
					width: 380,
					transform: 'rotate(-7deg)',
					filter: 'drop-shadow(0 18px 36px rgba(0,0,0,0.38))',
				}}
			/>

			{/* Bloco vermelho: apenas texto pequeno */}
			<div style={{ position: 'absolute', left: MARGEM, right: 1080 - COLUNA_BOTOES_X, top: 1520, display: 'flex', flexDirection: 'column', gap: 14 }}>
				<div
					style={{
						color: 'rgba(255,255,255,0.94)',
						fontSize: 38,
						fontWeight: 700,
						letterSpacing: 1,
					}}
				>
					VAI QUE…
				</div>
				<div
					style={{
						color: 'rgba(255,255,255,0.90)',
						fontSize: 28,
						fontWeight: 600,
						lineHeight: 1.3,
					}}
				>
					Campanha Seguro Residencial
				</div>
			</div>

			{/* Logo do cliente, no rodape (fora da area de botoes) */}
			<Img
				src={staticFile('marca/bradesco-seguros-branco.png')}
				style={{ position: 'absolute', left: MARGEM, top: 1640, width: 500 }}
			/>
		</AbsoluteFill>
		</>
	);
};
