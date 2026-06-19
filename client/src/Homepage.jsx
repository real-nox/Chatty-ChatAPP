import Center from "./components/Center.jsx";
import Footer from "./components/Footer.jsx";
import Topbar from "./components/Topbar.jsx";

export default function Homepage({ type }) {
  return (
    <>
      <Topbar />
      <Center type={type} />
      <Footer />
    </>
  );
}
