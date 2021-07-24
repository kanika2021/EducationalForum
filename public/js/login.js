// -----------------------------(login AJAX call)--------------------------------

let form = document.getElementById("loginForm");
const input = {};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log("form event");
    const formData = new FormData(form);
    for (let [key, value] of formData) {
        console.log(key, value);
        input[key] = value;
    }
    console.log(input);

    $.ajax({
        url: "/login",
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(input),
        success: function (response) {
            console.log("success");
            localStorage.setItem("eforumtoken", response.token);
            window.location.href = "/forumpage?token=" + localStorage.getItem("eforumtoken");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("failure");
            console.log(textStatus);
        }
    });
});

