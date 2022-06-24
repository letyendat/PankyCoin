import { Footer, Navbar, Transactions, TransferToken, Welcome } from "components";

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
      <TransferToken />
      <Transactions />

    </div>
    <Footer />
  </div>
);

export default App;
