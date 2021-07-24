console.log("forum home");


function getAllQuestions() {
    $.ajax({
        url: "/posts",
        method: "GET",
        dataType: "JSON",
        contentType: "application/json",
        success: function (response) {
            displayQuestions(response);
        },
        function(jqXHR, textStatus, errorThrown) {
            console.log("failure");
            console.log(textStatus);
        }
    })
};

getAllQuestions();

function displayQuestions(questions) {
    let container = document.getElementById("post-lists")

    for (let k = 0; k < questions.length; k++) {

        let card = document.createElement("div");
        let cardHead = document.createElement("div");
        let cardBody = document.createElement("div");
        let cardFoot = document.createElement("div");

        // Question box creation
        let question = document.createElement("h5");
        let describe = document.createElement("p");

        // adding className to container
        card.className = "card";
        cardHead.className = "card-header";
        cardBody.className = "card-body";
        cardFoot.className = "card-foot";

        // adding font to descritpion
        describe.className = "quest";

        // adding question and descritpion to element
        question.innerText = questions[k].Question;
        describe.innerHTML = questions[k].Description;

        // adding css class to element
        cardHead.classList.add("card-header");
        describe.classList.add("quest");
        cardBody.classList.add("card-body");
        cardFoot.classList.add("card-footer");

        // adding question and description to card body
        cardBody.appendChild(question);
        cardBody.appendChild(describe);

        // adding context to card header
        cardHead.innerText = questions[k].username;

        // Creating icons
        let like = document.createElement("span");
        let dislikes = document.createElement("span");
        let comments = document.createElement("span");
        let follow = document.createElement("span");
        let clock = document.createElement("span");
        like.style.cursor = "pointer";

        let followText = document.createElement("p");
        let timehistory = document.createElement("p");
        timehistory.innerText = `3 days ago`;

        followText.innerText = `Follow`;

        like.classList.add("material-icons");
        dislikes.classList.add("material-icons");
        comments.classList.add("material-icons");
        follow.classList.add("material-icons");
        clock.classList.add("material-icons");

        like.innerText = "thumb_up";
        dislikes.innerText = "thumb_down";
        comments.innerText = "question_answer";
        follow.innerText = "add_circle_outline";
        clock.innerText = "history";

        like.style.color = "grey";
        dislikes.style.color = "grey";
        comments.style.color = "grey";
        follow.style.color = "grey";

        let likeBadge = document.createElement("span");
        let dislikesBadge = document.createElement("span");
        let commentsBadge = document.createElement("span");
        let tagBadge = document.createElement("span");
        tagBadge.innerText = "General";

        likeBadge.classList.add("badge", "bg-light", "text-dark");
        dislikesBadge.classList.add("badge", "bg-light", "text-dark");
        commentsBadge.classList.add("badge", "bg-light", "text-dark");
        tagBadge.classList.add("badge", "rounded-pill", "bg-light", "text-dark");

        likeBadge.innerText = questions[k].Likes;
        dislikesBadge.innerText = questions[k].dislikes;
        commentsBadge.innerText = 0;

        let likeContainer = document.createElement("div");
        let dislikesContainer = document.createElement("div");
        let commentsContainer = document.createElement("div");
        let followContainer = document.createElement("div");
        let HistoryContainer = document.createElement("div");
        let tagContainer = document.createElement("div");

        likeContainer.dataset.userId = questions[k].userId;
        dislikesContainer.dataset.userId = questions[k].userId;
        commentsContainer.dataset.userId = questions[k].userId;

        likeContainer.dataset.questionId = questions[k]._id;
        dislikesContainer.dataset.questionId = questions[k]._id;
        commentsContainer.dataset.questionId = questions[k]._id;
        followContainer.dataset.questionId = questions[k]._id;

        likeContainer.classList.add("likeParent");
        dislikesContainer.classList.add("dislikeParent");
        commentsContainer.id = "commentParent";

        like.id = "likes";
        dislikes.id = "dislikes";
        comments.id = "comments";

        like.dataset.flag = false;
        dislikes.dataset.flag = false;

        followContainer.style.marginLeft = "auto";
        HistoryContainer.style.marginLeft = "auto";
        tagContainer.style.marginLeft = "auto";

        likeContainer.appendChild(like);
        likeContainer.appendChild(likeBadge);
        dislikesContainer.appendChild(dislikes);
        dislikesContainer.appendChild(dislikesBadge);
        commentsContainer.appendChild(comments);
        commentsContainer.appendChild(commentsBadge);
        followContainer.appendChild(followText);
        followContainer.appendChild(follow);
        HistoryContainer.appendChild(clock);
        HistoryContainer.appendChild(timehistory);
        tagContainer.appendChild(tagBadge);


        likeContainer.style.marginRight = "5px";
        dislikesContainer.style.marginRight = "5px";

        followContainer.style.display = 'flex';
        HistoryContainer.style.display = 'flex';

        cardFoot.appendChild(likeContainer);
        cardFoot.appendChild(dislikesContainer);
        cardFoot.appendChild(commentsContainer);
        cardHead.appendChild(tagContainer);
        cardHead.appendChild(followContainer);
        cardFoot.appendChild(HistoryContainer);

        cardFoot.style.display = "flex";
        cardHead.style.display = "flex";

        card.appendChild(cardHead);
        card.appendChild(cardBody);
        card.appendChild(cardFoot);
        card.style.marginTop = "5px";
        container.appendChild(card);
    }
}

window.onload = function () {

    let likeicon = document.querySelectorAll(".likeParent");
    let dislikeicon = document.getElementById("dislikes");
    let commenticon = document.getElementById("comment");

    console.log(likeicon);

    likeicon.forEach(e => {
        e.addEventListener('click', function (event) {
            console.log("like button clicked")
            let questionId = e.dataset.questionId;
            let userId = e.dataset.userId;
            let flag = e.dataset.flag;
            if (!flag)
                ajaxhandler({ Qid: questionId, flag: flag, userId: userId }, "likes", e);

        })
    });


    dislikeicon.addEventListener('click', function (e) {
        console.log("dislike button clicked ")
        let questionId = document.getElementById("dislikeParent").dataset.questionId;
        let res = ajaxhandler(questionId, "dislikes");
    });


    function ajaxhandler(data, type, classname) {
        console.log(data);
        $.ajax({
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            url: "/answers/" + type
        }).done(function (response) {
            console.log(response);
            if (type === "likes") {
                let x = classname;
                console.log(x);
                if (!data.flag)
                    x.dataset.flag = true;
                else
                    x.dataset.flag = false;
                x.children[1].innerText = response.Likes;
                x.children[0].style.color = "blue";
            }
            return response;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        });

    };
}
