import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs';
import { Link } from "react-router-dom";

export default function FooterCom() {
    return (
        <Footer container className='border-t-2 dark:border-gray-700 bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(0,0,0,0.1)] transition-colors duration-500'>
            <div className='w-full max-w-7xl mx-auto'>

                <div className='grid-cols-2 w-full justify-around flex'>

                    <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                        <span className='px-2 py-1 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-lg text-white'>The Horizon</span>
                        Manager
                    </Link>


                    <div className='mt-3'>
                        <Footer.Title title='About' />
                        <Footer.LinkGroup col>
                            <Footer.Link href='https://www.shhmon.com' target='_blank' rel='noopener noreferrer'>
                                This Project
                            </Footer.Link>
                            <Footer.Link href='https://www.shhmon.com' target='_blank' rel='noopener noreferrer'>
                                Source Code
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    <div className='mt-3'>
                        <Footer.Title title='The Horizon' />
                        <Footer.LinkGroup col>
                            <Footer.Link href='https://www.shhmon.com' target='_blank' rel='noopener noreferrer'>
                                Homepage
                            </Footer.Link>
                            <Footer.Link href='https://www.shhmon.com' target='_blank' rel='noopener noreferrer'>
                                Directions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>


                </div>

                <Footer.Divider />

                <div className='grid w-full sm:flex justify-center sm:justify-around'>
                    <Footer.Copyright href='#' by="Szymon Pozniewski" year={new Date().getFullYear()} />
                    <div className='flex gap-6 mt-4 sm:mt-0'>
                        <Footer.Icon href='#' icon={BsFacebook} />
                        <Footer.Icon href='#' icon={BsGithub} />
                        <Footer.Icon href='#' icon={BsTwitter} />
                        <Footer.Icon href='#' icon={BsInstagram} />
                    </div>
                </div>


            </div>
        </Footer>
    )
}