import {continueRender, delayRender, staticFile} from 'remotion';

// Dia Mundial do Coração — Bradesco Saúde
// Formato vertical, igual à vinheta SAUD0166. Troque FPS aqui se a timeline da edição for 25/29.97.
export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const C = {
	bordo: '#960032', // Bradesco Saúde (bradesco-saude-vertical-bordo-rgb.svg)
	bordoEscuro: '#5c0020',
	grafite: '#2a2826',
	grafiteClaro: '#77716a',
	papel: '#f5f1e9',
};

export const FONT = "'Bradesco Sans', 'Helvetica Neue', Arial, sans-serif";

const WEIGHTS: [string, number][] = [
	['Light', 300],
	['Regular', 400],
	['SemiBold', 600],
	['Bold', 700],
];

let requested = false;

export const loadBrandFonts = () => {
	if (requested || typeof document === 'undefined') {
		return;
	}
	requested = true;
	const handle = delayRender('Carregando Bradesco Sans');
	Promise.all(
		WEIGHTS.map(([name, weight]) =>
			new FontFace(
				'Bradesco Sans',
				`url(${staticFile(`dia-coracao/fonts/BradescoSans-${name}.ttf`)})`,
				{weight: String(weight)},
			)
				.load()
				.then((face) => {
					document.fonts.add(face);
				}),
		),
	)
		.catch((err) => console.error(err))
		.finally(() => continueRender(handle));
};
