const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if(status){
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        })
    });
}

const formSearch = document.querySelector("[form-search]");
if(formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if(keyword){
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
}

const buttonPage = document.querySelectorAll("[button-panigation]");
if(buttonPage.length > 0) {
    let url = new URL(window.location.href);

    buttonPage.forEach((button) => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-panigation");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        });
    });
}

const checkboxMulti = document.querySelector("[checkbox-multi]");

if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputcheck = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("change", () => {
        inputcheck.forEach((input) => {
            if (inputCheckAll.checked == true){
                input.checked = true;
            } else {
                input.checked = false;
            }
        })
    })

    inputcheck.forEach((input) => {
        input.addEventListener("click", () => {
            const countCheck = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            
            if(countCheck == inputcheck.length){
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })

}

const formchange_multi = document.querySelector("[form-change-multi]");
if(formchange_multi){
    let ids = [];
    formchange_multi.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;
        if(typeChange == "delete"){
            const isConfirm = confirm("Bạn có chắc muốn xóa các sản phẩm này");
            if(!isConfirm){
                return;
            }
        }

        if(inputChecked.length > 0) {
            inputChecked.forEach((input) => {
                const id = input.value;
                if(typeChange == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                };
            })
    
            const inputIds = formchange_multi.querySelector("input[name='ids']");
            inputIds.value = ids.join(", ");

            formchange_multi.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 bản ghi");
        };
    })
}

const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, 2000);
}

const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
    const uploadPreviewInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");

    uploadPreviewInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}