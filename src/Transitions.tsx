import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { slide } from '@remotion/transitions';

interface TransitionsProps {
	title: string;
}

export const Transitions: React.FC<TransitionsProps> = ({ title }) => {
	const { width, height } = useVideoConfig();

	return (
		<>
			<Sequence
				from={0}
				durationInFrames={75}
				layout="none"
				{...slide({
					direction: 'from-left',
				})}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						background: '#667eea',
						width: '100%',
						height: '100%',
						fontSize: 72,
						color: 'white',
						fontWeight: 'bold',
					}}
				>
					Slide In
				</div>
			</Sequence>

			<Sequence
				from={75}
				durationInFrames={75}
				layout="none"
				{...slide({
					direction: 'from-right',
				})}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						background: '#764ba2',
						width: '100%',
						height: '100%',
						fontSize: 72,
						color: 'white',
						fontWeight: 'bold',
					}}
				>
					Slide Out
				</div>
			</Sequence>
		</>
	);
};
