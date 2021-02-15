history.scrollRestoration = "manual";
            var signInButtonRedirectUrl = '/users/login/';
            function getExperimentData(expName, experimentsData) {
                for (var i = 0; i < experimentsData.length; i++) {
                    if (experimentsData[i].experimentName === expName) {
                        return experimentsData[i];
                    }
                }
                return null;
            }
            function getFingerprintNumericValue(fingerprint) {
                var value = 0;
                for (var i = 0; i < fingerprint.length; i++) {
                    value += fingerprint.charCodeAt(i);
                }
                return value;
            }
            function defineSignInExperiment(fingerprintNumeric) {
                var signInButtonExp = getExperimentData('web_signin_button', JSON.parse(window.experimentsData));
                var version;
                if (fingerprintNumeric % 37 < 18) {
                    version = 'v1';
                } else {
                    version = 'v2';
                }
                var experimentVersion;
                for (var i = 0; i < signInButtonExp.pages.length; i++) {
                    if (signInButtonExp.pages[i].version === version) {
                        signInButtonRedirectUrl = signInButtonRedirectUrl + '?ReturnUrl=' + signInButtonExp.pages[i].data.redirectURL;
                        break;
                    }
                }
            }
            function defineHomePageVersion(fingerprintNumeric) {
                var homePageVersions = getExperimentData('web_home_page', JSON.parse(window.experimentsData));
                var reminder = fingerprintNumeric % 61;
                if (reminder <= 15) {
                    document.cookie = 'homePageVersion=v1';
                } else if (reminder > 15 && reminder <= 30) {
                    document.cookie = 'homePageVersion=v2';
                } else if (reminder > 30 && reminder <= 45) {
                    document.cookie = 'homePageVersion=v3';
                } else {
                    document.cookie = 'homePageVersion=v4';
                }
            }
            function getProcessData(fingerprint) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", window.slConfig.envURLs.processApiHost + '/api/flows?experiment=process&language=en&platform=1&fingerprint=' + fingerprint);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        sessionStorage.setItem('initialData', JSON.stringify({
                            getProcessData: JSON.parse(xhr.response)
                        }));
                    }
                }
                xhr.send();
            }
            document.addEventListener('fngprntDefined', function (event) {
                var fingerprintNumeric = getFingerprintNumericValue(event.detail);
                // defineSignInExperiment(fingerprintNumeric);
                // defineHomePageVersion(fingerprintNumeric);
                getProcessData(event.detail);
                slTrack({
                    action: 'view',
                    element: 'process_landing_page'
                });
            });



        


            var hamburgerState = 'closed';
            function toggleHamburgerMenu() {
                if (hamburgerState === 'closed') {
                    hamburgerState = 'opened';
                    document.body.classList.add('overflow-hidden');
                    window.scrollTo({top: 0});

                    var headers = document.getElementsByClassName('home__nav');
                    var navLists = document.getElementsByClassName('home__nav__list');
                    var navBurgers = document.getElementsByClassName('home__nav__burger-menu');

                    for (var i = 0; i < headers.length; i++) {
                        headers[i].classList.add('home__nav--open');
                        navLists[i].classList.add('home__nav__list--burger-menu');
                        navBurgers[i].classList.add('home__nav__burger-menu--opened');
                    }
                } else {
                    hamburgerState = 'closed';
                    document.body.classList.remove('overflow-hidden');
                    var headers = document.getElementsByClassName('home__nav');
                    var navLists = document.getElementsByClassName('home__nav__list');
                    var navBurgers = document.getElementsByClassName('home__nav__burger-menu');

                    for (var i = 0; i < headers.length; i++) {
                        headers[i].classList.remove('home__nav--open');
                        navLists[i].classList.remove('home__nav__list--burger-menu');
                        navBurgers[i].classList.remove('home__nav__burger-menu--opened');
                    }
                }
            }

            function homeHeaderShowPass() {
                var passField = document.getElementById('homeSignupPassword');
                if (passField.type === 'password') {
                    document.getElementById('homeSignUpPassEyeClosed').style.display = 'none';
                    document.getElementById('homeSignUpPassEyeOpen').style.display = 'block';
                    passField.type = 'text';
                } else {
                    document.getElementById('homeSignUpPassEyeClosed').style.display = 'block';
                    document.getElementById('homeSignUpPassEyeOpen').style.display = 'none';
                    passField.type = 'password';
                }
            }

            function setHomePage(homePageVersion) {
                // if (homePageVersion === 'v1' || homePageVersion === 'v2') {
                //     document.getElementById('homeNavigationBar').style.display = 'block';
                // }
                if (homePageVersion === 'v4' && document.cookie.indexOf('LoginState=1') > -1) {
                    document.getElementById('homeHeader-v1').style.display = 'block';
                    document.getElementById('homeNavigationBar').style.display = 'block';
                } else {
                    document.getElementById('homeHeader-' + homePageVersion).style.display = 'block';
                }
                document.getElementById('homeHeaderPlaceholder').style.display = 'none';
            }

            (function () {
                setHomePage('v4');
                // var homePageVersion;
                // var cookieWatcher = setInterval(() => {
                //     var cookies = decodeURIComponent(document.cookie).split(';');
                //     for (var i = 0; i < cookies.length; i++) {
                //         if (cookies[i].indexOf('homePageVersion') > -1) {
                //             homePageVersion = cookies[i].split('=')[1];
                //             setHomePage(homePageVersion);
                //             clearInterval(cookieWatcher);
                //             break;
                //         }
                //     }
                // }, 50);
            })();

            window.fbAsyncInit = function () {
                FB.init({
                    appId: '153040644900826',
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: 'v7.0'
                });
            };