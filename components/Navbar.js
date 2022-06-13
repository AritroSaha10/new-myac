import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import Logo from "../imgs/logo.png";

import { GoThreeBars } from "react-icons/go"

import FacebookLogo from "../imgs/socialMedia/fb.png"
import InstagramLogo from "../imgs/socialMedia/ig.png"
import TwitterLogo from "../imgs/socialMedia/twitter.png"
import { useRouter } from "next/router";

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

const links = [
    {
        name: "Home",
        link: "/",
        id: "home",
        priority: false
    },
    {
        name: "Team",
        link: "/team",
        id: "team",
        priority: false
    },
    {
        name: "Events",
        link: "/events",
        id: "events",
        priority: false
    },
    {
        name: "Gallery",
        link: "/gallery",
        id: "gallery",
        priority: false
    },
    {
        name: "Past Events",
        link: "/past-events",
        id: "past-events",
        priority: false
    },
];



export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const currentRoute = router.route;

    return (
        <header className="bg-white py-2 sticky">
            <div className="container px-4 mx-auto lg:flex lg:items-center">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <a className="p-4">
                            <Image src={Logo} alt="logo" width={70} height={25} />
                        </a>
                    </Link>

                    <button
                        className="px-3 py-1 rounded text-gray-600 opacity-50 hover:opacity-75 lg:hidden"
                        aria-label="Menu"
                        data-test-id="navbar-menu"
                        onClick={
                            () => {
                                setShowDropdown(!showDropdown);
                            }}
                    >
                        <GoThreeBars />
                    </button>
                </div>

                <div className={`${showDropdown ? "flex" : "hidden"} lg:flex flex-col lg:flex-row lg:ml-auto mt-3 lg:mt-0`} data-test-id="navbar">
                    {
                        links.map(({ name, link, id }) =>
                            <Link key={name} href={link}>
                                <a
                                    className={`${link == currentRoute ? "text-blue-400" : "text-black hover:text-blue-400"} p-2 lg:px-4 lg:mx-2 rounded duration-150 transition-colors `}
                                    data-test-id={`navbar-${id}`}
                                >
                                    {name}
                                </a>
                            </Link>
                        )
                    }
                </div>

                <div className={`${showDropdown ? "flex" : "hidden"} lg:flex flex-row lg:ml-auto mt-3 lg:mt-0 items-center justify-center self-center justify-self-center gap-4`} data-test-id="navbar">
                    {socialMedias.map(({ name, icon, link }) => (
                        <a key={name} href={link}>
                            <Image src={icon} width={30} height={30} alt={name} />
                        </a>
                    ))}
                </div>
            </div>
        </header>
    )
}