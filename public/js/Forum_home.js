console.log("forum home");



function getAllQuestions() {
    console.log("getAllQuestions() is called");
    let userId = document.getElementById("feeder").dataset.userid;
    console.log(userId);
    $.ajax({
        url: "/posts/" + userId,
        method: "GET",
        dataType: "json",
        contentType: "application/json"
    }).done(function (response) {
        console.log(response);
        displayQuestions(response);
    }).fail(function (jqXHR, textStatus, error) {
        console.log(textStatus);
    });

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
        let bookmark = document.createElement("span");
        let clock = document.createElement("span");

        like.style.cursor = "pointer";
        dislikes.style.cursor = "pointer";
        comments.style.cursor = "pointer";
        bookmark.style.cursor = "pointer";

        let timehistory = document.createElement("p");

        let createdDate = questions[k].created_at.slice(0, 10).split("-");
        let createdTime = new Date(new Date(questions[k].created_at).getTime()).toTimeString().slice(0, 9);
        console.log(createdTime);
        createdDate.push(createdTime);

        let finaltime = moment(createdDate.join(' '), "YYYYMMDD h:mm:ss").fromNow();
        timehistory.innerText = finaltime;

        like.classList.add("material-icons");
        dislikes.classList.add("material-icons");
        comments.classList.add("material-icons");
        bookmark.classList.add("material-icons");
        clock.classList.add("material-icons");

        like.innerText = "thumb_up";
        dislikes.innerText = "thumb_down";
        comments.innerText = "question_answer";
        bookmark.innerText = "bookmark_add";
        clock.innerText = "history";

        like.style.color = "grey";
        dislikes.style.color = "grey";
        comments.style.color = "grey";
        bookmark.style.color = "grey";



        let likeBadge = document.createElement("span");
        let dislikesBadge = document.createElement("span");
        let commentsBadge = document.createElement("span");
        let tagBadge = document.createElement("span");
        tagBadge.innerText = questions[k].tag;

        likeBadge.classList.add("badge", "bg-light", "text-dark");
        dislikesBadge.classList.add("badge", "bg-light", "text-dark");
        commentsBadge.classList.add("badge", "bg-light", "text-dark");
        tagBadge.classList.add("badge", "rounded-pill", "bg-light", "text-dark");

        likeBadge.innerText = questions[k].likes;
        dislikesBadge.innerText = questions[k].dislikes;
        commentsBadge.innerText = questions[k].CommentedUsers.length;

        let likeContainer = document.createElement("div");
        let dislikesContainer = document.createElement("div");
        let commentsContainer = document.createElement("div");
        let followContainer = document.createElement("div");
        let HistoryContainer = document.createElement("div");
        let tagContainer = document.createElement("div");

        likeContainer.dataset.userId = questions[k].currentUser;
        dislikesContainer.dataset.userId = questions[k].currentUser;
        commentsContainer.dataset.userId = questions[k].currentUser;

        likeContainer.dataset.questionId = questions[k]._id;
        dislikesContainer.dataset.questionId = questions[k]._id;
        commentsContainer.dataset.questionId = questions[k]._id;
        followContainer.dataset.questionId = questions[k]._id;
        followContainer.dataset.userId = questions[k].currentUser;
        followContainer.dataset.flag = false;

        if (questions[k].isBookmarked) {
            bookmark.innerText = "bookmark_added";
            bookmark.style.color = "#E93B81"
        }

        likeContainer.classList.add("likeParent");
        dislikesContainer.classList.add("dislikeParent");
        commentsContainer.classList.add("commentParent");

        like.id = "likes";
        dislikes.id = "dislikes";
        comments.id = "comments";
        bookmark.id = "bookmark";

        likeContainer.dataset.flag = questions[k].isLiked;
        if (questions[k].isLiked) {
            like.style.color = "blue";
        }

        dislikesContainer.dataset.flag = false;
        if (questions[k].isDisliked) {
            dislikes.style.color = "red";
        }

        if (questions[k].isCommented) {
            comments.style.color = "orange";
        }

        followContainer.classList.add("bookmarker");
        followContainer.style.marginLeft = "auto";
        HistoryContainer.style.marginLeft = "auto";
        tagContainer.style.marginLeft = "auto";

        likeContainer.appendChild(like);
        likeContainer.appendChild(likeBadge);
        dislikesContainer.appendChild(dislikes);
        dislikesContainer.appendChild(dislikesBadge);
        commentsContainer.appendChild(comments);
        commentsContainer.appendChild(commentsBadge);
        // followContainer.appendChild(followText);
        followContainer.appendChild(bookmark);
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
    let dislikeicon = document.querySelectorAll(".dislikeParent");
    let commenticon = document.querySelectorAll(".commentParent");
    let bookmarker = document.querySelectorAll(".bookmarker");

    console.log(likeicon);

    bookmarker.forEach(e => {
        e.addEventListener('click', function (event) {
            console.log("Bookmrk button is clicked");
            let questionId = e.dataset.questionId;
            let userId = e.dataset.userId;
            let flag = e.dataset.flag;
            let s = e.children[0].innerText;
            console.table({ questionId: questionId, userId: userId });
            console.log("value  -> " + s);
            console.log(flag);
            ajaxhandler({ Qid: questionId, flag: flag, userId: userId, value: s }, "bookmark", e);
        })
    });

    likeicon.forEach(e => {
        e.addEventListener('click', function (event) {
            console.log("like button clicked")
            let questionId = e.dataset.questionId;
            let userId = e.dataset.userId;
            let flag = e.dataset.flag;
            let s = e.children[1].innerText;
            console.log("value  -> " + s);
            console.log(flag);
            ajaxhandler({ Qid: questionId, flag: flag, userId: userId, value: s }, "likes", e);

        })
    });

    dislikeicon.forEach(e => {
        e.addEventListener('click', function (event) {
            console.log("dislike button clicked");
            let questionId = e.dataset.questionId;
            let userId = e.dataset.userId;
            let flag = e.dataset.flag;
            let s = e.children[1].innerText;
            console.log("value  -> " + s);
            console.log(flag);
            ajaxhandler({ Qid: questionId, flag: flag, userId: userId, value: s }, "dislikes", e);
        })
    });

    $('#reset-input').on('click', (e) => {
        tinymce.get("mytextarea1").setContent('');
    });

    commenticon.forEach(e => {
        e.addEventListener('click', function (event) {
            console.log("comment button clicked");

            let questionId = e.dataset.questionId;
            let userId = e.dataset.userId;
            console.table({ questionId: questionId, userId: userId });
            $('#all-answers').click();
            let setparam1 = document.getElementById("set-param1");
            setparam1.dataset.userId = userId;
            setparam1.dataset.questionId = questionId;
            let data = { questionId: questionId, action: "view" };
            ajaxCommentsHandler(data);
            let setparam2 = document.getElementById("set-param2");
            setparam2.dataset.userId = userId;
            setparam2.dataset.questionId = questionId;
            document.getElementById('myanswersubmit').addEventListener('click', (e) => {
                e.preventDefault();
                let solution = $('#mytextarea1').val();
                tinymce.get("mytextarea1").setContent('');
                let request = { questionId: questionId, userId: userId, answers: solution, action: "create" }
                createAnswers(request);
            });
        })
    });



    function ajaxCommentsHandler(data) {
        console.log(data);
        let settings;

        settings = {
            method: "GET",
            contentType: "application/json",
            url: "/allanswers?Qid=" + data.questionId
        };

        $.ajax(settings)
            .done(function (response) {
                console.log("All answers response");
                console.log(response);
                loadAnswersPage(response);
            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(textStatus);
            })
    }

    function loadAnswersPage(data) {
        let container = document.getElementById("answer-all");
        container.innerText = "";
        try {
            if (data[0].answers.length > 0) {
                for (let i = 0; i < data[0].answers.length; i++) {
                    let card = document.createElement("div");
                    let para = document.createElement("p");
                    let span = document.createElement("span");

                    card.classList.add("shadow-sm", "p-2", "mb-2", "bg-body", "rounded");
                    span.classList.add("badge", "bg-dark");


                    span.innerText = data[0].answers[i].userId;
                    para.innerHTML = data[0].answers[i].answer;

                    card.appendChild(span);
                    card.appendChild(para);
                    container.append(card);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    function createAnswers(request) {
        console.log(request);
        let settings;
        settings = {
            method: "POST",
            contentType: "application/json",
            url: "/myanswers",
            data: JSON.stringify(request),
            dataType: "json"
        };

        $.ajax(settings)
            .done(function (response) {
                console.log(response);
                let parent = $("div").find(`[data-question-id='${request.questionId}']`);
                console.log("parent");
                console.log(parent);
                let comment = $(parent[3]).children();
                console.log(comment);
                comment[0].style.color = "orange";
                comment[1].innerText = response.answers.length;

            }).fail(function (jqXHR, textStatus, error) {
                console.log(textStatus);
            });
    }

    function ajaxhandler(data, type, classname) {
        console.log(data);
        $.ajax({
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            url: "/answers/" + type
        }).done(function (response) {
            console.log("Inside ajax response");
            console.log(response);
            let x = classname;
            console.log(x);
            let parent = $("div").find(`[data-question-id='${data.Qid}']`);
            let children1 = $(parent[1]).children();
            let children2 = $(parent[2]).children();
            console.table({ parent: parent, children1: children1, children2: children2 })
            if (type === "likes") {
                if (data.flag === 'false')
                    x.dataset.flag = true;
                else
                    x.dataset.flag = false;
                console.table({ likes: response.likes, color: "blue" });
                x.children[1].textContent = response.likes;
                x.children[0].style.color = "blue";
                children2[0].style.color = "grey";
                children2[1].textContent = response.dislikes;
            }
            else if (type === "dislikes") {
                if (data.flag === 'false')
                    x.dataset.flag = true;
                else
                    x.dataset.flag = false;
                children1[0].style.color = "grey";
                children1[1].textContent = response.likes;
                console.table({ likes: response.likes, color: "blue" });
                x.children[1].innerText = response.dislikes;
                x.children[0].style.color = "red";
            } else if (type === "bookmark") {
                if (data.flag === 'false') {
                    x.dataset.flag = true;
                    x.children[0].style.color = "#E93B81";
                    x.children[0].innerText = "bookmark_added";
                }
                else {
                    x.dataset.flag = false;
                    x.children[0].style.color = "grey";
                    x.children[0].innerText = "bookmark_add";
                }

            }

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        });

    };
}
