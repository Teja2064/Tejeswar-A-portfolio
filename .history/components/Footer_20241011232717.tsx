import React from 'react'
import MagicButton from './ui/MagicButton'
import { FaLocationArrow } from 'react-icons/fa'
impor t

const Footer = () => {
  return (
    <footer className='w-full  pd-10 mb-[100px] md:mb-5' id="contact">
        <div className='w-full absolute left-0 -bottom-72 min-h-96'>
            <img src="/footer-grid.svg" alt="grid" className='w-full h-full opacity-50'/>
        </div>
        <div className='flex flex-col items-center'>
            <h1 className='heading lg:max-w-[45vw]'>
                Ready to take <span className='text-purple'>your</span> digital presence to next level
            </h1>
            <p className='text-white-200 md:mt-10 my-5 text-center'>
                Reach out to me today and let&apos;s discuss how I can help you acheive your goals.
            </p>
            <a href="mailto:tejeswaryadav8@gmail.com">
                <MagicButton title="Let&apos;s get in touch" icon={<FaLocationArrow/>}
                position='right'/>

            </a>

        </div>
        <div className='flex mt-16 md:flex-row flex-col justify-between items-center'>
            <p className='md:text-base text-sm md:font-normal font-light '>Copyright © Tejeswar</p>
        </div>
        <div className='felx items-center '>

        </div>

    </footer>
  )
}

export default Footer