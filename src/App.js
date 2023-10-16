import "./index.css"
import { useEffect, useState, useCallback } from "react"
import HowCanIHelp from "./modal/HowCanIHelp"
import HowItWorks from "./modal/HowItWorks"
import WhatCanIDo from "./modal/WhatCanIDo"
import WhyItsImportrant from "./modal/WhyItsImportrant"
import WifiIcon from "./svg/wifi.svg.js"

const processors = [
    {
        title: "RTX 4090",
        costPerHour: 0.369,
        hashPerSecond: 2551000,
    },
    {
        title: "8x RTX 4090",
        costPerHour: 4.008,
        hashPerSecond: 20408000,
    },
]
const variations = [
    "1234567890",
    "qazwsxedcrfvtgbyhnujmikolp",
    "QAZWSXEDCRFVTGBYHNUJMIKOLP",
    "~!@#$%^&*()_+,./;'[]\\<>?:\"{}| ",
]

const pages = [
    {
        url: "/how-it-works",
        title: "How it work?",
        component: HowItWorks,
    },
    {
        url: "/why-its-important",
        title: "Why it`s important?",
        component: WhyItsImportrant,
    },
    {
        url: "/what-can-i-do",
        title: "What can i do?",
        component: WhatCanIDo,
    },
    {
        url: "https://github.com/trin4ik/howmuchyourwifi",
        title: "Github",
    },
    {
        url: "/how-can-i-help",
        title: "How can i help?",
        component: HowCanIHelp,
    },
]

const App = () => {

    const [password, setPassword] = useState("")
    const [modalClass, setModalClass] = useState("modal-wrapper")
    const [combinations, setCombinations] = useState(0)
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState("")

    useEffect(() => {
        document.querySelectorAll("a:not(.external)").forEach(link => {
            link.addEventListener("click", changePage)
        })
        changePage()
    }, [])

    useEffect(() => {
        if (password.length < 8) {
            setCombinations(0)
            setTimeout(() => setErrorText(""), 300)
            setError(false)
            return
        }
        if (!/^[\x00-\x7F]{8,63}$/.test(password)) {
            setCombinations(0)
            setErrorText("Password must be between 8-63 readable ASCII characters")
            setError(true)
            return
        }
        setError(false)
        setTimeout(() => setErrorText(""), 300)
        setCombinations(Math.pow(calculateCombinations(), password.length))
        // eslint-disable-next-line
    }, [password])

    const changePage = e => {
        const href = e?.target.href ?? window.location.href
        const url = new URL(href)
        if (url.pathname === "/") {
            setModalClass("modal-wrapper")
            window.history.pushState(null, null, url.pathname)
            e?.preventDefault()
            e?.stopPropagation()
            return
        }
        setModalClass("modal-wrapper open")
        window.history.pushState(null, null, url.pathname)
        const internalPages = pages.filter(page => page.component)
        const pageIndex = internalPages.findIndex(page => page.url === url.pathname)
        const element = document.querySelector(".modal")
        element.style.transform = "translateX(calc(-" + pageIndex + " * 100vw))"
        window.scrollTo(0, 0)
        e?.preventDefault()
        e?.stopPropagation()
    }

    const calculateCombinations = () => {
        let result = 0
        variations.forEach(variation => {
            const chars = variation.split("")
            for (const char of chars) {
                if (password.includes(char)) {
                    result += chars.length
                    return
                }
            }
        })
        return result
    }

    const timeAndMoney = useCallback(processor => {

        const rawTime = parseInt(combinations / processor.hashPerSecond)
        const rawCost = rawTime / 60 / 60 * processor.costPerHour

        if (rawTime < 10 && password.length > 8 && combinations > 0) {
            return {
                rawTime: 0,
                humanTime: "∞",
                rawCost: 0,
                humanCost: "∞",
            }
        }

        return {
            rawTime,
            humanTime: humanTime(rawTime),
            rawCost,
            humanCost: "$" + new Intl.NumberFormat("en-US", { maximumSignificantDigits: 2 }).format(rawCost),
        }
    }, [combinations])

    const humanTime = time => {
        const years = Math.floor(time / 31536000)
        const days = Math.floor((time % 31536000) / 86400)
        const hours = Math.floor(((time % 31536000) % 86400) / 3600)
        const minutes = Math.floor((((time % 31536000) % 86400) % 3600) / 60)
        const seconds = (((time % 31536000) % 86400) % 3600) % 60
        return [
            years ? years + " years" : null,
            days ? days + " days" : null,
            hours ? hours + " hours" : null,
            minutes ? minutes + " minutes" : null,
            seconds ? seconds + " seconds" : null,
        ].filter(a => a).join(" ")
    }

    return (
        <div className={"app"}>
            <div className={"app-wrapper"}>
                <div className={"title-wrapper"}>
                    <WifiIcon width={64} height={64} />
                    <h1>How much your WiFi?</h1>
                </div>
                <h4>
                    A WiFi password can`t be less than 8 characters, and in 2000 that seemed to be
                    enough. &quot;Today&quot; you can
                    find a password for almost any WiFi network for literally $100.
                    Enter your WiFi password to calculate how much money and time it would take for any child to access
                    your
                    WiFi network.
                </h4>
                <div className={"important"}>
                    <h3>
                        IMPORTANT! We do not save or share your passwords, there are no counters, no adverts on this page,
                        we do
                        not track cookies and the source code of this project is completely open and available to anyone.
                    </h3>
                </div>
                <div className={"content"}>
                    <div className={["input-wrapper", error && "error"].join(" ")}>
                        <div className={"error-wrapper"}>{errorText}</div>
                        <input
                            type={"password"}
                            placeholder={"Password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <td>Processor</td>
                            <td width={"100%"}>Time</td>
                            <td className={"right"}>Cost</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            processors.map(processor => (
                                    <tr key={processor.title}>
                                        <th>{processor.title}</th>
                                        <td>{timeAndMoney(processor).humanTime}</td>
                                        <td className={"right"}>{timeAndMoney(processor).humanCost}</td>
                                    </tr>
                                ),
                            )
                        }
                        </tbody>
                    </table>
                    <p>
                        Hackers can scale the hack fairly easily in&nbsp;an almost linear progression. In&nbsp;simple words&nbsp;&mdash; the time taken to&nbsp;find a&nbsp;password can be&nbsp;reduced by&nbsp;the number of&nbsp;processors.
                    </p>
                </div>
                <ul>
                    {
                        pages.map(page => {
                            const external = !page.component
                            return (
                                <li key={page.url}>
                                    <a target={external ? "_blank" : null} className={external ? "external" : ""}
                                       href={page.url}>{page.title}</a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className={modalClass}>
                <a className={"close"} href={"/"}>X</a>
                <div className={"modal"}>
                    {
                        pages.map(page => {
                            if (!page.component) return
                            return (
                                <div className={"page"} key={page.url}>
                                    <div className={"page-wrapper"}>{page.component()}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default App
