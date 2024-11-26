export default {
	formatValue: (value: string) => {
		return value?.toUpperCase();
	},

	validateEmail(email: string): boolean {
		const mailregex = /^\w+[\w-+.]*@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
		// Return true if valid, false otherwise
		return mailregex.test(email);
	},

	decodeToken(token:string) {
		// Split the token into its parts
		const parts = token.split('.');
		if (parts.length !== 3) {
			throw new Error('Invalid JWT token');
		}
		// Decode the payload (the second part of the JWT)
		const payload = parts[1];
		// Decode the base64 URL-encoded payload
		const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
	
		return decodedPayload;
	}
};
