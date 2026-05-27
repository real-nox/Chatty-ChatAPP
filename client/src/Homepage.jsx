import Center from "./Components/Center";
import Footer from "./Components/Footer";
import Topbar from "./Components/Topbar";

export default function Homepage({ type }) {
  return (
    <>
      <Topbar />
      <Center type={type} />
      <Footer />
    </>
  );
}
