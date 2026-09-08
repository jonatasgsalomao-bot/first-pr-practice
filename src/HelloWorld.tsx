import React from 'react';
import { useVideoConfig } from 'remotion';

interface HelloWorldProps {
	title: string;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({ title }) => {
	const { width, height } = useVideoConfig();

	return (
		<div
			style={{
				flex: 1,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				width: '100%',
				height: '100%',
				fontFamily: 'Segoe UI, sans-serif',
				color: 'white',
				textAlign: 'center',
				fontSize: 72,
				fontWeight: 'bold',
				textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
			}}
		>
			<div>
				<h1>{title}</h1>
				<p style={{ fontSize: 36, marginTop: 20 }}>
					Video dimensions: {width}x{height}
				</p>
			</div>
		</div>
	);
};
