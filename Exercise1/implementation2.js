const instance2 = () => {

  const root = 'https://jsonplaceholder.typicode.com'
  const fetchEndpoint = ['users', 'posts', 'albums', 'todos']
  const userId = 1
  let userInfo = {}
  let fetchCount = 0

  console.log('This is Implementation #2')

  const logUserData = () => {
    fetchCount++
    if(fetchCount === fetchEndpoint.length) {
      console.log(`${userInfo.users.username} has ${userInfo.posts.length} posts, ${userInfo.albums} albums, and ${userInfo.todos} todos`)
      const postsTotal = userInfo.posts.length >= 5 ? 5 : userInfo.posts.length
      for(let i = 0; i < postsTotal; i++) {
        console.log(`Post ${userInfo.posts[i].id}: ${userInfo.posts[i].title}`)
      }
      simulateUserClick()
    }
  }

  const simulateUserClick = () => {
    window.setTimeout(() => readPost(), 2000)
  }

  const readPost = (postId = userInfo.posts[4].id, postPosition = 5) => {
    fetch(`${root}/comments?postId=${postId}`)
      .then(res => fetchResponseHelper(res))
      .then((obj) => {
        console.log(`Viewing post "${userInfo.posts[postPosition-1].title}" which has ${obj.length} comments`)
        postComment(postId)
      })
  }

  const postComment = (postId, comment = "Great post!") => {
    fetch(`${root}/comments`, {
      method: "POST",
      body: {
        postId: postId,
        name: userInfo.users.username,
        email: userInfo.users.email,
        body: comment
      }
    })
      .then(res => fetchResponseHelper(res))
      .then(data =>
        console.log(`You commented ${comment}`)
      )
      .catch(err => console.log('There has been a problem with your fetch operation: ' + err.message))
  }

  const fetchResponseHelper = (res) => {
    if(res.ok) {
      return res.json()
    }
    throw new Error('Network response was not ok.');
  }

  for(let endPointStr of fetchEndpoint) {
    let fetchPromise;

    if(endPointStr === 'users') {
      fetchPromise = (
        fetch(`${root}/${endPointStr}/${userId}`)
          .then(res => fetchResponseHelper(res))
      )
    } else {
      fetchPromise = (
        fetch(`${root}/${endPointStr}?userId=${userId}`)
          .then(res => fetchResponseHelper(res))
      )
    }

    fetchPromise
      .then((obj) => {
        (endPointStr === 'posts' || endPointStr === 'users') ? userInfo[endPointStr] = obj : userInfo[endPointStr] = obj.length
        logUserData() 
      })
      .catch(err => console.log('There has been a problem with your fetch operation: ' + err.message))
  }

}