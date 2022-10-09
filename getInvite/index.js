// ------------- Tracker Code
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
let slug = params.slug
slug && console.log(slug)
let id;

let link = "https://su4jfh2t4i.execute-api.ap-south-1.amazonaws.com/dev/flitty";

let obj = {
    keyId: Date.now(),
    subscriptionDate: '',
    subscriptionTime: '',
    firstName: '',
    secondName: '',
    email: '',
    visitDate: (new Date).toDateString(),
    visitTime: (new Date).toTimeString(),
    instagram: '',
    homepage: 0,
    formPage: 0,
    route: slug ? slug : 'Not available'
}
let a = localStorage.getItem('userTrack')
console.log(JSON.parse(a))
if (a === null) {
    localStorage.setItem('userTrack', JSON.stringify(obj))
    {
        console.log('inside first set', obj)
        fetch(`${link}/postUser`, {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        }).then((response) => response.json())
            .then((data) => {
                console.log('obj set for the first Time', data)
            }).catch((err) => console.log('error in detail page in post req: ', err));
    }
}
else {
    let data = JSON.parse(a)
    id = data.keyId
    data.formPage += 1
    console.log('fpdata', data.formPage, data)
    localStorage.setItem('userTrack', JSON.stringify(data))
    fetch(`${link}/patchFormpageUser`, {
        method: "PATCH", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "keyId": data.keyId,
            "formPage": data.formPage,
            "route": data.slug
        }),
    }).then((response) => response.json())
        .then((data) => {
            console.log('found', data)
        }).catch((err) => console.log('error in detail page in patch req: ', err));
}




//--------------------Page Code--------------------------------

let formElements = document.getElementsByClassName('mainInputs')
let firstName = formElements[0]
let secondName = formElements[1]
let email = formElements[2]
let instaLink = formElements[3]
let collapseOTP = document.getElementById('collapseOTP')
let collapseSpan = document.getElementById('collapseSpan')
let firstDigit = document.getElementById('first')
let secondDigit = document.getElementById('sec')
let thirdDigit = document.getElementById('third')
let fourthDigit = document.getElementById('fourth')
let inavalidOtpButton = document.getElementById('inavalidOtpButton')
let allOTPboxes = document.getElementsByClassName('otpInput')
let getOtpBtn = document.getElementById('getOtpBtn')
let resend = document.getElementById('resend')
let getInviteBtn = document.getElementById('getInviteBtn')
let getOtpSpan = document.getElementsByClassName('getOtpSpan')
let modalDisplay = document.getElementById('modalDisplay')
let modalHead = document.getElementsByClassName('modalHead')
let modalText = document.getElementById('modalText')
let modalSubText = document.getElementById('modalSubText')
let finalModalDisplay = document.getElementById('finalModalDisplay')
let finalSuccessBtn = document.getElementById('finalSuccessBtn')
let arr = []
let flag = 1
let time = 15
let isVerified = false
let OTP;
let date = new Date()
let currentTime = date.toLocaleTimeString()
let currentDate = date.toDateString()
console.log(currentDate, currentTime)





// functions
const otpGenerator = () => {
    let x = Math.floor(1000 + Math.random() * 9000);
    return x
}
let timeInter = () => {
    let ti = setInterval(() => {
        time--;
        inavalidOtpButton.innerText = time
        if (time < 0) {
            clearInterval(ti)
            inavalidOtpButton.innerText = ''
            resend.classList.remove('greyscale')
        }
    }, 1000);
}
function clickEvent(first, last) {
    if (first.value.length) {
        arr.push(first.value)
        document.getElementById(last).focus();
    }
    if (fourthDigit.value.length) {
        let enteredOtp = parseInt(arr.join(''))
        if (enteredOtp === OTP) {
            collapseOTP.style.display = 'none'
            getOtpBtn.innerText = 'Verified'
            getOtpBtn.classList.add('green')
            getOtpSpan[0].classList.remove('pointerEventsAll')
            for (let i = 0; i < allOTPboxes.length; i++) {
                allOTPboxes[i].classList.remove('red')
                allOTPboxes[i].classList.add('green')
            }
            isVerified = true
            const tick = `verified`
            inavalidOtpButton.innerHTML = tick
            if (flag === 0) {
                inavalidOtpButton.click()
            }
        }
        else {
            inavlidOtp()
        }
    }
}
const inavlidOtp = () => {
    timeInter()
    isVerified = false
    for (let i = 0; i < allOTPboxes.length; i++) {
        allOTPboxes[i].classList.add('red')
        allOTPboxes[3].focus()
        arr = []
    }
    if (flag === 1) {
        inavalidOtpButton.click()
        flag = 0
    }
}
function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
        return (true)
    }
    return (false)
}
let instaLinkGen = (value) => {
    let instalink;
    if (value.includes('@')) {
        var atLink = value.split('@')
        var ad = atLink[1]
        var lii = 'https://instagram.com/' + ad
        instalink = lii
    }
    else {
        let linkLength = value.split('/')
        if (linkLength.length > 1) {
            instalink = value
        }
        else {
            instalink = 'https://instagram.com/' + value
        }
    }
    return instalink
}
const otpData = async () => {
    let obj;
    let newOtp = otpGenerator()
    OTP = newOtp
    if (firstName.value === '' || secondName.value === '') {
        modalHead[0].innerHTML = 'Field Error'
        modalText.innerText = 'Name cannot be empty'
        modalSubText.innerText = 'First & second name are mandatory'
        modalDisplay.click()
    } else {
        getOtpBtn.style.pointerEvents = 'none'
        obj = {
            firstName: firstName.value,
            email: email.value,
            otp: newOtp
        }
        try {
            let r = await fetch("https://su4jfh2t4i.execute-api.ap-south-1.amazonaws.com/dev/flitty/sendOtp", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(obj),
            });
            let r1 = await r.json()
            console.log(r1)
            if (r1.errorCode === 11000) {
                // alert("email already registered")
                modalHead[0].innerHTML = 'Email Error'
                modalText.innerText = 'Email already registered'
                modalSubText.innerText = 'Please try with other email'
                modalDisplay.click()
                getOtpBtn.innerHTML = 'Get OTP'
                getOtpSpan[0].style.pointerEvents = 'all'
            }
            else {
                collapseSpan.click()
                getOtpBtn.innerHTML = 'Sent'
            }
        } catch (error) {
            modalHead[0].innerHTML = 'Server Error'
            modalText.innerText = "It's us to be blamed"
            modalSubText.innerText = 'Please try again in a bit'
            modalDisplay.click()
        }
        console.log('after req')
    }
}
const finalData = () => {
    if (firstName.value === '' || secondName.value === '' || email.value === '' || instaLink.value === '') {
        // alert('All fileds are mandatory')
        modalHead[0].innerHTML = 'Field Error'
        modalText.innerText = 'All fileds are mandatory'
        modalSubText.innerText = 'Please fill all the fields'
        modalDisplay.click()
    }
    else {
        if (isVerified != true) {
            modalHead[0].innerHTML = 'Verification Error'
            modalText.innerText = 'Email Not Verified'
            modalSubText.innerText = 'Click on get otp to verify Email'
            modalDisplay.click()
        }
        else {
            let instgramId = instaLinkGen(instaLink.value)
            obj.firstName = firstName.value,
                obj.secondName = secondName.value,
                obj.subscriptionDate = currentDate,
                obj.subscriptionTime = currentTime,
                obj.email = email.value,
                obj.instagram = instgramId
            fetch("https://su4jfh2t4i.execute-api.ap-south-1.amazonaws.com/dev/flitty/registerUser", {
                method: "PATCH", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    'keyId': id,
                    'subscriptionDate': currentDate,
                    'subscriptionTime': currentTime,
                    'firstName': firstName.value,
                    'secondName': secondName.value,
                    'email': email.value,
                    'instagram': instgramId
                }),
            }).then((res) => {
                res.json().then((data) => {
                    console.log(data)
                    finalModalDisplay.click()
                })
            }).catch((err) => {
                console.log('in catch in detail page in patch of register user', err),
                    fetch('https://su4jfh2t4i.execute-api.ap-south-1.amazonaws.com/dev/flitty/backupRegitserUser', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            'keyId': Date.now(),
                            'subscriptionDate': currentDate,
                            'subscriptionTime': currentTime,
                            'firstName': firstName.value,
                            'secondName': secondName.value,
                            'email': email.value,
                            'instagram': instgramId,
                            'visitDate': (new Date).toDateString(),
                            'visitTime': (new Date).toTimeString(),
                            'route': slug ? slug : 'Not available'
                        }),
                    }).then((res) => {
                        res.json().then((data) => {
                            console.log(data)
                            finalModalDisplay.click()
                        })
                    }).catch((err) => {
                        console.log('in ctach of catch in detail page in post req of backup register user', err);
                    })
            }
            )
        }
    }
}

const resendBtnApiReq = () => {
    let newOtp = otpGenerator()
    let obj = {
        firstName: firstName.value,
        email: email.value,
        otp: newOtp
    }
    OTP = newOtp
    {
        fetch("https://su4jfh2t4i.execute-api.ap-south-1.amazonaws.com/dev/flitty/sendOtp", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        }).then((response) => response.json())
            .then((data) => {
                console.log('otp sent', data)
            }).catch((err) => console.log('error in otp resend req: ', err));
    }
}










// Event listeners
email.addEventListener('keyup', function () {
    let res = ValidateEmail(email)
    if (res === true) {
        getOtpSpan[0].classList.add('otpClrActive')
        getOtpSpan[0].classList.add('pointerEventsAll')
    }
    else {
        getOtpSpan[0].classList.remove('otpClrActive')

    }
})
firstDigit.addEventListener('keyup', function (e) {
    if (e.keyCode === 8) {
        firstDigit.focus()
    }
})
secondDigit.addEventListener('keyup', function (e) {
    if (e.keyCode === 8) {
        firstDigit.focus()
    }
})
thirdDigit.addEventListener('keyup', function (e) {
    if (e.keyCode === 8) {
        secondDigit.focus()
    }
})
fourthDigit.addEventListener('keyup', function (e) {
    if (e.keyCode === 8) {
        thirdDigit.focus()
    }
})
getOtpBtn.addEventListener('click', function () {
    otpData()
    firstDigit.focus()
})
resend.addEventListener('click', function () {
    time = 15
    timeInter()
    resend.classList.add('greyscale')
    resendBtnApiReq()
})
getInviteBtn.addEventListener('click', function () {
    finalData()
})
finalSuccessBtn.addEventListener('click', function () {
    for (let index = 0; index < formElements.length; index++) {
        formElements[index].value = ''
    }
    window.open("https://instagram.com/flittyindia/", "_self")
})



