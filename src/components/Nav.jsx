import React from 'react';
import nnIcon from '../images/NN-icon.png';

const Nav = () => {
    return (
        <nav className="p-4 bg-gray-800 text-white text-center flex justify-center items-center cursor-pointer" onClick={() => window.location.reload()}>

            <h1>G&nbsp;&nbsp;&nbsp;<span className="opacity-25">|&nbsp;</span>I&nbsp;&nbsp;&nbsp;&nbsp;A<span className="opacity-25">&nbsp;|</span></h1>
            <img 
                src={nnIcon} alt="Gia Icon" className='w-8 h-8 mx-5'
                
            />
        </nav>
    );
};

export default Nav;