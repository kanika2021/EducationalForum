// --------------------------------(Register AJAX call)----------------------------


let form = document.getElementById("registerForm");
const input = {};

let roles = ["select the role", "Teacher", "Student", "Alumini"]

let questions = ["Select the question",
    "What is your pet name?", "What is your favourite sport?", "What is your favourite colour?",
    "What is your favourite food?", "What is your favourite movie?", "What is your mobile no.?",
    "what is college id", "who is your role modal"
]

function loadroles(roles) {
    for (let k = 0; k < roles.length; k++) {
        let option = document.createElement("option");
        option.value = roles[k];
        option.innerText = roles[k];
        let parent = document.getElementById("inputGroupSelect03");
        parent.appendChild(option);
    }
}

function loadQuestion(questions) {
    for (let k = 0; k < questions.length; k++) {
        let option = document.createElement("option");
        option.value = questions[k];
        option.innerText = questions[k];
        let parent = document.getElementById("inputGroupSelect01");
        parent.appendChild(option);
    }
}


loadQuestion(questions);
loadroles(roles);




form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    for (let [key, value] of formData) {
        input[key] = value;
    }

    console.log(input);

    $.ajax({
        url: "/register",
        method: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify(input),
        success: function (response) {
            console.log(response);
            localStorage.setItem("eforumtoken", response.token);
            window.location.href = "/forumpage?token=" + localStorage.getItem("eforumtoken");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("failure");
            console.log(jqXHR);
            console.log(jqXHR.responseText);
            $('.toast').toast('show');
            document.querySelector('.toast-body').innerText = jqXHR.responseText;
        }
    })

});