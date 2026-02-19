import { useState } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';
import { openContractCall } from '@stacks/connect';
import { uintCV, principalCV } from '@stacks/transactions';
import './App.css';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function App() {
  const [userData, setUserData] = useState(undefined);

  const connectWallet = () => {
    showConnect({
      userSession,
      appDetails: { name: 'My Coin Dashboard', icon: window.location.origin + '/favicon.ico' },
      onFinish: () => setUserData(userSession.loadUserData()),
      userSession,
    });
  };

  const mintCoins = async () => {
    const network = new StacksMainnet();
    const address = userSession.loadUserData().profile.stxAddress.mainnet;

    await openContractCall({
      network,
      contractAddress: 'SP1GVG84HRYCBYEW59M0S4XGQF8TTVXRF8XNXGBMH',
      contractName: 'my-coin',
      functionName: 'mint',
      functionArgs: [uintCV(1000000000000), principalCV(address)],
      onFinish: data => {
        console.log('Transaction broadcast!', data);
      },
    });
  };

  return (
    <div className="App">
      <h1>🪙 My Coin Dashboard</h1>
      
      {!userData ? (
        <button onClick={connectWallet} className="connect-btn">Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {userData.profile.stxAddress.mainnet.substring(0, 8)}...</p>
          <button onClick={mintCoins} className="mint-btn">Mint 1,000,000 Coins</button>
        </div>
      )}
    </div>
  );
}

export default App;
