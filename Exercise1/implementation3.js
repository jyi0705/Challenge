class exampleThreeConsoleScript {
  
  constructor(rootAPI, userId = 1, postIdClicked = 5, commentPosted = 'Great post!') {
    this.userId = userId
    this.postIdClicked = postIdClicked
    this.commentPosted = commentPosted
    this.rootAPI = rootAPI
    this.profileInfoArr = ['users', 'posts', 'albums', 'todos']
    this.mounted = false
    this.userDataArr = []
  }

  componentWillMount() {
    console.log('This is Implementation #3')
    this.fetchUserDataByUserId()
      .then((val) => {
        this.userDataArr = val.slice(0)
        this.render();
      })
  }

  fetchUserDataByUserId() {
    let profileInfoPromise = this.profileInfoArr.map((val) => {
      if(val === 'users') {
        return fetch(`${this.rootAPI}/${val}/${this.userId}`).then(res => this.fetchResponseHelper(res))
      }
      return fetch(`${this.rootAPI}/${val}?userId=${this.userId}`).then(res => this.fetchResponseHelper(res))
    })

    return Promise.all(profileInfoPromise).catch(err => logger(err.message))
  }

  render() {
    this.mounted = true
    this.logger('display')
    this.componentDidMount()
  }

  componentDidMount() {
    this.simulateUserActions()
  }

  simulateUserActions() {
    window.setTimeout(() => {
      this.handleUserAction('click')
      this.handleUserAction('post')
    }, 2000)
  }

  handleUserAction(action) {
    if(action === 'click') {
      this.viewPost()
    } else {
      this.postComment()
    }
  }

  viewPost() {
    fetch(`${this.rootAPI}/comments?postId=${this.postIdClicked}`).then(res => this.fetchResponseHelper(res))
      .then((comments) => {
        this.logger('view', comments.length)
      })
      .catch(err => logger(err.message))
  }

  postComment() {
    fetch(`${this.rootAPI}/comments`, {
      method: "POST",
      body: {
            postId: this.postIdClicked,
            name: this.userDataArr[0].username,
            email: this.userDataArr[0].email,
            body: this.commentPosted
          }
    })
      .then(res => this.fetchResponseHelper(res))
      .then(data => {
        this.logger('post')
      })
      .catch(err => logger(err.message))
  }

  fetchResponseHelper(res) {
    if(res.ok) {
      return res.json()
    }
    throw new Error('Network response was not ok.');
  }

  logger(action, numOfComments) {
    let helper = () => {
      let displayPostArr = this.userDataArr[1].length >= 5 ? this.userDataArr[1].slice(0, 5) : this.userDataArr[1].slice(0)
      return displayPostArr.reduce((acc, val) => {
        return `${acc}\nPost ${val.id}: ${val.title}`
      }, '')
    }

    if(this.mounted && action === 'display') {
      console.log(`${this.userDataArr[0].username} has ${this.userDataArr[1].length} posts, ${this.userDataArr[2].length} albums, and ${this.userDataArr[3].length} todos${helper()}`)
    } else if(action === 'view') {
      console.log(`Viewing post "${this.userDataArr[1][this.postIdClicked-1].title}" which has ${numOfComments} comments`)
    } else if (action === 'post'){
      console.log(`You commented ${this.commentPosted}`)
    } else {
      console.log('There has been a problem with your fetch operation: ' + action)
    }
  }

}

let instance3 = new exampleThreeConsoleScript('https://jsonplaceholder.typicode.com')
