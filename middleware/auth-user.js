export default async function ({
  $auth,
  redirect
}) {
  let user = $auth.loggedIn;
  if (!user) {
    redirect(`/auth/login`);
  }
}
