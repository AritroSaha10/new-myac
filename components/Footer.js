import Image from "next/image"

import Logo from "../imgs/logo.png"
import FacebookLogo from "../imgs/socialMedia/fb.png"
import InstagramLogo from "../imgs/socialMedia/ig.png"
import TwitterLogo from "../imgs/socialMedia/twitter.png"

const socialMedias = [
    {
        name: "Instagram",
        icon: InstagramLogo,
        link: "https://www.instagram.com/myac_mississauga/"
    },
    {
        name: "Facebook",
        icon: FacebookLogo,
        link: "https://www.facebook.com/myacmississauga/"
    },
    {
        name: "Twitter",
        icon: TwitterLogo,
        link: "https://twitter.com/myacmississauga/"
    },
]
export default function Footer() {
    return (
        <div className="flex flex-col items-center gap-4 bg-sky-900 p-8 py-16">
            <Image src={Logo} width={98} height={35} />

            <hr className="h-px bg-gray-300 border-none bg-opacity-50 w-5/6"/>

            <div className="flex text-2xl gap-8">
                {socialMedias.map(({ name, icon, link }) => (
                    <a key={name} href={link}>
                        <Image src={icon} width={30} height={30} alt={name} />
                    </a>
                ))}
            </div>
        </div>
    )
}