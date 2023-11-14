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