import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchPhotos } from "../services/unsplashService";
import Masonry from "react-layout-masonry";
import LoadingSpinner from "../components/LoadingSpinner";
import { Photo } from "../interfaces/Photo";

const PhotoList: React.FC = () => {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [page, setPage] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(true);
	const loadedCount = useRef<number>(0);
	const prevPagePhotos = useRef<Photo[]>([]);

	useEffect(() => {
		const loadPhotos = async () => {
			setLoading(true);
			const response = await fetchPhotos(page);
			const newPhotos = response.data.filter((photo) => !prevPagePhotos.current.find((prevPhoto) => prevPhoto.id === photo.id));
			setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
			prevPagePhotos.current = newPhotos;
			loadedCount.current = 0;
		};
		loadPhotos();
	}, [page]);

	const handleScroll = () => {
		if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleImageLoad = () => {
		const newCount = loadedCount.current + 1;
		if (newCount === photos.length) {
			setLoading(false);
		}
		return newCount;
	};

	return (
		<div className="flex w-screen items-center flex-col bg-zinc-50">
			<div className="py-8 flex flex-col gap-2">
				<h1 className="text-5xl font-bold text-center">Photo Gallery</h1>
				<p className="text-center text-gray-600 dark:text-gray-300">A collection of beautiful photos from Unsplash</p>
			</div>
			<div className="container mx-auto">
				<Masonry columns={{ 640: 1, 768: 2, 1024: 3, 1280: 4 }}>
					{photos.map((photo) => (
						<Link to={`/photos/${photo.id}`} key={photo.id} className="p-2">
							<PhotoItem photo={photo} onLoad={handleImageLoad} />
						</Link>
					))}
				</Masonry>
				{loading && (
					<div className="text-center m-4">
						<LoadingSpinner />
					</div>
				)}
			</div>
		</div>
	);
};

const PhotoItem: React.FC<{ photo: Photo; onLoad: () => void }> = ({ photo, onLoad }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	const handleImageLoad = () => {
		setIsLoaded(true);
		onLoad();
	};

	return (
		<div className="relative">
			<img className="w-full h-auto rounded-lg" src={photo.urls.regular} alt={photo.description || "Untitled"} onLoad={handleImageLoad} />
			{isLoaded && <div className="absolute bottom-0 right-0 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] p-2">{photo.user.name}</div>}
		</div>
	);
};

export default PhotoList;
