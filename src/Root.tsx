import React from 'react';
import { Composition, Folder, Still } from 'remotion';
import { FRAMES, HIPNOSE_FRAMES, HipnoseVideo } from './base/Frames';
import { HelloWorld } from './HelloWorld';
import { CampaignVideo } from './CampaignVideo';
import { InstagramCover } from './InstagramCover';
import { DiaCoracaoIntro, INTRO_DURATION } from './dia-coracao/Intro';
import { DiaCoracaoFinal, FINAL_DURATION } from './dia-coracao/Final';
import { FPS, H, W } from './dia-coracao/theme';
import { ABERTURA_DURATION, ABERTURA_FPS, ABERTURA_H, ABERTURA_W, AberturaDiaDoFisioterapeuta } from './dia-fisioterapeuta/Abertura';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="HelloWorld"
				component={HelloWorld}
				durationInFrames={150}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					title: 'Welcome to Remotion',
				}}
			/>
			<Composition
				id="CampaignAnimations"
				component={CampaignVideo}
				durationInFrames={810}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					backgroundColor: 'transparent',
				}}
			/>
			<Composition
				id="InstagramCover-BradescoSeguros"
				component={InstagramCover}
				durationInFrames={1}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Folder name="Bradesco-Saude-Dia-do-Coracao">
				<Composition
					id="DiaCoracao-Intro"
					component={DiaCoracaoIntro}
					durationInFrames={INTRO_DURATION}
					fps={FPS}
					width={W}
					height={H}
				/>
				<Composition
					id="DiaCoracao-Final"
					component={DiaCoracaoFinal}
					durationInFrames={FINAL_DURATION}
					fps={FPS}
					width={W}
					height={H}
					defaultProps={{ showAns: true }}
				/>
			</Folder>
			<Folder name="MeuDoutor-Dia-do-Fisioterapeuta">
				<Composition
					id="Abertura-DiaDoFisioterapeuta"
					component={AberturaDiaDoFisioterapeuta}
					durationInFrames={ABERTURA_DURATION}
					fps={ABERTURA_FPS}
					width={ABERTURA_W}
					height={ABERTURA_H}
					defaultProps={{ transparent: false }}
				/>
			</Folder>
			<Folder name="Base-Stories">
				{FRAMES.map(({id, component}) => (
					<Still key={id} id={`Base-${id}`} component={component} width={1080} height={1920} />
				))}
				<Composition id="Base-07-Hipnose-Video" component={HipnoseVideo} durationInFrames={HIPNOSE_FRAMES} fps={30} width={1080} height={1920} />
			</Folder>
		</>
	);
};
