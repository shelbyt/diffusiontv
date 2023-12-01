interface EngagementRequestBody {
	userId: string;
	imageId: string;
	liked?: boolean;
	bookmarked?: boolean;
}
export async function toggleBookmark(userId: string, imageId: string) {
	try {
		const requestBody: EngagementRequestBody = {
			userId: userId,
			imageId: imageId,
		};

		console.log("Request body = ", requestBody);

		const response = await fetch('/api/engagement/toggleBookmark', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		if (response.status === 200) {
			const data = await response.json();
			return data
		}
	} catch (error) {
		console.error('Error toggling engagement:', error);
	}
}

export async function toggleLike(userId: string, imageId: string) {
	try {
		const requestBody: EngagementRequestBody = {
			userId: userId,
			imageId: imageId,
		};

		const response = await fetch('/api/engagement/toggleLike', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		if (response.status === 200) {
			const data = await response.json();
			return data
		}
	} catch (error) {
		console.error('Error toggling engagement:', error);
	}
}