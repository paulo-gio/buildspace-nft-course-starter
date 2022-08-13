import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import { ethers } from "ethers";
import MeuNFT from './utils/MeuNFT.json';

const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x7270cfB541282B9aF5FaE8F99481e033b3e58d4B";

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Certifique-se que você tem a MetaMask instalada!")
      return;
    } else {
      console.log("Temos o objeto ethereum!", ethereum)
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Conta autorizada encontrada:", account);
      setCurrentAccount(account);
      setupEventListener()
    } else {
      console.log("Nenhuma conta autorizada foi encontrada.");
    }
  };
  
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Baixe a MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      
      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener()
    } catch (error) {
      console.log(error);
    }
  };

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MeuNFT.abi, signer);

      
        connectedContract.on("MeuNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Ei! Nós cunhamos o seu NFT e o enviamos para sua carteira. Pode estar em branco agora. Pode levar no máximo 10 minutos para aparecer no OpenSea. Aqui está o link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Configurar evento listener!")

      } else {
        console.log("Objeto Ethereum não existe!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MeuNFT.abi, signer);

        console.log("Agora temos que pagar o gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Minerando...aguarde.")
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Minerado`);

      } else {
        console.log("Objeto Ethereum não existe!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Conectar a Carteira
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Cunhar seu NFT
    </button>
  )
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Minha Coleção de NFTs</p>
          <p className="sub-text">
            Exclusivos! Magníficos! Garanta o seu!
            </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Criado na @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;