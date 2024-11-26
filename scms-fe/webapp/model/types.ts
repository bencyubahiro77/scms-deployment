export interface UserData {
    ID: string,
	firstName: string
	lastName: string;
	email: string;
	phoneNumber: string;
	role: string;
	address?: string;
	gender?: string;
	dateOfBirth?: string;
}

export interface UserInfo {
	role: string;
    firstName: string;
    lastName: string;
    
}

export interface UserRole {
	ID: string;
    roleName: string;
    description: string; 
}

export interface SelectedItem {
    ID: string;
}