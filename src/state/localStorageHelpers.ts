export const handleNavigationAway = () => {
	localStorage.setItem('hasNavigatedAway', 'true');
};

export const handleNavigationReturn = () => {
	localStorage.setItem('hasNavigatedAway', 'false');
};

export const checkHasNavigatedAway = () => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('hasNavigatedAway') === 'true';
	}
	return false;
};


export const setPendingAction = (action: string, imageId: string) => {
	localStorage.setItem('pendingAction', action);
	localStorage.setItem('pendingItem', imageId);
};
export const deletePendingAction = () => {
	localStorage.removeItem('pendingAction');
	localStorage.removeItem('pendingItem');
};

export const isPendingAction = () => {
	return localStorage.getItem('pendingAction') !== null;
};

export const getPendingAction = () => {
	if (isPendingAction()) {
		return localStorage.getItem('pendingAction')
	}
	else {
		return null;
	}
};


export const getPendingItem = () => {
	if (isPendingAction()) {
		return localStorage.getItem('pendingItem')
	}
	else {
		return null;
	}
};

