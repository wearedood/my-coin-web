import { useState } from 'react';
import { AppConfig, UserSession, showConnect, openContractCall } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';
import { uintCV, principalCV, noneCV } from '@stacks/transactions';
import './App.css';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function App() {
  const [userData, setUserData] = useState(undefined);

  const connectWallet = () => {
    showConnect({
      userSession,
      appDetails: { name: 'My Web3 Dashboard', icon: window.location.origin + '/favicon.ico' },
      onFinish: () => setUserData(userSession.loadUserData()),
      userSession,
    });
  };

  const transferCoin = async () => {
    const network = new StacksMainnet();
    const senderAddress = userSession.loadUserData().profile.stxAddress.mainnet;
    const recipientAddress = prompt("Enter the Stacks address you want to send 100 coins to:");
    
    if (!recipientAddress) return;

    await openContractCall({
      network,
      contractAddress: 'SP1GVG84HRYCBYEW59M0S4XGQF8TTVXRF8XNXGBMH',
      contractName: 'my-coin',
      functionName: 'transfer',
      functionArgs: [
        uintCV(100), 
        principalCV(senderAddress), 
        principalCV(recipientAddress), 
        noneCV()
      ],
      onFinish: data => {
        console.log('Transfer broadcast!', data);
      },
    });
  };

  return (
    <div className="App">
      <h1>🚀 Web3 Dashboard</h1>
      {!userData ? (
        <button onClick={connectWallet} className="connect-btn">Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {userData.profile.stxAddress.mainnet.substring(0, 8)}...</p>
          <button onClick={transferCoin} className="mint-btn">Send 100 Coins</button>
        </div>
      )}
    </div>
  );
}

export default App;
