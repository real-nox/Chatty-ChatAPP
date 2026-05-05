const valid = {
    password: false,
    username: false,
    pwdcheck: false
}

const username_special_char_reg = /^[a-zA-Z0-9._-]+$/
const special_char_reg = /[!@#$%^&*()\-_=+\[\]{};':",.<>/?\\|]/
const num_range_reg = /[0-9]/
const cap_letters_char = /[A-Z]/
const low_letters_char = /[a-z]/

const passwordCheck = document.getElementById("passwordCheck")
const password = document.getElementById("pwd")
const username = document.getElementById("username")
const eye = document.getElementById("eye")

eye.addEventListener("mousedown", () => {
    password.type = "text"
    eye.innerText = "visibility"
})
eye.addEventListener("mouseup", () => {
    password.type = "password"
    eye.innerText = "visibility_off"
})
eye.addEventListener("mouseleave", () => {
    password.type = "password"
    eye.innerText = "visibility_off"
})

const username_error = document.getElementById("CheckingUsername")

function CheckValid() {
    if (valid.password && valid.pwdcheck && valid.username) {
        document.getElementById("createBTN").disabled = false
    } else {
        document.getElementById("createBTN").disabled = true
    }
}

username.addEventListener("input", (ev) => {
    let chars = SanitizeInput(ev.target.value)
    console.log(chars)
    if (!username_special_char_reg.test(chars)) {
        username_error.innerText = "Only letters, numbers, . _ - allowed"
        valid.username = false
    } else {
        username_error.innerText = ""
        valid.username = true
    }

    CheckValid()
})

password.addEventListener("input", (ev) => {
    const chars = ev.target.value
    const points = {
        capital_l: false,
        lower_l: false,
        special_char_included: false,
        numbers: false
    }

    if (cap_letters_char.test(chars)) {
        points.capital_l = true
        document.querySelector(".requirement.up").classList.add("done")
    } else {
        points.capital_l = false
        document.querySelector(".requirement.up").classList.remove("done")
    }

    if (low_letters_char.test(chars)) {
        points.lower_l = true
        document.querySelector(".requirement.low").classList.add("done")
    }
    else {
        points.lower_l = false
        document.querySelector(".requirement.low").classList.remove("done")
    }

    if (special_char_reg.test(chars)) {
        points.special_char_included = true
        document.querySelector(".requirement.sp").classList.add("done")
    } else {
        points.special_char_included = false
        document.querySelector(".requirement.sp").classList.remove("done")
    }

    if (num_range_reg.test(chars)) {
        points.numbers = true
        document.querySelector(".requirement.n").classList.add("done")
    } else {
        points.numbers = false
        document.querySelector(".requirement.n").classList.remove("done")
    }

    const score = Object.values(points).filter(Boolean).length

    const pwdC = document.getElementById("CheckingPWD")
    if (chars.length < 5) {
        pwdC.innerText = "Weak password"
        pwdC.style.color = "rgb(161, 161, 161)"
        valid.password = false
    } else {
        switch (score) {
            case 1:
                pwdC.innerText = "Weak password"
                pwdC.style.color = "rgb(117, 117, 117)"
                valid.password = false
                break;

            case 2:
                pwdC.innerText = "Medium password"
                pwdC.style.color = "rgb(38, 135, 112)"
                valid.password = false
                break;

            case 3:
                pwdC.innerText = "Good password"
                pwdC.style.color = "rgb(23, 109, 170)"
                valid.password = false
                break;

            case 4:
                pwdC.innerText = "Strong password"
                pwdC.style.color = "rgb(14, 7, 227)"
                valid.password = true
                break;
        }
        CheckValid()
    }
})

passwordCheck.addEventListener("input", (ev) => {
    if (ev.target.value != password.value) {
        document.getElementById("CheckingPassword").innerText = "PASSWORD ARE NOT MATCHED"
        valid.pwdcheck = false
    } else {
        document.getElementById("CheckingPassword").innerText = ""
        valid.pwdcheck = true
    }

    CheckValid()
})