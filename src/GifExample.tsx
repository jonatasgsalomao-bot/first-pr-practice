import React from 'react';
import { Img, useVideoConfig } from 'remotion';

interface GifExampleProps {
	gifUrl?: string;
}

export const GifExample: React.FC<GifExampleProps> = ({
	gifUrl = 'https://media.giphy.com/media/3o85xIO33l7RlmLDBi/giphy.gif',
}) => {
	const { width, height } = useVideoConfig();

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				background: '#f0f0f0',
				width: '100%',
				height: '100%',
				gap: 20,
			}}
		>
			<Img
				src={gifUrl}
				style={{
					width: 400,
					height: 300,
					objectFit: 'contain',
				}}
			/>
			<h1 style={{ fontSize: 48, color: '#333' }}>Animated GIF Example</h1>
			<p style={{ fontSize: 24, color: '#666' }}>
				Use @remotion/gif to embed animated GIFs in your videos
			</p>
		</div>
	);
};
