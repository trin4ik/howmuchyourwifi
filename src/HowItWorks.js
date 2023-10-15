export default () => (
    <>
        <h1>How it works?</h1>
        <p>
            WiFi radio airwaves are available to any user, however, to secure networks, the WPA (Wi-Fi Protected Access) standard was developed, at&nbsp;the current relevant standard is WPA3.
        </p>
        <p>
            WPA allows you to set a password on&nbsp;a WiFi network, to put it crudely, this password is a cipher for all WiFi traffic within the channel for this network. This means that hackers can still intercept network traffic, but without the password they cannot decrypt it.
        </p>
        <p>
            When initialising a connection with&nbsp;the correct password, WPA provides for the exchange of private keys with&nbsp;the user, this is called a handshake. By intercepting the handshake, a hacker can &laquo;pick&nbsp;the password from&nbsp;its cast. To put it simply and&nbsp;crudely, there is no password in&nbsp;a handshake, there is its shadow. It is impossible to determine a password from&nbsp;the shadow, however, it is quite easy to get the shadow from&nbsp;any password. A hacker gets the shadow from&nbsp;the password 12345678 and&nbsp;compares it&nbsp;with&nbsp;the shadow he&nbsp;got from&nbsp;the handshake. If your&nbsp;WiFi password is 12345678, then&nbsp;the shadows will match.
        </p>
        <p>
            Thus, hackers can &laquo;pick&raquo; passwords by simple brute force, i.e. get shadows from&nbsp;00000000, 00000001, 00000002, etc. This kind of attack is called bruteforce.
        </p>
        <p>
            As is not&nbsp;difficult to guess, the longer the password, the harder it is to&laquo;pick&raquo;. That is why in&nbsp;2000&nbsp;year, when the WPA format was developed, its founders set a restriction&nbsp;&mdash; the password must be at least 8 characters long. At the time, it seemed to be a permanent defence against&nbsp;picking. But&nbsp;&laquo;then&raquo;, these are the times where Intel's flagship was a single-core Pentium III 866Mhz. Modern GPUs like Nvidia 4090 are thousands of times more powerful, and&nbsp;picking a password of even&nbsp;8 characters is not&nbsp;such a difficult task anymore.
        </p>
        <p>
            By intercepting a handshake, and&nbsp;for this hacker just needs to be close to&nbsp;your network (for example, it can be a neighbour's child), most often the hacker is able to &laquo;pick&raquo; your password, spending only $100.
        </p>
        <p>
            <a href={"/why-its-important"}>Why it`s important?</a>
        </p>
    </>
)