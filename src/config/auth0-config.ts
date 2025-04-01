export const auth0Config = {
  domain: "dev-ddqlc5shdgnjflib.us.auth0.com",
  clientId: "PuRVapTkQROxeo89VGuONNQDDla3Oq4c",
  authorizationParams: {
    redirect_uri: `${window.location.origin}/profile`,
  },
  cacheLocation: "localStorage",
  useRefreshTokens: true,
};
