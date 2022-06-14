import { motion } from "framer-motion";

import transition from "./anim/Transitions"

import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children, noAnim, reverseAnim }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />


            <motion.div 
                className="w-full flex-grow bg-white"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ ...transition, duration: 0.5 }}
            >
                {children}
            </motion.div>

            <Footer />
        </div>
    )
}

export default Layout;