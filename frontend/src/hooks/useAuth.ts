import { useQuery } from "@tanstack/react-query";
export interface UserType{
  isAdmin : boolean,
  firstName : string,
  lastName : string,
  email : string,
}

export interface AuthType<T> {
  isAuthenticated : boolean,
  isLoading : boolean,
  user :T
}

export const  useAuth  = () =>{
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
