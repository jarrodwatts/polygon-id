import React from 'react';
import { useWalletLogin } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useActiveProfile } from '@lens-protocol/react-web';

function LoginButton() {
  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();
  const { data: activeProfile, loading } = useActiveProfile();

  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient();
      const result = await login({
        address: walletClient.account.address,
      });
      console.log(result)
      console.log(loading)
      console.log(activeProfile)
    }
  };
 
  return (
    <div>
      {loginError && <p>{`${loginError.name} ${loginError.message}`}</p>}
      {loading && <p> Loading ...</p>}
      {
        !activeProfile && <button disabled={isLoginPending} onClick={onLoginClick}>Log in</button>
      }
      
    </div>
  );
}

export default LoginButton;