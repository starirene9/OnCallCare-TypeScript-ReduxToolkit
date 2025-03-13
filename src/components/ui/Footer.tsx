import packageJson from "../../../package.json";
import Chatbot from "../shared/Chatbot";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-3 h-12 w-full flex items-center justify-end pr-5 fixed bottom-0">
      <Chatbot />
      <p className="font-normal text-sm">
        © 2025 OnCallCare by Bitna Gu | v{packageJson.version}
      </p>
    </footer>
  );
};

export default Footer;
