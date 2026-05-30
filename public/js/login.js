const passwordCheck = document.getElementById("passwordCheck")
const password = document.getElementById("pwd")
const eye = document.getElementById("eye")

if (eye) {
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
}

document.getElementById("email").addEventListener("input", (ev) => {
    document.getElementById("email").value = SanitizeInput(ev.target.value)
    console.log(SanitizeInput(ev.target.value))
})

if (passwordCheck) {
    const username_special_char_reg = /^[a-z1-Z0-9._-]+$/
    const special_char_reg = /[!@#$%^&*()\-_=+\[\]{};':",.<>/?\\|]/
    const num_range_reg = /[0-9]/
    const cap_letters_char = /[A-Z]/
    const low_letters_char = /[a-z]/

    const valid = {
        password: false,
        pwdcheck: false
    }

    password.addEventListener("input", (ev) => {
        let chars = ev.target.value

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
        let chars = ev.target.value
        if (chars != password.value) {
            document.getElementById("CheckingPassword").innerText = "PASSWORD ARE NOT MATCHED"
            valid.pwdcheck = false
        } else {
            document.getElementById("CheckingPassword").innerText = ""
            valid.pwdcheck = true
        }

        CheckValid()
    })

    function CheckValid() {
        if (valid.password && valid.pwdcheck) {
            document.getElementById("changePASS").disabled = false
        } else {
            document.getElementById("changePASS").disabled = true
        }
    }
}