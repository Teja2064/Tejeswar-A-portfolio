import React from 'react'
import MagicButton from './ui/MagicButton'
import { FaLocationArrow } from 'react-icons/fa'
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'


const Footer = () => {
  return (
    <footer className='w-full  pd-10 mb-[100px] md:mb-5' id="contact">
        <div className='w-full absolute left-0 -bottom-72 min-h-96'>
            <img src="/footer-grid.svg" alt="grid" className='w-full h-full opacity-50'/>
        </div>
        <div className='flex flex-col items-center'>
            <h1 className='heading lg:max-w-[45vw]'>
                Ready to take <span className='text-purple'>craft</span>  production-grade apps that solve real-world problems..
            </h1>
            <p className='text-white-200 md:mt-10 my-5 text-center'>
                Reach out to me today and let&apos;s discuss how I can help you acheive your goals.
            </p>
            <a href="mailto:tejeswarya199@gmail.com">
                <MagicButton title="Let&apos;s get in touch" icon={<FaLocationArrow/>}
                position='right'/>
            </a>

        </div>
        <div className='flex mt-16 md:flex-row flex-col justify-between items-center'>
            <p className='md:text-base text-sm md:font-normal font-light '>Copyright © Tejeswar</p>
            
            {/* Social Media Links */}
            <div className='flex gap-4 mt-4 md:mt-0'>
                <a 
                    href="https://www.linkedin.com/in/tejeswar-a-577250145/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='text-white hover:text-purple transition-colors duration-300'
                >
                    <FaLinkedin size={24} />
                </a>
                <a 
                    href="https://github.com/Teja2064" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='text-white hover:text-purple transition-colors duration-300'
                >
                    <FaGithub size={24} />
                </a>
            </div>
        </div>
        

    </footer>
  )
}

export default Footer