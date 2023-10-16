import { useEffect, useMemo, useState } from "react"
import QRCode from "react-qr-code"
import RefreshIcon from "../svg/refresh.svg.js"
import CopyIcon from "../svg/copy.svg.js"

export default () => {
    const [ssid, setSsid] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        generatePassword()
    }, [])

    const generatePassword = (length = 63) => {
        const tmp = []
        for (let i = 0; i < length; i++) {
            tmp.push(String.fromCharCode(Math.floor(Math.random() * (127 - 32) + 32)))
        }
        setPassword(tmp.join(""))
    }

    const qrCode = useMemo(() => {

        const escapedPassword = password.split('').map(char => {
            if (['\\', '"', ',', ';', ':'].includes(char)) return '\\' + char
            return char
        }).join('')

        return [
            "WIFI:T:WPA;S:",
            ssid,
            ";P:",
            escapedPassword,
            ";;",
        ].join("")
    }, [password, ssid])

    const passwordCopy = async () => {
        try {
            await navigator.clipboard.writeText(password)
            alert('Your password copied to clipboard')
        } catch (error) {
            alert('Clipboard not supported')
        }
    }

    return (
        <div className={"wifi-generator"}>
            <div className={"wifi-generator-wrapper"}>
                <div>
                    <h3>WiFi QR generator</h3>
                    <p>
                        Enter SSID (WiFi network name) and couple of time regenerate password. Copy password and change on your
                        router. Make photo of QR code and save it to favorite. Now, when you need to share your password with
                        your family or friends, just share it via the standard iOS/Android tools, or show them the QR code.
                    </p>
                    <p>For old, IoT or TV devices, use different network, most modern routers can do this.</p>
                    <div className={"inputs"}>
                        <div className={"input-wrapper"}>
                            <span>SSID:</span>
                            <input value={ssid} onChange={event => setSsid(event.target.value)}/>
                        </div>
                        <div className={"input-wrapper"}>
                            <span>Password:</span>
                            <input value={password} readOnly={true}/>
                            <button onClick={() => generatePassword()}><RefreshIcon width={30} height={30} /></button>
                            <button onClick={() => passwordCopy()}><CopyIcon width={30} height={30} /></button>
                        </div>
                    </div>
                </div>
                <div className={"qrcode"}>
                    <QRCode value={qrCode} size={"100%"} />
                </div>
            </div>
        </div>
    )
}