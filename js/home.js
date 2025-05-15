let contentArea = document.getElementById("contentArea");
let searchPanel = document.getElementById("searchPanel");
let submitButton;

$(document).ready(() => {
    searchByName("").then(() => {
        $(".main-loader").fadeOut(500)
        $("body").css("overflow", "visible")

    })
})

function openSidebar() {
    $(".sidebar-menu").animate({
        left: 0
    }, 500)


    $(".toggle-icon").removeClass("fa-align-justify");
    $(".toggle-icon").addClass("fa-x");


    for (let i = 0; i < 5; i++) {
        $(".navigation li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeSidebar() {
    let menuWidth = $(".sidebar-menu .menu-tab").outerWidth()
    $(".sidebar-menu").animate({
        left: -menuWidth
    }, 500)

    $(".toggle-icon").addClass("fa-align-justify");
    $(".toggle-icon").removeClass("fa-x");


    $(".navigation li").animate({
        top: 300
    }, 500)
}

closeSidebar()
$(".sidebar-menu i.toggle-icon").click(() => {
    if ($(".sidebar-menu").css("left") == "0px") {
        closeSidebar()
    } else {
        openSidebar()
    }
})




function displayDishes(arr) {
    let output = "";

    for (let i = 0; i < arr.length; i++) {
        output += `
        <div class="col-md-3">
                <div onclick="fetchDishDetails('${arr[i].idMeal}')" class="dish position-relative overflow-hidden rounded-2 pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="dish-overlay position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }

    contentArea.innerHTML = output
}



async function fetchCategories() {
    contentArea.innerHTML = ""
    $(".content-loader").fadeIn(300)
    searchPanel.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()

    displayCategories(response.categories)
    $(".content-loader").fadeOut(300)

}

function displayCategories(arr) {
    let output = "";

    for (let i = 0; i < arr.length; i++) {
        output += `
        <div class="col-md-3">
                <div onclick="filterByCategory('${arr[i].strCategory}')" class="dish position-relative overflow-hidden rounded-2 pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="dish-overlay position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }

    contentArea.innerHTML = output
}


async function fetchRegions() {
    contentArea.innerHTML = ""
    $(".content-loader").fadeIn(300)

    searchPanel.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    console.log(respone.meals);

    displayRegions(respone.meals)
    $(".content-loader").fadeOut(300)

}


function displayRegions(arr) {
    let output = "";

    for (let i = 0; i < arr.length; i++) {
        output += `
        <div class="col-md-3">
                <div onclick="filterByRegion('${arr[i].strArea}')" class="rounded-2 text-center pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }

    contentArea.innerHTML = output
}


async function fetchIngredients() {
    contentArea.innerHTML = ""
    $(".content-loader").fadeIn(300)

    searchPanel.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    console.log(respone.meals);

    displayIngredients(respone.meals.slice(0, 20))
    $(".content-loader").fadeOut(300)

}


function displayIngredients(arr) {
    let output = "";

    for (let i = 0; i < arr.length; i++) {
        output += `
        <div class="col-md-3">
                <div onclick="filterByIngredient('${arr[i].strIngredient}')" class="rounded-2 text-center pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    contentArea.innerHTML = output
}


async function filterByCategory(category) {
    contentArea.innerHTML = ""
    $(".content-loader").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()


    displayDishes(response.meals.slice(0, 20))
    $(".content-loader").fadeOut(300)

}



async function filterByRegion(region) {
    contentArea.innerHTML = ""
    $(".content-loader").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${region}`)
    response = await response.json()


    displayDishes(response.meals.slice(0, 20))
    $(".content-loader").fadeOut(300)

}


async function filterByIngredient(ingredient) {
    contentArea.innerHTML = ""
    $(".content-loader").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    response = await response.json()


    displayDishes(response.meals.slice(0, 20))
    $(".content-loader").fadeOut(300)

}

async function fetchDishDetails(dishID) {
    closeSidebar()
    contentArea.innerHTML = ""
    $(".content-loader").fadeIn(300)

    searchPanel.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dishID}`);
    respone = await respone.json();

    displayDishDetails(respone.meals[0])
    $(".content-loader").fadeOut(300)

}


function displayDishDetails(dish) {
    
    searchPanel.innerHTML = "";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (dish[`strIngredient${i}`]) {
            ingredients += `<li class="notification alert-info m-2 p-1">${dish[`strMeasure${i}`]} ${dish[`strIngredient${i}`]}</li>`
        }
    }

    let tags = dish.strTags?.split(",")
    // let tags = dish.strTags.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="notification alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let output = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${dish.strMealThumb}"
                    alt="">
                    <h2>${dish.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${dish.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${dish.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${dish.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${dish.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${dish.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    contentArea.innerHTML = output
}


function displaySearchInputs() {
    searchPanel.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`

    contentArea.innerHTML = ""
}

async function searchByName(term) {
    closeSidebar()
    contentArea.innerHTML = ""
    $(".content-loader").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()

    response.meals ? displayDishes(response.meals) : displayDishes([])
    $(".content-loader").fadeOut(300)

}

async function searchByFirstLetter(term) {
    closeSidebar()
    contentArea.innerHTML = ""
    $(".content-loader").fadeIn(300)

    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    response = await response.json()

    response.meals ? displayDishes(response.meals) : displayDishes([])
    $(".content-loader").fadeOut(300)

}


function displayContactForm() {
    contentArea.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameField" onkeyup="validateInputs()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameError" class="notification alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailField" onkeyup="validateInputs()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailError" class="notification alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneField" onkeyup="validateInputs()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneError" class="notification alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageField" onkeyup="validateInputs()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageError" class="notification alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input id="passwordField" onkeyup="validateInputs()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordError" class="notification alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input id="confirmPasswordField" onkeyup="validateInputs()" type="password" class="form-control " placeholder="Repassword">
                <div id="confirmPasswordError" class="notification alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitButton" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitButton = document.getElementById("submitButton")


    document.getElementById("nameField").addEventListener("focus", () => {
        nameFieldTouched = true
    })

    document.getElementById("emailField").addEventListener("focus", () => {
        emailFieldTouched = true
    })

    document.getElementById("phoneField").addEventListener("focus", () => {
        phoneFieldTouched = true
    })

    document.getElementById("ageField").addEventListener("focus", () => {
        ageFieldTouched = true
    })

    document.getElementById("passwordField").addEventListener("focus", () => {
        passwordFieldTouched = true
    })

    document.getElementById("confirmPasswordField").addEventListener("focus", () => {
        confirmPasswordFieldTouched = true
    })
}

let nameFieldTouched = false;
let emailFieldTouched = false;
let phoneFieldTouched = false;
let ageFieldTouched = false;
let passwordFieldTouched = false;
let confirmPasswordFieldTouched = false;




function validateInputs() {
    if (nameFieldTouched) {
        if (validateName()) {
            document.getElementById("nameError").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameError").classList.replace("d-none", "d-block")

        }
    }
    if (emailFieldTouched) {

        if (validateEmail()) {
            document.getElementById("emailError").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailError").classList.replace("d-none", "d-block")

        }
    }

    if (phoneFieldTouched) {
        if (validatePhone()) {
            document.getElementById("phoneError").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneError").classList.replace("d-none", "d-block")

        }
    }

    if (ageFieldTouched) {
        if (validateAge()) {
            document.getElementById("ageError").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageError").classList.replace("d-none", "d-block")

        }
    }

    if (passwordFieldTouched) {
        if (validatePassword()) {
            document.getElementById("passwordError").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordError").classList.replace("d-none", "d-block")

        }
    }
    if (confirmPasswordFieldTouched) {
        if (validateConfirmPassword()) {
            document.getElementById("confirmPasswordError").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("confirmPasswordError").classList.replace("d-none", "d-block")

        }
    }


    if (validateName() &&
        validateEmail() &&
        validatePhone() &&
        validateAge() &&
        validatePassword() &&
        validateConfirmPassword()) {
        submitButton.removeAttribute("disabled")
    } else {
        submitButton.setAttribute("disabled", true)
    }
}

function validateName() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameField").value))
}

function validateEmail() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailField").value))
}

function validatePhone() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneField").value))
}

function validateAge() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageField").value))
}

function validatePassword() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordField").value))
}

function validateConfirmPassword() {
    return document.getElementById("confirmPasswordField").value == document.getElementById("passwordField").value
}