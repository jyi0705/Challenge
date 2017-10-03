const instance1 = () => {
  
  const root = 'https://jsonplaceholder.typicode.com'
  let userInfo = {}
  let fetchCount = 0;
  
  console.log('This is Implementation #1')

  fetch(`${root}/users/1`)
    .then(res => fetchResponseHelper(res))
    .then((obj) => {
      userInfo.username = obj.username;
      userInfo.email = obj.email;
      fetchCount++;
      logUserData()
    })
    .catch(err => console.log('There has been a problem with your fetch operation: ' + err.message))

  fetch(`${root}/posts?userId=1`)
    .then(res => fetchResponseHelper(res))
    .then((obj) => {
      userInfo.posts = obj;
      fetchCount++;
      logUserData()
    })
    .catch(err => console.log('There has been a problem with your fetch operation: ' + err.message))

  fetch(`${root}/albums?userId=1`)
    .then(res => fetchResponseHelper(res))
    .then((obj) => {
      userInfo.numOfAlbums = obj.length;
      fetchCount++;
      logUserData()
    })
    .catch(err => console.log('There has been a problem with your fetch operation: ' + err.message))

  fetch(`${root}/todos?userId=1`)
    .then(res => fetchResponseHelper(res))
    .then((obj) => {
      userInfo.numOfTodos = obj.length;
      fetchCount++;
      logUserData()
    })
    .catch(err => console.log('There has been a problem with your fetch operation: ' + err.message))

  const fetchResponseHelper = (res) => {
    if(res.ok) {
      return res.json()
    }
    throw new Error('Network response was not ok.');
  }
  
  const logUserData = () => {
    if(fetchCount === 4) {
      console.log(`${userInfo.username} has ${userInfo.posts.length} posts, ${userInfo.numOfAlbums} albums, and ${userInfo.numOfTodos} todos`)
      for(let i = 0; i < 5; i++) {
        console.log(`Post ${userInfo.posts[i].id}: ${userInfo.posts[i].title}`)
      }
      window.setTimeout(() => readPostAndPostComment(userInfo.posts, userInfo.username, 5), 2000)
    }
  }

  const readPostAndPostComment = (userPostArr, username, postId = 5) => {
    fetch(`${root}/comments?postId=${postId}`)
      .then(res => fetchResponseHelper(res))
      .then((obj) => {
        console.log(`Viewing post "${userPostArr[postId-1].title}" which has ${obj.length} comments`)
        postComment(postId, "Great post!")
      })
      .catch(err => console.log('There has been a problem with your fetch operation: ' + err.message))
  }

  const postComment = (postId, comment) => {
    fetch(`${root}/comments`, {
      method: "POST",
      body: {
              postId: postId,
              name: userInfo.username,
              email: userInfo.email,
              body: comment
            }
    })
      .then(res => fetchResponseHelper(res))
      .then(data =>
        console.log(`You commented ${comment}`)
      )
      .catch(err => console.log('There has been a problem with your fetch operation: ' + err.message))
  }

}