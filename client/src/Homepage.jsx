import Center from "./components/Center";
import Footer from "./components/Footer";
import Topbar from "./components/Topbar";

export default function Homepage({ type }) {
  return (
    <>
      <Topbar />
      <Center type={type} />
      <Footer />
    </>
  );
}
