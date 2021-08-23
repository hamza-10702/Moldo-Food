let storage = firebase.storage();
let auth = firebase.auth();
let db = firebase.firestore();





let userName = document.getElementById('login_user_name');
let userEmail = document.getElementById('login_user_email');
let userPhone = document.getElementById('login_user_phone_name');
let userCountry = document.getElementById('login_user_country_name');
let userCity = document.getElementById('login__user_city_name');
let userPassword = document.getElementById('login_user_password');


// -------------------Register User

async function regiserUser() {
    let userCreated = await auth.createUserWithEmailAndPassword(userEmail.value, userPassword.value);
    let userUID = userCreated.user.uid;


    let user = {
        userName: userName.value,
        useremail: userEmail.value,
        userphone: userPhone.value,
        usercountry: userCountry.value,
        usercity: userCity.value,
        Useruid: userUID
    }

    await db.collection('users').doc(userUID).set(user).then(() => {
        location.href = "allResturent.html";
    });
}
// -------------------Login User
async function loginUser() {
    await firebase.auth().signInWithEmailAndPassword(userEmail.value, userPassword.value);
    window.location = "allResturent.html";


}

//// -------------------Fetch User
function fetchUsers() {
    var currentUser = firebase.auth().currentUser;
    // console.log(currentUser.uid);

}
///--------------OnAuthStatechange
function getCurrentUser() {

    firebase.auth().onAuthStateChanged((user) => {
        // console.log(user);
        if (user) {

            fetchUsers();
            // ...
        } else {
            // User is signed out
            // ...

        }
    });
}

function sendPasswordResetEmailUser() {
    try {
        let resturentEmailUser = document.getElementById('login_user_email');
        var emailAddress = resturentEmailUser.value;
        firebase.auth().sendPasswordResetEmail(emailAddress)
            .then(() => {
                console.log('email sent');
                // Password reset email sent!
                // ..
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(error);
            });
    } catch (error) {
        console.log(error)
    }


}
// Resturent Regiter
let resturentName = document.getElementById('login_resturent_name');
let resturentEmail = document.getElementById('login_email');
let resturentCountry = document.getElementById('login_country_name');
let resturentCity = document.getElementById('login_City_Num');
let resturentPassword = document.getElementById('login_password');
//Resturent Register

async function regiserResturent() {
    let userCreated = await auth.createUserWithEmailAndPassword(resturentEmail.value, resturentPassword.value);
    let resturenUid = userCreated.user.uid;
    console.log(resturenUid);
    // let imageURL = await uploadImageToStorage(UID);

    let resturent = {
        resturentname: resturentName.value,
        resturentemail: resturentEmail.value,
        resturentcountry: resturentCountry.value,
        resturentcity: resturentCity.value,
        resturentuid: resturenUid
    };


    try {
        await db.collection('Resturent').doc(resturenUid).set(resturent);
        location.href = "DashboardResturent.html";

    } catch (error) {
        console.error(error);
    }

}
/////Resturent login
async function loginResturent() {
    try {
        await firebase.auth().signInWithEmailAndPassword(resturentEmail.value, resturentPassword.value);
        window.location = "DashboardResturent.html";

    } catch (error) {
        console.error(error);
    }

}

/// Resturent Signout
function signOut() {
    firebase.auth().signOut()
        .then(() => {
            window.location = './index.html';
        })

}

/// forget Resturent password
function sendPasswordResetEmail() {
    try {
        let resturentEmail = document.getElementById('login_email');
        var emailAddress = resturentEmail.value;
        firebase.auth().sendPasswordResetEmail(emailAddress)
            .then(() => {
                console.log('email sent');
                // Password reset email sent!
                // ..
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(error);
            });
    } catch (error) {
        console.log(error)
    }
}


let itemImg = document.getElementById('upload_item_image');
let uploadImageOn = document.getElementById('avatar-custom');
let itemName = document.getElementById('Item_Name');
let itemPrice = document.getElementById('Item_Price');
let itemCategory = document.getElementById("item_selected");

async function imageSelected() {
    let image = itemImg.files[0];
    uploadImageOn.src = `./assets/${image.name}`;


}
async function addItem(element) {
    let getUrl = await uploadImageToStorage();
    var itemSelected = itemCategory.options[itemCategory.selectedIndex].text;

    console.log(getUrl, itemName.value, itemPrice.value, itemSelected);
    let Item = {
        itemImage: getUrl,
        itemname: itemName.value,
        itemprice: itemPrice.value,
        itemcatgory: itemSelected
    }
    await db.collection('Items').add(Item);
     showDataOnDom();

}

function uploadImageToStorage() {
    return new Promise(async (resolve, reject) => {
        let image = itemImg.files[0];
        let storageRef = storage.ref();
        let imageRef = storageRef.child(`Items/${image.name}`);
        await imageRef.put(image);
        let url = await imageRef.getDownloadURL();
        resolve(url);
    })
}

function getItems() {
    let ItemCardContainer = document.getElementById('Item_card_container');

var docRef = db.collection("Items");
    docRef.get()
        .then((usersSnapshot) => {
            usersSnapshot.forEach((items) => {
                let newItem = `<div class="card my-4 items-card mx-4 shadow p-3 mb-5 bg-white rounded" style="width: 18rem;">
                <img src="${items.data().itemImage}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">Item Name:</h5>
                    <p class="card-text">${items.data().itemname}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <h5>Item Price:</h5>
                        <span>
                            <p>${items.data().itemprice}</p>
                        </span>
                    </li>
                </ul>
                </div>`;
                ItemCardContainer.innerHTML += newItem;
            });

        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });

}

function showDataOnDom() {
    db.collection("Items")
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    getItems();
                }
                if (change.type === "modified") {

                }
                if (change.type === "removed") {

                }
            });
        });
}

let getResturentCard = document.getElementById('Resturent_card_container');
//////get resturent Data////////////////
function getAllResturent() {
    // var docRef = db.collection("Resturent");
    // docRef.get()
    //     .then((usersSnapshot) => {
    //         usersSnapshot.forEach((resturent) => {
    //             console.log(resturent.data().resturentcountry, '*************', resturent.id);
    //         });

    //     })
    //     .catch((error) => {
    //         console.log("Error getting document:", error);
    //     });
    
    var docRef = db.collection("Resturent");
    docRef.get()
        .then((usersSnapshot) => {
            usersSnapshot.forEach((resturent) => {
                // console.log(resturent.data().resturentcountry, '*************', resturent.id);
                let createResturen = `<div class="card my-4 items-card-restu mx-4 shadow p-3 mb-5 bg-white rounded" style="width: 18rem;">
                <img src="./assets/Slide_1.jpg" class="card-img-top" alt="..." onclick = " window.location.href ='dashboard.html' ">
                <div class="card-body">
                <h5 class="card-title" onclick = " window.location.href ='dashboard.html' ">Resturent Name:</h5>
                    <p class="card-text">${resturent.data().resturentname}</p>
                </div>
                <ul class="list-group list-group-flush" onclick = " window.location.href ='dashboard.html' ">
                    <li class="list-group-item">
                        <h5>Location</h5>
                        <span>
                            <p>${resturent.data().resturentcity}</p>
                        </span>
                    </li>
                    <li class="list-group-item">
                        <h5>Contact</h5>
                        <span>
                            <p>${resturent.data().resturentemail}</p>
                        </span>
                    </li>
                </ul>
    
            </div>
    
    `
              getResturentCard.innerHTML  += createResturen;
            });

        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });

}