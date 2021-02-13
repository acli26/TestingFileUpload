const fileInput = document.getElementById("fileUpload");

function uploadFile(e) {
    const file = e.target.files[0];
    const d = new FormData();
    d.set("file", file);
    console.log(file);
    fetch("/uploadfile", {
        method: "POST",
        body: d,
        mode: "cors",
    }).then(function (response) {
        return response.json().then(function (data) {
            console.log(data);
        }).catch(function (error) {
            throw error;
        })
    }).catch(function (error) {
        console.error(error);
    });
}

fileInput.addEventListener("change", uploadFile);