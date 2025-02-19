import { Icon } from "@iconify/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
	handleFileChange,
	handlePaste,
	handleUploadClick,
	processImage,
} from "./utils";
import "./App.css";
import Meta from "../../Meta.tsx";

export const App = () => {
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [processedImage, setProcessedImage] = useState<string | null>(null);
	const [tolerance, setTolerance] = useState<number>(0);
	const [editingTolerance, setEditingTolerance] = useState<number>(tolerance);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Mémorisation de showToast avec useCallback
	const showToast = useCallback((message: string, error?: boolean) => {
		if (error) toast.error(message);
		else toast.success(message);
	}, []);

	useEffect(() => {
		const pasteHandler = (e: ClipboardEvent) =>
			handlePaste(e, setUploadedImage);
		window.addEventListener("paste", pasteHandler);
		return () => {
			window.removeEventListener("paste", pasteHandler);
		};
	}, []);

	useEffect(() => {
		if (uploadedImage) {
			processImage(
				uploadedImage,
				tolerance,
				setProcessedImage,
				showToast,
			).then();
		}
	}, [uploadedImage, tolerance, showToast]);

	return (
		<div
			style={{
				textAlign: "center",
				padding: "20px",
				fontFamily: "Arial, sans-serif",
			}}
		>
			<Meta project={"/remove_bg/"} />
			<a
				href="/"
				className="home-button"
				aria-label="Retour à la liste des projets"
			>
				<Icon icon="mdi:home" width="32" height="32" />
			</a>
			<h1>Remove (White) Pixels</h1>

			<div className="controls">
				<div className="slider-container">
					<label htmlFor="tolerance">Tolerance: {editingTolerance}</label>
					<input
						type="range"
						id="tolerance"
						min="0"
						max="255"
						value={editingTolerance}
						onChange={(e) => setEditingTolerance(Number(e.target.value))}
						onMouseUp={() => setTolerance(editingTolerance)}
						onTouchEnd={() => setTolerance(editingTolerance)}
					/>
				</div>
				<button
					type={"button"}
					className="refresh-button"
					aria-label={"Clear"}
					onClick={() => {
						setUploadedImage(null);
						setProcessedImage(null);
						setEditingTolerance(0);
					}}
				>
					<Icon
						icon="basil:refresh-outline"
						width="24"
						height="24"
						style={{ fontSize: "1.5em" }}
					/>
					<span>Clear</span>
				</button>
			</div>
			{processedImage ? (
				<img src={processedImage} alt="Processed" />
			) : (
				<input
					type="text"
					className="input-placeholder"
					onClick={() => handleUploadClick(fileInputRef)}
					onDragOver={(e) => e.preventDefault()}
					placeholder={"Click here or paste an image to get started"}
				/>
			)}
			<input
				type="file"
				ref={fileInputRef}
				accept="image/*"
				onChange={(e) => handleFileChange(e, setUploadedImage)}
			/>
			<br />

			<ToastContainer
				position={"top-center"}
				hideProgressBar={true}
				closeOnClick={true}
				className="toast-container"
			/>
		</div>
	);
};
