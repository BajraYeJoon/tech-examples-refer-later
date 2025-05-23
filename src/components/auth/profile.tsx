import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <h1>Profile</h1>
        <img src={user?.picture} alt={user?.name} />
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>

        <button
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: window.location.origin,
              },
            })
          }
          type="button"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default Profile;
