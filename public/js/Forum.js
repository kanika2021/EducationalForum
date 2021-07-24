// -----------------------(Tiny text editor)------------------------------------------------

tinymce.init({
    selector: 'textarea',
    plugins: 'a11ychecker powerpaste advcode casechange export formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker',
    toolbar: 'alignleft aligncenter alignright alignfull Bold Italic Underline Strikethrough Superscript Subscript numlist bullist  table',
    toolbar_mode: 'floating',
    tinycomments_mode: 'embedded',
    setup: function (editor) {
        editor.on('change', function () {
            editor.save();
        });
    },
    content_style: "body {font-family: source-serif-pro,serif;font-weight: 400;font-style: normal;}"
});

// Prevent Bootstrap dialog from blocking focusing
$(document).on('focusin', function (e) {
    if ($(e.target).closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root").length) {
        e.stopImmediatePropagation();
    }
});


// -----------------------------(tags) ----------------------------
let tags = ["General", "Science", "maths", "Engineering", "Commerce", "Medical", "Industry", "Business", "Technology"];

for (let i = 0; i < tags.length; i++) {
    let option = document.createElement("option");
    option.value = option.innerText = tags[i];
    document.getElementById("tag").appendChild(option);
}

// --------------------------------(Forum redirect)--------------------------------
$(document).ready(function (response) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token !== localStorage.getItem("eforumtoken")) {
        window.location.href = "/login";
    }
});

function checkOnline() {
    setInterval(() => {
        let p = $("#profile-badge");

        if (window.navigator.onLine !== true) {
            p.removeClass("bg-success");
            p.addClass("bg-danger");
        }
        else {
            p.addClass("bg-success");
            p.removeClass("bg-danger");
        }
    }, 1000);
}

checkOnline();

// -----------------------------------(Compose AJAX calls)----------------------------
let form = document.getElementById("compose");

let input = {};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let data = new FormData(form);
    for (let [key, value] of data) {
        input[key] = value;
    }
    if (input["describe"] === "") {
        input["describe"] = $("#mytextarea").val();
    }
    console.log(input);
    createQuestion(input);
});



function createQuestion(dataset) {
    $.ajax({
        url: "/compose",
        method: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify(dataset),
        success: function (response) {
            console.log(response);
            $('.btn-close').click();
            location.reload();
        },
        function(jqXHR, textStatus, errorThrown) {
            console.log("failure");
            console.log(textStatus);
            $('.toast').toast('show');
            document.querySelector('.toast-body').innerText = jqXHR.responseText;
        }
    })
};

