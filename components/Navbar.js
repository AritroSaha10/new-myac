import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import Logo from "../imgs/logo.png";

import { GoThreeBars } from "react-icons/go"

const links = [
    {
        name: "Home",
        link: "/",
        id: "home",
        priority: false
    },
    {
        name: "News",
        link: "/current-news",
        id: "news",
        priority: false
    },
    {
        name: "Bazaar",
        link: "/bazaar",
        id: "bazaar",
        priority: false
    },
    {
        name: "Trips & Tours",
        link: "/trips-and-tours",
        id: "trips-and-tours",
        priority: false
    },
    {
        name: "Info",
        link: "/information",
        id: "information",
        priority: false
    },
    {
        name: "About Us",
        link: "/about",
        id: "about",
        priority: false
    },
    {
        name: "Membership Registration Form",
        link: "https://docs.google.com/forms/d/e/1FAIpQLSeb-nPbnwnaFELn7ljgLFHK_VGCkp0Io8SqSTvKZLixINd_iA/viewform",
        id: "call-to-action",
        priority: true
    },
];

export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className="bg-gray-100 py-2 lg:py-4 sticky">
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
                        links.map(({ name, link, priority, id }) =>
                            <Link key={name} href={link}>
                                <a 
                                    className={`${priority ? "text-blue-600 hover:bg-blue-600 hover:text-white text-center border border-solid border-blue-600 mt-1 lg:mt-0 lg:ml-1" : "text-gray-600 hover:bg-gray-200 hover:text-gray-700 "} p-2 lg:px-4 lg:mx-2 rounded duration-300 transition-colors `}
                                    data-test-id={`navbar-${id}`}
                                >
                                    {name}
                                </a>
                            </Link>
                        )
                    }
                </div>
            </div>
        </header>
    )
}