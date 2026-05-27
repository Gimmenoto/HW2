function fetchUser(userId) {
  return Promise.resolve({ id: userId, username: "test" });
}

function fetchPosts(username) {
  return Promise.resolve([
    {  title: "First Post", writer: username },
    {  title: "Second Post", writer: username }
  ]);
}
async function getUserData(userId) {
  const user = await fetchUser(userId);
  const posts = await fetchPosts(user.username);
  return {
    user,
    posts
  };
}

let test = getUserData(10).then(result => console.log(result));