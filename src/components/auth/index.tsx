import { useAuth0 } from "@auth0/auth0-react";

const Auth = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <button onClick={() => loginWithRedirect()} type="button">
        Login
      </button>
    </div>
  );
};

export default Auth;
