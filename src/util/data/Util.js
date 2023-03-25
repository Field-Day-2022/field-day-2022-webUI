const strToBool = {
	'true': true,
	'false': false,
	'N/A': null
};

export const strToNullableBool = (str) => {
	return strToBool[str];
};

export const utcDate = (date) => {
	// JS gives you ms, we want s
	return Math.floor(date / 1000);
}

export const utcNow = () => {
	return utcDate(new Date());
}