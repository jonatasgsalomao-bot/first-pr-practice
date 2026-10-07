import React from 'react';
import { Sequence, staticFile } from 'remotion';
import { PopAnimation, SlideAnimation, BounceAnimation } from './CampaignAnimations';

type CampaignVideoProps = {
	backgroundColor?: string;
};

const SHOT_FRAMES = 90;

export const CampaignVideo: React.FC<CampaignVideoProps> = ({
	backgroundColor = 'transparent',
}) => {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				backgroundColor,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Sequence from={0} durationInFrames={SHOT_FRAMES}>
				<PopAnimation imageSrc={staticFile('XIIII.png')} />
			</Sequence>

			<Sequence from={SHOT_FRAMES} durationInFrames={SHOT_FRAMES}>
				<SlideAnimation imageSrc={staticFile('AAAIII.png')} />
			</Sequence>

			<Sequence from={SHOT_FRAMES * 2} durationInFrames={SHOT_FRAMES}>
				<BounceAnimation imageSrc={staticFile('WOW.png')} />
			</Sequence>

			<Sequence from={SHOT_FRAMES * 3} durationInFrames={SHOT_FRAMES}>
				<PopAnimation imageSrc={staticFile('POOW.png')} />
			</Sequence>

			<Sequence from={SHOT_FRAMES * 4} durationInFrames={SHOT_FRAMES}>
				<SlideAnimation imageSrc={staticFile('SPLASH.png')} />
			</Sequence>

			<Sequence from={SHOT_FRAMES * 5} durationInFrames={SHOT_FRAMES}>
				<BounceAnimation imageSrc={staticFile('CRASH.png')} />
			</Sequence>

			<Sequence from={SHOT_FRAMES * 6} durationInFrames={SHOT_FRAMES}>
				<PopAnimation imageSrc={staticFile('OUCH.png')} />
			</Sequence>

			<Sequence from={SHOT_FRAMES * 7} durationInFrames={SHOT_FRAMES}>
				<SlideAnimation imageSrc={staticFile('OOOPS.png')} />
			</Sequence>

			<Sequence from={SHOT_FRAMES * 8} durationInFrames={SHOT_FRAMES}>
				<BounceAnimation imageSrc={staticFile('BZZZ.png')} />
			</Sequence>
		</div>
	);
};
