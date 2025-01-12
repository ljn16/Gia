import React from 'react';
import Image from 'next/image';
import giaIcon from '../images/NN-icon.png';

const Nav = () => {
    return (
        <nav className="p-4 bg-gray-800 text-white text-center flex justify-center items-center">
            <div className='flex cursor-pointer relative items-center' onClick={() => window.location.reload()}>
                <h1 className=''>G&nbsp;&nbsp;&nbsp;<span className="opacity-25">|&nbsp;</span>I&nbsp;&nbsp;&nbsp;&nbsp;A<span className="opacity-25">&nbsp;|</span></h1>
                <Image src={giaIcon} alt="Gia Icon" width={32} height={32} className='mx-5'/>
                {/* <img src={giaIcon} alt="Gia Icon" className='w-8 h-8 mx-5'/> */}
                <div className="absolute mb-2 w-32 p-2 bg-gray-700 text-white text-sm rounded opacity-0 hover:opacity-100 ">
                    Reload Page
                </div>
            </div>
        </nav>
    );
};

export default Nav;
