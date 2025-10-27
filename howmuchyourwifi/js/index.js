const howmuchyourwifi = () => {
    // cloud.vast.ai
    const processors = [
        {
            id: "rtx-590",
            title: "RTX 5090",
            costPerHour: 0.392,
            hashPerSecond: 3409100,
        },
        {
            id: "8x-rtx-5090",
            title: "8x RTX 5090",
            costPerHour: 3.740,
            hashPerSecond: 27272800,
        },
    ]
    const variations = [
        "1234567890",
        "qazwsxedcrfvtgbyhnujmikolp",
        "QAZWSXEDCRFVTGBYHNUJMIKOLP",
        "~!@#$%^&*()_+,./;'[]\\<>?:\"{}| ",
    ]

    const QR = new QRCode("qrcode", {
        correctLevel: QRCode.CorrectLevel.L,
    })

    const store = {
        password: "",
        error: false,
        errorText: "",
        combinations: 0,
        ssid: "",
        ssidPassword: "",

        onError: function() {
            document.querySelector(".app-wrapper .input-wrapper").classList[this.error ? "add" : "remove"]("error")
            document.querySelector(".app-wrapper .error-wrapper").innerHTML = this.error ? this.errorText : ""
        },

        onPassword: function() {
            if (this.password.length < 8) {
                this.set("error", false)
                this.set("combinations", 0)
                return
            }
            if (!/^[\x00-\x7F]{8,63}$/.test(this.password)) {
                this.set("combinations", 0)
                this.set("errorText", "Password must be between 8-63 readable ASCII characters")
                this.set("error", true)
                return
            }

            this.set("error", false)
            this.set("combinations", Math.pow(calculateCombinations(), this.password.length))
        },

        onCombinations: function() {
            fillProcessors()
        },

        onSsidPassword: function() {
            document.querySelector(".wifi-generator input[name=password]").value = this.ssidPassword
            updateQrCode()
        },

        onSsid: function() {
            updateQrCode()
        },

        set: function(key, value = null) {
            if (this[key] === value) return

            this[key] = value
            const callback = "on" + key.charAt(0).toUpperCase() + key.slice(1)
            if (this.hasOwnProperty(callback)) this[callback]()
        },

    }

    const initEvents = () => {
        const events = {
            "input input[name=password]": handleChangePassword,
            "input input[name=ssid]": handleChangeSsid,
            "click .refresh-button": generateQrPassword,
            "click .copy-button": copyQrPassword,
            "click a": handleClickLink,
        }

        Object.entries(events).forEach(item => {
            const [tmp, call] = item
            const [event, ...elements] = tmp.split(" ")

            elements.forEach(element => {
                document.querySelectorAll(element).forEach(node => {
                    node.addEventListener(event, call)
                })
            })
        })
    }

    const fillProcessors = () => {
        const $ = document.querySelector(".app table tbody")
        if (!$.childNodes.length) {
            processors.forEach(processor => {
                const child = document.createElement("tr")
                child.setAttribute("data-id", processor.id)
                child.innerHTML = ""
                    + "<th data-type=\"title\">" + processor.title + "</th>"
                    + "<td data-type=\"time\"></td>"
                    + "<td data-type=\"money\">$0</td>"

                $.appendChild(child)
            })
            return
        }

        processors.forEach(processor => {
            const tr = document.querySelector(".app table tbody tr[data-id=\"" + processor.id + "\"]")
            tr.querySelector("[data-type=time]").innerHTML = calculateTime(store.combinations, processor.hashPerSecond)
            tr.querySelector("[data-type=money]").innerHTML = calculateMoney(
                store.combinations,
                processor.hashPerSecond,
                processor.costPerHour,
            )
        })
    }

    const handleChangePassword = event => {
        store.set("password", event.target.value)
    }

    const handleClickLink = event => {
        const url = new URL(event.target.href)
        if (url.hostname === 'github.com') return
        event.preventDefault()
        history.pushState({ url: url.pathname }, "", url)
        goToPage(url.pathname.slice(1))
    }

    const handleChangeSsid = event => {
        store.set("ssid", event.target.value)
    }

    const calculateCombinations = () => {
        let result = 0
        variations.forEach(variation => {
            const chars = variation.split("")
            for (const char of chars) {
                if (store.password.includes(char)) {
                    result += chars.length
                    return
                }
            }
        })
        return result
    }

    const calculateTime = (combinations, hashPerSecond) => {
        const rawTime = parseInt(combinations / hashPerSecond)

        if (rawTime < 10 && store.password.length > 8 && combinations > 0) return "∞"

        const years = Math.floor(rawTime / 31536000)
        const days = Math.floor((rawTime % 31536000) / 86400)
        const hours = Math.floor(((rawTime % 31536000) % 86400) / 3600)
        const minutes = Math.floor((((rawTime % 31536000) % 86400) % 3600) / 60)
        const seconds = (((rawTime % 31536000) % 86400) % 3600) % 60
        return [
            years ? years + " years" : null,
            days ? days + " days" : null,
            hours ? hours + " hours" : null,
            minutes ? minutes + " minutes" : null,
            seconds ? seconds + " seconds" : null,
        ].filter(a => a).join(" ")
    }

    const calculateMoney = (combinations, hashPerSecond, costPerHour) => {
        const rawTime = parseInt(combinations / hashPerSecond)
        const rawCost = rawTime / 60 / 60 * costPerHour

        if (rawTime < 10 && store.password.length > 8 && combinations > 0) return "∞"

        return "$" + new Intl.NumberFormat("en-US", { maximumSignificantDigits: 2 }).format(rawCost)
    }

    const goToPage = page => {
        const $ = document.querySelector(".modal-wrapper")
        if (page === "" || !$.querySelector(".modal[data-id=\"" + page + "\"]")) {
            $.classList.remove("open")
            $.querySelectorAll(".modal").forEach(modal => modal.classList.remove("open"))
            return
        }

        $.querySelectorAll(".modal").forEach(modal => modal.classList.remove("open"))
        $.querySelector(".modal[data-id=\"" + page + "\"]").classList.add("open")
        $.classList.add("open")
        window.scrollTo(0, 0)
        $.scrollTo(0, 0)
    }

    const generateQrPassword = () => {
        const tmp = []
        for (let i = 0; i < 63; i++) {
            tmp.push(String.fromCharCode(Math.floor(Math.random() * (127 - 32) + 32)))
        }
        store.set("ssidPassword", tmp.join(""))
    }

    const updateQrCode = () => {
        const escapedPassword = store.ssidPassword.split("").map(char => {
            if (["\\", "\"", ",", ";", ":"].includes(char)) return "\\" + char
            return char
        }).join("")

        const string = [
            "WIFI:T:WPA;S:",
            store.ssid,
            ";P:",
            escapedPassword,
            ";;",
        ].join("")

        QR.makeCode(string)
    }

    const copyQrPassword = async () => {
        try {
            await navigator.clipboard.writeText(store.ssidPassword)
            alert("Your password copied to clipboard")
        } catch (error) {
            alert("Clipboard not supported")
        }
    }

    const checkAnchor = () => {
        if (window.location.hash && window.location.hash.startsWith('#/howmuchyourwifi')) {
            history.pushState({ url: window.location.hash.slice(2) }, "", window.location.hash.slice(1))
            goToPage(window.location.pathname.slice(1))
        }
    }

    checkAnchor()
    fillProcessors()
    initEvents()
    generateQrPassword()
}
document.addEventListener("DOMContentLoaded", howmuchyourwifi)
