const fileInput = document.getElementById("fileUpload");

function uploadFile(e) {
    const file = e.target.files[0];
    const h = new Headers();
    const d = new FormData();
    h.set("Content-Type", "application/image");
    d.set("file", file);
    fetch("/uploadfile", {
        method: "POST",
        body: d,
        headers: h,
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