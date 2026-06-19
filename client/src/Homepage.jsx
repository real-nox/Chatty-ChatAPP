import Center from "./Components/Center.jsx";
import Footer from "./Components/Footer.jsx";
import Topbar from "./Components/Topbar.jsx";

export default function Homepage({ type }) {
  return (
    <>
      <Topbar />
      <Center type={type} />
      <Footer />
    </>
  );
}
