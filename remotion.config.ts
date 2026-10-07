import { Config } from '@remotion/cli/config';

// Saida com alfa para overlay. Os quatro sao interdependentes:
// - h264/yuv420p nao carrega alfa, dai o ProRes 4444
// - videoImageFormat png e obrigatorio: o padrao jpeg descarta o alfa calado
// - sem o pixelFormat yuva o canal ate existe, mas sai 100% opaco (fundo preto)
// PREVIEW=1 pula tudo isso para gerar MP4 leve de aprovacao.
// Solo-renderiza (frame-by-frame, sem --sequence) usa a config global.
// Para stills/covers, passa --codec png na CLI para sobrescrever.
if (!process.env.PREVIEW && typeof process.argv[2] !== 'undefined') {
	const isStill = process.argv.some((a) => a.includes('png') || a.includes('jpg'));
	if (!isStill) {
		Config.setVideoImageFormat('png');
		Config.setCodec('prores');
		Config.setProResProfile('4444');
		Config.setPixelFormat('yuva444p10le');
	}
}
