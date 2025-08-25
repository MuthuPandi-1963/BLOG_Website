export type User = {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
    isAdmin: boolean | null;
    preferredCountries: string[] | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    password: string;
}