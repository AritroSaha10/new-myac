import Image from "next/image"

import Logo from "../imgs/logo.png"
import FacebookLogo from "../imgs/socialMedia/fb.png"
import InstagramLogo from "../imgs/socialMedia/ig.png"
import TwitterLogo from "../imgs/socialMedia/twitter.png"
import CivicMarkRegistered from "../imgs/civic_mark.png"

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
            <div className="flex gap-4">
                <Image src={Logo} width={98} height={35} alt="Logo" objectFit="contain" objectPosition="center" />
                <Image src={CivicMarkRegistered} width={200} height={90} alt="Registered community group logo" objectFit="contain" objectPosition="center" />
            </div>

            <hr className="h-px bg-gray-300 border-none bg-opacity-50 w-5/6"/>

            <div className="flex text-2xl gap-8">
                {socialMedias.map(({ name, icon, link }) => (
                    <a key={name} href={link}>
                        <Image src={icon} width={30} height={30} alt={name} />
                    </a>
                ))}
            </div>
            
            <p className="text-md text-gray-200">
                Made by 
                {" "}
                <a 
                    className="text-blue-300 hover:text-blue-400 transition-all duration-150 underline" href="https://aritrosaha.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                >
                    Aritro Saha
                </a>
            </p>
        </div>
    )
}