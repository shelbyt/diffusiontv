import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import VideoModal from '../videoModal';
import { Heart } from '@phosphor-icons/react';
import { withTracking } from '../../utils/mixpanel';

interface InfiniteImageScrollProps {
	initialImages: IUserThumb[];
	fetchMoreData: () => void;
	hasMore: boolean;
	highlightTop?: boolean;
	trackingString: string
}

interface IUserThumb {
	thumbUrl: string;
	videoUrl: string;
	likeCount: number;
	createdAt: Date;
	totalLikeHeartEngageCount: number;
}

const InfiniteImageScroll: React.FC<InfiniteImageScrollProps> = ({ initialImages, fetchMoreData, hasMore, highlightTop, trackingString }) => {

	const SkeletonLoader = () => {
		return (
			<div className="w-full h-48 bg-gray-300 rounded-lg animate-pulse"></div>
		);
	};

	const [images, setImages] = useState<IUserThumb[]>(initialImages);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeVideoIndex, setActiveVideoIndex] = useState(0);

	useEffect(() => {
		setImages(initialImages);
	}, [initialImages]);

	const openModal = (index: number) => {
		setActiveVideoIndex(index);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<InfiniteScroll
			dataLength={images.length}
			next={fetchMoreData}
			hasMore={hasMore}
			loader={<div className="grid grid-cols-3 gap-1">
				{Array.from({ length: 6 }, (_, index) => (
					<SkeletonLoader key={index} />
				))}
			</div>}
		>
			<div className="mt-4 px-1">
				<div className="grid grid-cols-3 gap-1">
					{images.map((image, index) => (
						<div key={index} className="w-full h-48 overflow-hidden rounded-lg cursor-pointer relative transition-opacity duration-500">
							<img
								src={image.thumbUrl}
								className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
								onClick={withTracking(() => openModal(index), `${trackingString} video scroll: video opened   `)}
								onLoad={(e) => e.currentTarget.classList.replace('opacity-0', 'opacity-100')}
							/>
							<div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 flex items-center">
								{/* Replace Heart component as needed */}
                                    <Heart size={16} color="white" className="mr-2" />
								<span>{image.totalLikeHeartEngageCount}</span>
							</div>
							{ highlightTop && (index < 3)  && (
								<div className="badge badge-accent absolute top-2 left-2">
									Popular
								</div>
							)}
						</div>
					))}
				</div>
			</div>
			{/* Modal component to display the video. Update as needed */}
			{isModalOpen && (
				<VideoModal
					url={images[activeVideoIndex]?.videoUrl}
					isOpen={isModalOpen}
					closeModal={closeModal}
				/>
			)}
		</InfiniteScroll>
	);
};

export default InfiniteImageScroll;