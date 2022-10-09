const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
let slug = params.slug ? params.slug : "not available";
console.log("Slug", slug)

const CheckRo = async () => {
    try {
        let ro = await fetch('https://flitty-backend.herokuapp.com/test/chkget');
        console.log(await ro.json());
    } catch (error) {
        console.log('error in upper patch: ', error);
    }

    try {
        let ro = await fetch('https://flitty-backend.herokuapp.com/test/chkpatch', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "name": "Abc" })
        });
        console.log(await ro.json());
    } catch (error) {
        console.log('error in upper patch: ', error);
    }

    try {
        let ro = await fetch('https://flitty-backend.herokuapp.com/test/chkpost', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "name": "Abc" })
        });
        console.log(await ro.json());
    } catch (error) {
        console.log('error in upper patch: ', error);
    }

    try {
        let ro = await fetch('https://flitty-backend.herokuapp.com/test/chkput', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "name": "Abc" })
        });
        console.log(await ro.json());
    } catch (error) {
        console.log('error in upper patch: ', error);
    }
}
CheckRo();

let a = localStorage.getItem('userTrack')
console.log(a);
if (a === null) {
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
    };
    console.log(typeof (obj.keyId));
    localStorage.setItem('userTrack', JSON.stringify(obj))
    console.log('inside first set', obj)

    fetch("https://su4jfh2t4i.execute-api.ap-south-1.amazonaws.com/dev/flitty/postUser", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    }).then((response) => response.json())
        .then((data) => console.log('obj set for the first Time', data))
        .catch((err) => console.log('error in homepage post req of post user: ', err));
}
else {
    let data = JSON.parse(a)
    data.homepage += 1
    data.route = slug
    console.log('data in homepage else: ', data);
    localStorage.setItem('userTrack', JSON.stringify(data))
    fetch("https://su4jfh2t4i.execute-api.ap-south-1.amazonaws.com/dev/flitty/patchHomepageUser", {
        method: "PATCH", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            'keyId': data.keyId,
            'homepage': data.homepage,
            'route': data.slug
        }),
    }).then((response) => response.json())
        .then((data) => console.log('found', data))
        .catch((err) => console.log('error in homepage in patch req: ', err));
}
