import React, { useRef, useState, useEffect } from "react";

interface Letter {
	char: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

interface LetterCanvasProps {
	letters: string[];
	onWordComplete: (word: string) => void;
	onLetterSelected: (letters: string) => void;
}

export const LetterCanvas: React.FC<LetterCanvasProps> = ({ letters, onWordComplete, onLetterSelected }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
	const [letterPositions, setLetterPositions] = useState<Letter[]>([]);
	const activeLettersIndexes = useRef<Set<number>>(new Set());

	const resizeCanvas = () => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (canvas && container) {
			canvas.width = container.clientWidth;
			canvas.height = container.clientHeight;
			calculateLetterPositions(canvas.width, canvas.height);
		}
	};

	const calculateLetterPositions = (canvasWidth: number, canvasHeight: number) => {
		const maxLetters = letters.length;
		const positions: Letter[] = [];

		const centerX = canvasWidth / 2;
		const centerY = canvasHeight / 2;
		const radius = Math.min(canvasWidth, canvasHeight) / 3;
		const adjustedRadius = radius + maxLetters * 1;

		letters.forEach((char, index) => {
			const angle = (index / maxLetters) * 2 * Math.PI;
			const offsetX = adjustedRadius * Math.cos(angle);
			const offsetY = adjustedRadius * Math.sin(angle);

			positions.push({
				char,
				x: centerX + offsetX,
				y: centerY + offsetY,
				width: 40,
				height: 40,
			});
		});	

		setLetterPositions(positions);
	};

	useEffect(() => {
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, [letters]);

	const handleDraw = (event: React.MouseEvent | React.TouchEvent): void => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		event.preventDefault();

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const x =
			"touches" in event
			? event.touches[0].clientX - rect.left
			: (event as React.MouseEvent).clientX - rect.left;
		const y =
			"touches" in event
			? event.touches[0].clientY - rect.top
			: (event as React.MouseEvent).clientY - rect.top;

		ctx.fillStyle = "#ababab6b";
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, 2 * Math.PI);
		ctx.fill();

		letterPositions.forEach((letter, index) => {
			const inBounds =
			x > letter.x - letter.width / 2 &&
			x < letter.x + letter.width / 2 &&
			y > letter.y - letter.height / 2 &&
			y < letter.y + letter.height / 2;

			if (inBounds) {
				if (!activeLettersIndexes.current.has(index)) {
					setSelectedLetters((prev) => [...prev, letter.char]);
					onLetterSelected([...selectedLetters, letter.char].join(''))
					activeLettersIndexes.current.add(index);
				}
			}
		});
	};

	const handleEnd = (): void => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawLetters();
		}

		const word = selectedLetters.join("");
		onWordComplete(word);

		setSelectedLetters([]);
		activeLettersIndexes.current.clear();
	};

	const drawLetters = (): void => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		letterPositions.forEach((letter) => {
			const padding = 5;
			ctx.fillStyle = "#f0f0f0";
			ctx.fillRect(
				letter.x - letter.width / 2 - padding,
				letter.y - letter.height / 2 - padding,
				letter.width + padding * 2,
				letter.height + padding * 2
			);

			ctx.strokeStyle = "black";
			ctx.lineWidth = 2;
			ctx.strokeRect(
				letter.x - letter.width / 2 - padding,
				letter.y - letter.height / 2 - padding,
				letter.width + padding * 2,
				letter.height + padding * 2
			);

			ctx.fillStyle = "black";
			ctx.font = "20px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(letter.char, letter.x, letter.y);
		});
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawLetters();
			}
		}
	}, [letterPositions]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const disableTouchScroll = (event: TouchEvent) => {
				event.preventDefault();
			};

			// Attach touch listeners
			canvas.addEventListener("touchstart", disableTouchScroll, { passive: false });
			canvas.addEventListener("touchmove", disableTouchScroll, { passive: false });
			canvas.addEventListener("touchend", disableTouchScroll, { passive: false });

			return () => {
				// Cleanup listeners
				canvas.removeEventListener("touchstart", disableTouchScroll);
				canvas.removeEventListener("touchmove", disableTouchScroll);
				canvas.removeEventListener("touchend", disableTouchScroll);
			};
		}
	}, []);

	return (
	<div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
		<canvas
		ref={canvasRef}
		style={{ display: "block" }}
		onMouseMove={(e) => handleDraw(e)}
		onTouchMove={(e) => handleDraw(e)}
		onMouseUp={handleEnd}
		onTouchEnd={handleEnd}
		/>
	</div>
	);
};
