import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0x70E112a3c8d5E06c22BEc153c69a77fb8915f127'
  //"0x74d6c5f4426DfCE08e4C5019B832C7c4f13c45bE"
);

export default instance;
