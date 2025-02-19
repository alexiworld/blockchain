import { useState } from 'react';
import useEth from '../../contexts/EthContext/useEth';

function ContractBtns({ setValue }) {
  const {
    state: { contract, accounts },
  } = useEth();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const read = async () => {
    const value = await contract.methods.read().call({ from: accounts[0] });
    setValue(value);
    // const value = await contract.methods.read().call({ from: accounts[0] });
    // console.log(value);
    // setValue(value);
  };

  const write = async (e) => {
    if (e.target.tagName === 'INPUT') {
      return;
    }
    if (inputValue === '') {
      alert('Please enter a value to write.');
      return;
    }
    const newValue = parseInt(inputValue);
    contract.methods.write(newValue).send({ from: accounts[0] });

    // contract.methods
    //   .write(newValue)
    //   .send({ from: accounts[0] })
    //   .then((error, tranasctionHash) => {
    //     alert(error);
    //     alert(tranasctionHash);
    //   });

    // await contract.methods
    //   .write(newValue)
    //   .send({ from: accounts[0] })
    // .on('transactionHash', (hash) => {
    //   console.log('CREATING hash:', hash);
    // })
    // .on('confirmation', (confirmationNumber, receipt) => {
    //   console.log('CONFIRMATION receipt:', confirmationNumber, receipt);
    //   if (receipt.Created) {
    //     let res = receipt.events['Created'].returnValues['feed'];
    //     console.log('this is res: ', res);
    //     return res;
    //   }
    // });
  };

  return (
    <div className='btns'>
      <button onClick={read}>read()</button>

      <div onClick={write} className='input-btn'>
        write(
        <input
          type='text'
          placeholder='uint'
          value={inputValue}
          onChange={handleInputChange}
        />
        )
      </div>
    </div>
  );
}

export default ContractBtns;
