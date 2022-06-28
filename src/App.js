import { Switch } from 'antd';
import { useEffect, useState, useRef } from 'react';
import ModalReviewBad from './components/ModalReviewBad';
import React  from 'react';
import ReactGA from "react-ga";

const activitiesLog = page => {
    const data = { page: page };
    const token = document.querySelector('meta[name=csrf-token]').getAttribute('content');

    fetch("/api/set-activities-log", {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            "X-CSRF-TOKEN": token,
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
};

let GAInit = () => {
    const shopPlan = document.querySelector('meta[name=shopPlan]').getAttribute('content');
    const gaID = document.querySelector('meta[name=gaID]').getAttribute('content');
    const gaIDFree = document.querySelector('meta[name=gaIDFree]').getAttribute('content');
    const gaIDChargePro = document.querySelector('meta[name=gaIDChargePro]').getAttribute('content');
    const gaIDChargeUnlimited = document.querySelector('meta[name=gaIDChargeUnlimited]').getAttribute('content');
    const isCharge = document.querySelector('meta[name=isCharge]').getAttribute('content');
    const planType = document.querySelector('meta[name=planType]').getAttribute('content');

    try {
        if (
            ["affiliate", "partner_test", "staff_business"].includes(
                shopPlan
            )
        ) {
            return;
        }

        // var location = `${window.location.origin}${window.location.pathname}${window.location.search}`;
        ReactGA.initialize(
            [
                {
                    trackingId: gaID,
                    gaOptions: {
                        name: "tracker1"
                    }
                },
                {
                    trackingId: gaIDFree,
                    gaOptions: {
                        name: "trackerFree"
                    }
                },
                {
                    trackingId: gaIDChargePro,
                    gaOptions: {
                        name: "trackerChargePro"
                    }
                },
                {
                    trackingId: gaIDChargeUnlimited,
                    gaOptions: {
                        name: "trackerChargeUnlimited"
                    }
                }
            ],
            { debug: false, alwaysSendToDefaultTracker: false }
        );
        if (isCharge === 'true') {
            if (planType === "pro") {
                ReactGA.pageview(window.location.pathname, [
                    "tracker1",
                    "trackerChargePro"
                ]);
                ReactGA.set({ page: window.location.pathname }, [
                    "tracker1",
                    "trackerChargePro"
                ]);
            } else {
                ReactGA.pageview(window.location.pathname, [
                    "tracker1",
                    "trackerChargeUnlimited"
                ]);
                ReactGA.set({ page: window.location.pathname }, [
                    "tracker1",
                    "trackerChargeUnlimited"
                ]);
            }
        } else {
            ReactGA.pageview(window.location.pathname, [
                "tracker1",
                "trackerFree"
            ]);
            ReactGA.set({ page: window.location.pathname }, [
                "tracker1",
                "trackerFree"
            ]);
        }
        // ReactGA.pageview(window.location.pathname, ["tracker1"]);
        // ReactGA.pageview(window.location.pathname, ["trackerFree"]);
        // ReactGA.pageview(window.location.pathname, ["trackerCharge"]);
        // console.log("pageView  = ", window.location.pathname);
        activitiesLog(window.location.pathname);
    } catch (error) {
        console.log(error);
    }
};

function App() {
  const [step, setStep] = useState(1);
  const [checked, setChecked] = useState(false);
  const [star, setStar] = useState(0);
  const [isShowFeedback, setIsShowFeedback] = useState(false);
  const [starCurrent, setStarCurrent] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const domain = document.querySelector('meta[name=domain]').getAttribute('content');
  const shopName = document.querySelector('meta[name=shop-name]').getAttribute('content');

  const timeout = useRef();
  const timeoutLoaded = useRef();

  const timeoutLoading = () => {
    timeoutLoaded.current = setTimeout(() => {
        setLoading(false)
        clearInterval(timeoutLoaded.current);
    }, 3000)
  }

  useEffect(() => {
    if(disabled) {
        timeout.current = setTimeout(() => {
            setDisabled(false)
        }, 2000)
    } else {
        clearInterval(timeout.current);
    }

    return () => clearInterval(timeout.current)
  }, [disabled])

  useEffect(() => {
      const cookies = JSON.parse(window.localStorage.getItem('isInstantPage'));
        if(cookies && (cookies.value === 1 || cookies.value === "1")) setChecked(true);

        fetch('/api/add-liquid-tags');

        GAInit();
  }, [])

    const handleMouseEnter = (number) => {
        setStar(number);
    }

    const handleMouseLeave = () => {
        setStar(starCurrent);
    }


    const handleEnabledInstancePage = (checked) => {
        if(checked) {
            setLoading(true);
            timeoutLoading();
        }
        let check = checked ? 1: 0;
        setDisabled(!checked);
        const data = { check };
        const token = document.querySelector('meta[name=csrf-token]').getAttribute('content');
        fetch('api/set-instant-page', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                "X-CSRF-TOKEN": token,
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (
                check
            ) {
                const isInstantPage = {
                    value: 1,
                }
                
                window.localStorage.setItem('isInstantPage', JSON.stringify(isInstantPage));
            } else {
                const isInstantPage = {
                    value: 2,
                }
                
                window.localStorage.setItem('isInstantPage', JSON.stringify(isInstantPage));
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        if(checked) {
            fetch(`https://www.google-analytics.com/collect?v=1&t=event&tid=UA-53113273-31&cid=e89af982-d7d8-415c-9bd0-b306d9b1ce53&ec=quick-start&ea=step-1-enable&ev=1&el=${shopName}`)
        }
        
        setChecked(checked);
    }

    const handleOpenHomeAndChat = () => {
        fetch(`https://www.google-analytics.com/collect?v=1&t=event&tid=UA-53113273-31&cid=e89af982-d7d8-415c-9bd0-b306d9b1ce53&ec=quick-start&ea=step-3-start&ev=1&el=${shopName}`)
        window.open("/your-seo-health", '_self')
    }

    const handleOpenHome = () => {
        fetch(`https://www.google-analytics.com/collect?v=1&t=event&tid=UA-53113273-31&cid=e89af982-d7d8-415c-9bd0-b306d9b1ce53&ec=quick-start&ea=step-3-x&ev=1&el=${shopName}`)
        window.open("/your-seo-health", '_self')
    }

    const openFeedback = (star) => {
        fetch(`https://www.google-analytics.com/collect?v=1&t=event&tid=UA-53113273-31&cid=e89af982-d7d8-415c-9bd0-b306d9b1ce53&ec=quick-start&ea=step-3-1234&ev=1&el=${shopName}`)
        setStarCurrent(star);
        setIsShowFeedback(true);
    }

    const openReview = (star) => {
        fetch(`https://www.google-analytics.com/collect?v=1&t=event&tid=UA-53113273-31&cid=e89af982-d7d8-415c-9bd0-b306d9b1ce53&ec=quick-start&ea=step-3-5&ev=1&el=${shopName}`)
        setStarCurrent(star);

        const a = document.createElement('a');
        a.setAttribute('href', "https://apps.shopify.com/seo-booster?#modal-show=ReviewListingModal");
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noreferrer');
        const div = document.querySelector('.redirect-review');
        div.appendChild(a);
        a.click();
        div.removeChild(a);

        window.open("/your-seo-health", '_self')
    }



  return (
    <div className="App">
      <div className='quick-start-v2'>
            <div className='quick-start-v2-logo'>
                <div>
                    <img src='/images/keyword/logo.png' alt="logo" />
                </div>
                <div>
                    <p>SEO Booster</p>
                </div>
            </div>
            <div className='quick-start-v2-content'>
                <div className={step >= 2 ? 'quick-start-v2-step completed' : 'quick-start-v2-step'}>
                    <span 
                        style={step >= 1 ? {cursor: 'pointer'} : {}}
                        onClick={e => {
                            if(step >= 1) {
                                setStep(1)
                            } else return;
                        }} 
                        className={step >= 1 ? 'completed' : ''}>1 <span>Start</span>
                    </span>
                    <span 
                        style={step >= 2 ? {cursor: 'pointer'} : {}}
                        onClick={e => {
                            if(step >= 2) {
                                setStep(2)
                            } else return;
                        }} 
                        className={step >= 2 ? 'completed' : ''}>2 <span style={{marginLeft: '-6px'}}>Preview</span>
                    </span>
                    <span 
                        style={step >= 3 ? {cursor: 'pointer'} : {}}
                        onClick={e => {
                            if(step >= 3) {
                                setStep(3)
                            } else return;
                        }} 
                        className={step >= 3 ? 'completed' : ''}>3 <span>Finish</span>
                    </span>
                </div>
                {
                    step === 1 
                    ? (
                        <div className="step1">
                            <div className='quick-start-v2-header'>
                                <h3 style={{marginBottom: 0}}>Make your pages instant in just 1 minute</h3>
                            </div>
                            <div className='quick-start-v2-step-content'>
                                <p>Improve your web performance and conversion rate with 1 click here: </p>
                                <div style={{height: 80, marginTop: 20}}>
                                    {
                                        checked 
                                        ? (
                                        <p style={{marginBottom: 20}}>
                                            {
                                                loading
                                                ? (
                                                    <span style={{position: 'relative', padding: '9px 30px', display: 'inline'}}>
                                                        <span style={{position: 'absolute', left: '10px', top: '-1px'}}>
                                                            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" x="0px"
                                                                y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40">
                                                                <path opacity="0.2" fill="#44B3CF"
                                                                    d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                                                                s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                                                                c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                                                <path fill="#44B3CF" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                                                                C22.32,8.481,24.301,9.057,26.013,10.047z">
                                                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20"
                                                                        dur="1s" repeatCount="indefinite" />
                                                                </path>
                                                            </svg>
                                                        </span>
                                                    </span>
                                                )
                                                : (
                                                    <span>
                                                        <img style={{width: 23, height: 23, marginRight: 7}} src='/images/keyword/party.png' alt="" /> 
                                                        Your store is now loading faster - There's no other setup needed
                                                    </span>
                                                )
                                            }
                                        </p>
                                        
                                        )
                                        : (<></>)
                                    }
                                    <Switch 
                                        checked={checked} 
                                        onClick={checked => handleEnabledInstancePage(checked)}
                                    />
                                </div>
                                {/* <div><img src={speed} alt="speed" /></div> */}
                                <div><img src='/images/keyword/speed.gif' alt="speed" /></div>
                                <p style={{fontSize: 12, marginBottom: '20px'}}>*/ The tool helps pre-load links, not directly affecting pagespeed metrics.</p>
                                <div>
                                    <button 
                                        className={checked && !loading ? "active" : ""} 
                                        onClick={
                                            e => {
                                                if(checked && !loading) {
                                                    setStep(2);
                                                    fetch(`https://www.google-analytics.com/collect?v=1&t=event&tid=UA-53113273-31&cid=e89af982-d7d8-415c-9bd0-b306d9b1ce53&ec=quick-start&ea=step-1-next&ev=1&el=${shopName}`)
                                                }
                                                else return;
                                            }
                                        }
                                    >
                                        NEXT
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) 
                    : step === 2
                    ?(
                        <div className="step2">
                            <div className='quick-start-v2-header'>
                                <h3 style={{marginBottom: 0}}>Preview your store</h3>
                            </div>
                            <div className='quick-start-v2-step-content'>
                                <p>Let’s click a couple of links on your store to see how faster the page load time is getting: </p>
                                <div style={{margin: '30px 0'}}>
                                    <a 
                                        onClick={() => {
                                            fetch(`https://www.google-analytics.com/collect?v=1&t=event&tid=UA-53113273-31&cid=e89af982-d7d8-415c-9bd0-b306d9b1ce53&ec=quick-start&ea=step-2-preview&ev=1&el=${shopName}`)
                                        }} 
                                        href={`https://${domain}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <img src='/images/keyword/eye-light.png' style={{width: '20px', height: '15px', marginRight: '5px', marginBottom: 3}} alt="eye" /> Go to your store and try some clicks
                                    </a>
                                </div>
                                <div 
                                    className="cool-fact"
                                    style={{
                                    margin: "40px 0 120px 0",
                                    padding: '0 11%'
                                }}>
                                    <div style={{
                                        backgroundColor: 'rgba(217, 217, 217, 0.3)',
                                        borderRadius: '6px',
                                        borderLeft: '5px solid #3F3D56',
                                        padding: '12px 15px',
                                        textAlign: 'left',
                                    }}>
                                        <p style={{lineHeight: "21px"}}>*Cool Fact: Cutting 100 milliseconds of latency would improve sales by 1%</p>
                                        <p style={{lineHeight: "21px"}}>That's why Instant page is trusted and applied in many websites of big companies including Amazon, Rakuten, Spotify... and your own website now
                                            <img src='/images/keyword/react.png' style={{width: "21px", height: "21px", marginLeft: "5px"}} alt="nice"/>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <button className="active" onClick={ e => {
                                        setStep(3)
                                        fetch(`https://www.google-analytics.com/collect?v=1&t=event&tid=UA-53113273-31&cid=e89af982-d7d8-415c-9bd0-b306d9b1ce53&ec=quick-start&ea=step-2-next&ev=1&el=${shopName}`)
                                    }}>NEXT</button>
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <>
                            <div className="step3" style={{marginBottom: 25}}>
                                <div className='quick-start-v2-header'>
                                    <h3 style={{marginBottom: 0}}>COMING UP NEXT!</h3>
                                </div>
                                <div className='quick-start-v2-step-content' style={{textAlign: 'center', padding: '25px 20px 30px 20px'}}>
                                    <p>You will learn about what should be improved on your store to be more competitive on search engines.</p>
                                    <p style={{fontSize: '13px', fontStyle: 'italic', marginTop: '15px', marginBottom: '6px'}}>*Tip: Be patient with SEO. It takes time to master but pay off forever.</p>
                                    <div>
                                        <img style={{width: '50%'}} src='/images/keyword/social.png' alt="social"></img>
                                    </div>
                                    <div>
                                        <button onClick={handleOpenHomeAndChat} style={{fontWeight: '600', fontSize: '14px' ,padding: '7px 30px', color: 'white', backgroundColor: '#58CA8C', cursor: 'pointer', marginBottom: 10}}>START NOW</button>
                                    </div>
                                </div>
                            </div>
                            <div  className="evaluate">
                                <p style={{marginBottom: 0, fontWeight: '600', paddingTop: 3, marginRight: 30}}>How’s your experience with SEO Booster so far?</p>
                                <div style={{height: '23px'}} onMouseLeave={handleMouseLeave}>
                                    <svg onClick={(e) => openFeedback(1)} onMouseEnter={e => handleMouseEnter(1)} width="24" height="23" viewBox="0 0 24 23" fill={star >= 1 ? "#FFB721" : "none"} xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.9183 8.6051C22.8511 8.39706 22.7241 8.2134 22.5532 8.07701C22.3823 7.94062 22.1751 7.85754 21.9573 7.8381L15.8963 7.2881L13.4963 1.6781C13.4105 1.47692 13.2674 1.30539 13.0849 1.18483C12.9024 1.06427 12.6885 1 12.4698 1C12.2511 1 12.0372 1.06427 11.8547 1.18483C11.6722 1.30539 11.5291 1.47692 11.4433 1.6781L9.04329 7.2871L2.98129 7.8371C2.76493 7.85888 2.55963 7.94333 2.39057 8.0801C2.22152 8.21688 2.09606 8.40002 2.02959 8.60707C1.96313 8.81411 1.95854 9.03606 2.01639 9.24567C2.07425 9.45529 2.19203 9.64346 2.35529 9.7871L6.93729 13.8051L5.58629 19.7551C5.53682 19.9683 5.55127 20.1914 5.62781 20.3964C5.70436 20.6015 5.83962 20.7795 6.0167 20.9081C6.19378 21.0368 6.40484 21.1104 6.62351 21.1198C6.84219 21.1292 7.0588 21.074 7.24629 20.9611L12.4743 17.8361L17.7003 20.9611C17.8879 21.0734 18.1044 21.128 18.3228 21.1183C18.5413 21.1086 18.752 21.0349 18.929 20.9065C19.1059 20.778 19.2412 20.6004 19.318 20.3957C19.3949 20.191 19.4099 19.9683 19.3613 19.7551L18.0103 13.8051L22.5913 9.7881C22.7553 9.64437 22.8737 9.45576 22.9318 9.24554C22.9899 9.03532 22.9852 8.81268 22.9183 8.6051V8.6051Z" stroke="#FFB721" stroke-width="2"/>
                                    </svg>
                                    <svg onClick={(e) => openFeedback(2)} onMouseEnter={e => handleMouseEnter(2)} width="24" height="23" viewBox="0 0 24 23" fill={star >= 2 ? "#FFB721" : "none"} xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.9183 8.6051C22.8511 8.39706 22.7241 8.2134 22.5532 8.07701C22.3823 7.94062 22.1751 7.85754 21.9573 7.8381L15.8963 7.2881L13.4963 1.6781C13.4105 1.47692 13.2674 1.30539 13.0849 1.18483C12.9024 1.06427 12.6885 1 12.4698 1C12.2511 1 12.0372 1.06427 11.8547 1.18483C11.6722 1.30539 11.5291 1.47692 11.4433 1.6781L9.04329 7.2871L2.98129 7.8371C2.76493 7.85888 2.55963 7.94333 2.39057 8.0801C2.22152 8.21688 2.09606 8.40002 2.02959 8.60707C1.96313 8.81411 1.95854 9.03606 2.01639 9.24567C2.07425 9.45529 2.19203 9.64346 2.35529 9.7871L6.93729 13.8051L5.58629 19.7551C5.53682 19.9683 5.55127 20.1914 5.62781 20.3964C5.70436 20.6015 5.83962 20.7795 6.0167 20.9081C6.19378 21.0368 6.40484 21.1104 6.62351 21.1198C6.84219 21.1292 7.0588 21.074 7.24629 20.9611L12.4743 17.8361L17.7003 20.9611C17.8879 21.0734 18.1044 21.128 18.3228 21.1183C18.5413 21.1086 18.752 21.0349 18.929 20.9065C19.1059 20.778 19.2412 20.6004 19.318 20.3957C19.3949 20.191 19.4099 19.9683 19.3613 19.7551L18.0103 13.8051L22.5913 9.7881C22.7553 9.64437 22.8737 9.45576 22.9318 9.24554C22.9899 9.03532 22.9852 8.81268 22.9183 8.6051V8.6051Z" stroke="#FFB721" stroke-width="2"/>
                                    </svg>
                                    <svg onClick={(e) => openFeedback(3)} onMouseEnter={e => handleMouseEnter(3)} width="24" height="23" viewBox="0 0 24 23" fill={star >= 3 ? "#FFB721" : "none"} xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.9183 8.6051C22.8511 8.39706 22.7241 8.2134 22.5532 8.07701C22.3823 7.94062 22.1751 7.85754 21.9573 7.8381L15.8963 7.2881L13.4963 1.6781C13.4105 1.47692 13.2674 1.30539 13.0849 1.18483C12.9024 1.06427 12.6885 1 12.4698 1C12.2511 1 12.0372 1.06427 11.8547 1.18483C11.6722 1.30539 11.5291 1.47692 11.4433 1.6781L9.04329 7.2871L2.98129 7.8371C2.76493 7.85888 2.55963 7.94333 2.39057 8.0801C2.22152 8.21688 2.09606 8.40002 2.02959 8.60707C1.96313 8.81411 1.95854 9.03606 2.01639 9.24567C2.07425 9.45529 2.19203 9.64346 2.35529 9.7871L6.93729 13.8051L5.58629 19.7551C5.53682 19.9683 5.55127 20.1914 5.62781 20.3964C5.70436 20.6015 5.83962 20.7795 6.0167 20.9081C6.19378 21.0368 6.40484 21.1104 6.62351 21.1198C6.84219 21.1292 7.0588 21.074 7.24629 20.9611L12.4743 17.8361L17.7003 20.9611C17.8879 21.0734 18.1044 21.128 18.3228 21.1183C18.5413 21.1086 18.752 21.0349 18.929 20.9065C19.1059 20.778 19.2412 20.6004 19.318 20.3957C19.3949 20.191 19.4099 19.9683 19.3613 19.7551L18.0103 13.8051L22.5913 9.7881C22.7553 9.64437 22.8737 9.45576 22.9318 9.24554C22.9899 9.03532 22.9852 8.81268 22.9183 8.6051V8.6051Z" stroke="#FFB721" stroke-width="2"/>
                                    </svg>
                                    <svg onClick={(e) => openFeedback(4)} onMouseEnter={e => handleMouseEnter(4)} width="24" height="23" viewBox="0 0 24 23" fill={star >= 4 ? "#FFB721" : "none"} xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.9183 8.6051C22.8511 8.39706 22.7241 8.2134 22.5532 8.07701C22.3823 7.94062 22.1751 7.85754 21.9573 7.8381L15.8963 7.2881L13.4963 1.6781C13.4105 1.47692 13.2674 1.30539 13.0849 1.18483C12.9024 1.06427 12.6885 1 12.4698 1C12.2511 1 12.0372 1.06427 11.8547 1.18483C11.6722 1.30539 11.5291 1.47692 11.4433 1.6781L9.04329 7.2871L2.98129 7.8371C2.76493 7.85888 2.55963 7.94333 2.39057 8.0801C2.22152 8.21688 2.09606 8.40002 2.02959 8.60707C1.96313 8.81411 1.95854 9.03606 2.01639 9.24567C2.07425 9.45529 2.19203 9.64346 2.35529 9.7871L6.93729 13.8051L5.58629 19.7551C5.53682 19.9683 5.55127 20.1914 5.62781 20.3964C5.70436 20.6015 5.83962 20.7795 6.0167 20.9081C6.19378 21.0368 6.40484 21.1104 6.62351 21.1198C6.84219 21.1292 7.0588 21.074 7.24629 20.9611L12.4743 17.8361L17.7003 20.9611C17.8879 21.0734 18.1044 21.128 18.3228 21.1183C18.5413 21.1086 18.752 21.0349 18.929 20.9065C19.1059 20.778 19.2412 20.6004 19.318 20.3957C19.3949 20.191 19.4099 19.9683 19.3613 19.7551L18.0103 13.8051L22.5913 9.7881C22.7553 9.64437 22.8737 9.45576 22.9318 9.24554C22.9899 9.03532 22.9852 8.81268 22.9183 8.6051V8.6051Z" stroke="#FFB721" stroke-width="2"/>
                                    </svg>
                                    <svg onClick={(e) => openReview(5)} onMouseEnter={e => handleMouseEnter(5)} width="24" height="23" viewBox="0 0 24 23" fill={star >= 5 ? "#FFB721" : "none"} xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.9183 8.6051C22.8511 8.39706 22.7241 8.2134 22.5532 8.07701C22.3823 7.94062 22.1751 7.85754 21.9573 7.8381L15.8963 7.2881L13.4963 1.6781C13.4105 1.47692 13.2674 1.30539 13.0849 1.18483C12.9024 1.06427 12.6885 1 12.4698 1C12.2511 1 12.0372 1.06427 11.8547 1.18483C11.6722 1.30539 11.5291 1.47692 11.4433 1.6781L9.04329 7.2871L2.98129 7.8371C2.76493 7.85888 2.55963 7.94333 2.39057 8.0801C2.22152 8.21688 2.09606 8.40002 2.02959 8.60707C1.96313 8.81411 1.95854 9.03606 2.01639 9.24567C2.07425 9.45529 2.19203 9.64346 2.35529 9.7871L6.93729 13.8051L5.58629 19.7551C5.53682 19.9683 5.55127 20.1914 5.62781 20.3964C5.70436 20.6015 5.83962 20.7795 6.0167 20.9081C6.19378 21.0368 6.40484 21.1104 6.62351 21.1198C6.84219 21.1292 7.0588 21.074 7.24629 20.9611L12.4743 17.8361L17.7003 20.9611C17.8879 21.0734 18.1044 21.128 18.3228 21.1183C18.5413 21.1086 18.752 21.0349 18.929 20.9065C19.1059 20.778 19.2412 20.6004 19.318 20.3957C19.3949 20.191 19.4099 19.9683 19.3613 19.7551L18.0103 13.8051L22.5913 9.7881C22.7553 9.64437 22.8737 9.45576 22.9318 9.24554C22.9899 9.03532 22.9852 8.81268 22.9183 8.6051V8.6051Z" stroke="#FFB721" stroke-width="2"/>
                                    </svg>
                                </div>
                                <img onClick={handleOpenHome} src='/images/keyword/close.png' alt="close" style={{width: 13, height: 13, position: 'absolute', top: 16, right: 16, cursor: 'pointer'}}/>
                            </div>
                        </>
                    )
                }
               <div className='redirect-review'> 
                </div>
            </div>
        </div>
        <ModalReviewBad isShow={isShowFeedback}/>
        <span className={disabled ? 'disabled active' : 'disabled'}>
            Instant page disabled <span onClick={() => setDisabled(false)} style={{fontSize: '27px', marginLeft: '7px', cursor: 'pointer'}}>&times;</span>
        </span>    
    </div>
  );
}

export default App;
