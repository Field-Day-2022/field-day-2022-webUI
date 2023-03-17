const strToBool = {
	'true': true,
	'false': false,
	'N/A': null
};

export const strToNullableBool = (str) => {
	return strToBool[str];
};

export const utcDate = (date) => {
	return Math.floor(date);
}

export const utcNow = () => {
	return utcDate(new Date());
}