import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { tweetsData } from './data.mjs'


function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        
        <div>
            <div class="user">
                <p class="handle">${tweet.handle}<span class="material-symbols-outlined verified">
                verified
                </span></p>
               
            </div>
            
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
 // <p>
                //     ${tweet.handle === '@Sobit' ? `<span class="material-symbols-outlined delete-btn" id="my-tweet" data-delete="${tweet.uuid}">delete</span>` : ''}
                // </p>

   return feedHtml 
}


function render(){
    let feedData = getFeedHtml()
    document.getElementById('feed').innerHTML = feedData
}

render()


function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}


function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}



function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}






let newTweetObjects = JSON.parse(localStorage.getItem("newTweetsData")) || []
newTweetObjects.map((item) => {
    tweetsData.unshift(item)
    console.log(tweetsData)
    render()
})



function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    
    let newTweetObject = {
        handle: `@Sobit`,
        profilePic: `images/sobitlogo.jpg`,
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
    }

   

    if(tweetInput.value) {
        tweetsData.unshift(newTweetObject)
        newTweetObjects.push(newTweetObject)
    }
    
    localStorage.setItem('newTweetsData', JSON.stringify(newTweetObjects))
    
    
    tweetInput.value = ''

    // localTweets()
    render()
}



// function handleDeleteClick(dataId){
   
    
//     const index = tweetsData.findIndex(tweet => tweet.uuid === dataId);
//     console.log(index)

//     for(let tweet of newTweetObjects){
//         if(tweet.uuid === dataId){
//            localStorage.removeItem(tweet)
//         }
//     }
//     render()

//     console.log(tweetsData[index])

// }





document.addEventListener('DOMContentLoaded', ()=>{
    document.addEventListener('click', function(e){
        if(e.target.dataset.like){
           handleLikeClick(e.target.dataset.like) 
        }
        else if(e.target.dataset.retweet){
            handleRetweetClick(e.target.dataset.retweet)
        }
        else if(e.target.dataset.reply){
            handleReplyClick(e.target.dataset.reply)
        }
        // else if(e.target.id === 'my-tweet'){
        // else if(e.target.dataset.delete){
        //     handleDeleteClick(e.target.dataset.delete)
        // }
        else if(e.target.id === 'tweet-btn'){
            handleTweetBtnClick()
        }
    })
     
})