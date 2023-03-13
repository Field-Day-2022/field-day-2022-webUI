const strToBool = {
	'true': true,
	'false': false,
	'N/A': null
};

export const strToNullableBool = (str) => {
	return strToBool[str];
};
