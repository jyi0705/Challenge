
/** Class representing ConsoleScript */
class exampleThreeConsoleScript {
 /**
   * Create the console script.
   * @param {url} rootAPI - The url for API being used.
   * @param {number} userId - The id of the current user. Defaults to user 1 if not specified
   * @param {number} postIdClicked - The post id clicked. Defaults to post 5 if not specified
   * @param {string} commentPosted - The comment posted by user. Defaults to "Great post" if not specified
   */
  constructor(rootAPI, userId = 1, postIdClicked = 5, commentPosted = 'Great post!') {
    this.userId = userId
    this.postIdClicked = postIdClicked
    this.commentPosted = commentPosted
    this.rootAPI = rootAPI
    this.profileInfoEndpointArr = ['users', 'posts', 'albums', 'todos']
    this.mounted = false // using this to mimic react lifecycle hook
    this.userDataArr = []
  }
 /**
   * "The mounting lifecycle hook" that happens after the constructor. The user data gets fetched during mounting
   *  and once it gets it will render the "component" to the DOM
   */
  componentWillMount() {
    console.log('This is Implementation #3')
    this.fetchUserDataByUserId()
      .then((val) => {
        this.userDataArr = val.slice(0)  // to make a copy of the value that gets returned
        this.render();
      })
      .catch(err => logger(err.message))
  }
 /**
   * Creates a new array of promises that will be used with the Promise.all function
   * @return {object} Promise Object with user data
   */
  fetchUserDataByUserId() {
    let profileInfoPromise = this.profileInfoEndpointArr.map((val) => {
      if(val === 'users') {
        return fetch(`${this.rootAPI}/${val}/${this.userId}`).then(res => this.fetchResponseHelper(res))
      }
      return fetch(`${this.rootAPI}/${val}?userId=${this.userId}`).then(res => this.fetchResponseHelper(res))
    })

    return Promise.all(profileInfoPromise)
  }
 /**
   * Mimics the render() method in React that happens after the componentWillMount lifehook. "Renders the user data"
   * using the logger function. And lets the DOM know that the component mounted.
   */
  render() {
    this.mounted = true
    this.logger('display')
    this.componentDidMount()
  }
 /**
   * The react lifecycle hook that happens after render() function. Checks to make sure that the component mounted
   * before simulating the user actions
   */
  componentDidMount() {
    if(this.mounted === true) {
      this.simulateUserActions()
    }
  }
 /**
   * After a 2 seconds Bret clicks on a post. One second later he posts a comment
   */
  simulateUserActions() {
    window.setTimeout(() => {
      this.handleUserAction('click')
      window.setTimeout(() => {
        this.handleUserAction('post')
      }, 1000)
    }, 2000)
  }
 /**
   * Function to handle the user action
   * @param {string} action - The user action that interacts with the DOM
   */
  handleUserAction(action) {
    if(action === 'click') {
      this.viewPost()
    } else {
      this.postComment()
    }
  }
 /**
   * When user clicks a post the console logs the info about that post. 
   */
  viewPost() {
    fetch(`${this.rootAPI}/comments?postId=${this.postIdClicked}`).then(res => this.fetchResponseHelper(res))
      .then((comments) => {
        this.logger('view', comments.length)
      })
      .catch(err => logger(err.message))
  }
 /**
   * The comment that the user post to the blog will be logged in console using this function
   */
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
 /**
   * Helper function to practice DRY with fetch calls and handles err
   * @param {string} commentPosted - The comment posted by user. Defaults to "Great post" if not specified
   */
  fetchResponseHelper(res) {
    if(res.ok) {
      return res.json()
    }
    throw new Error('Network response was not ok.');
  }
 /**
   * Logger script that logs based on the actions in the DOM
   * @param {string} action - This is what is used to identify what to log in the console
   * @param {number} numOfComments - used to log the num of comments on a post (optional parameter)
   */
  logger(action, numOfComments) {
    let helper = () => {
      let displayPostArr = this.userDataArr[1].length >= 5 ? this.userDataArr[1].slice(0, 5) : this.userDataArr[1].slice(0) // if # of post is not > 5 then copy whole array
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
