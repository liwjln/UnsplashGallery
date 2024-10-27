// src/components/PhotoDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPhotoById } from "../services/unsplashService";
import LoadingSpinner from "../components/LoadingSpinner";
import { Photo } from "../interfaces/Photo";

const PhotoDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [photo, setPhoto] = useState<Photo | null>(null);

	useEffect(() => {
		if (!id) return;
		const loadPhoto = async () => {
			const response = await fetchPhotoById(id);
			setPhoto(response.data);
		};
		loadPhoto();
	}, [id]);

	if (!photo)
		return (
			<div className="flex justify-center items-center w-screen h-screen">
				<LoadingSpinner />
			</div>
		);

	return (
		<div className="flex w-screen items-center flex-col pb-8 bg-zinc-50">
			<div className="py-8 flex flex-col gap-2">
				<h1 className="text-5xl font-bold text-center">Photo Details</h1>
				<p className="text-center text-gray-600 dark:text-gray-300">Details of the photo</p>
			</div>
			<div className="bg-white flex flex-col p-4 rounded-xl gap-4 shadow 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm">
				<div className="flex flex-col justify-center items-center gap-4">
					<img className="object-contain max-h-[640px] rounded-xl shadow-lg" src={photo.urls.regular} alt={photo.current_user_collections.title || "Untitled"} />
					<div className="flex items-center gap-2">
						<span className="font-semibold text-xl">{photo.user.name} </span> •
						<a href={`https://unsplash.com/@${photo.user.username}`} target="_blank" className="text-sky-700">
							@{photo.user.username}
						</a>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<div>
						<span className="font-semibold">Title: </span>
						{photo.current_user_collections.title || "None"}
					</div>

					<div>
						<span className="font-semibold">Description: </span>
						{photo.description || "None"}
					</div>
					<div>
						<span className="font-semibold">Link: </span>
						<a href={photo.links.html} target="_blank" className="text-sky-700">
							{photo.links.html}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PhotoDetail;
