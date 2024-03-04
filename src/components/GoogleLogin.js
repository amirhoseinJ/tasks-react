import React, { useState, useEffect } from 'react';
import { loadGapiInsideDOM, loadAuth2 } from 'gapi-script';


export var tasks_all ={}
export const GoogleLogin  = () => {
    const [user, setUser] = useState(null);
    const [gapi, setGapi] = useState(null);
    const CLIENT_ID = '726688062238-mc81vvabadh0agdsaql5s3d3im3h336i.apps.googleusercontent.com';
    const scopes = 'https://www.googleapis.com/auth/tasks'

    useEffect(() => {
        const loadGapi = async () => {
            const newGapi = await loadGapiInsideDOM();
            setGapi(newGapi);
        }
        loadGapi();
    }, []);

    useEffect(() => {
        if (!gapi) return;

        const setAuth2 = async () => {
            const auth2 = await loadAuth2(gapi, CLIENT_ID, scopes)
            if (auth2.isSignedIn.get()) {
                updateUser(auth2.currentUser.get())
            } else {
                attachSignin(document.getElementById('customBtn'), auth2);
            }
        }
        setAuth2();
    }, [gapi]);

    useEffect(() => {
        if (!gapi) return;

        if (!user) {
            const setAuth2 = async () => {
                const auth2 = await loadAuth2(gapi, CLIENT_ID, scopes)
                attachSignin(document.getElementById('customBtn'), auth2);
            }
            setAuth2();
        }
    }, [user, gapi])

    const updateUser = (currentUser) => {
        const name = currentUser.getBasicProfile().getName();
        const profileImg = currentUser.getBasicProfile().getImageUrl();
        setUser({
            name: name,
            profileImg: profileImg,
        });
    };

    const attachSignin = (element, auth2) => {
        auth2.attachClickHandler(element, {},
            (googleUser) => {
                updateUser(googleUser);
            }, (error) => {
                console.log(JSON.stringify(error))
            });
    };

    const signOut = () => {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(() => {
            setUser(null);
            console.log('User signed out.');
        });
    }

    if(user) {


                gapi.load('client', () => {
                    gapi.client.load('tasks', 'v1', () => {
                        async function get() {
                            const tasklists = await gapi.client.tasks.tasklists.list({});

                            let titles = []
                            let ids = []
                            let tasks = {}
                            for (var i=0; i <tasklists['result']['items'].length;i++) {
                                titles.push(tasklists['result']['items'][i]['title'])
                                ids.push(tasklists['result']['items'][i]['id'])
                            }

                            for (var i = 0; i < titles.length; i++){
                                 let tasks_curr = await gapi.client.tasks.tasks.list({ tasklist: ids[i] });
                                 tasks[titles[i]] = tasks_curr['result']['items']
                            }

                            console.log(titles);
                            console.log(tasks);
                            tasks_all = tasks["My Tasks"]
                        }
                        get()
                    });
                });





        return (
            <div className="container">
                <h2 className={'underline font-bold text-center'}>{user.name}</h2>
                <button id="" className="bg-red-500 text-white py-2 px-4 rounded-md ml-2 mt-2" onClick={signOut}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <button id="customBtn" className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2 mt-2">
                Login
            </button>
        </div>
    );
}