import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
    minimum: 0.3,
    easing: "ease",
    speed: 500,
    showSpinner: true,
});

Router.events.on("routeChangeStart", () => {
    const prevRoute = Router.route;
    setTimeout(() => {
        if (prevRoute === Router.route) {
            NProgress.start();
        }
    }, 250);
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const LoadingBar = () => null;
export default LoadingBar;
