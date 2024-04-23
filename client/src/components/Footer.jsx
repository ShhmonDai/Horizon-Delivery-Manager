import { Footer } from "flowbite-react";
import { BsLinkedin, BsInstagram, BsLaptop, BsGithub } from 'react-icons/bs';
import { Link } from "react-router-dom";

export default function FooterCom() {
    return (
        <Footer container className='border-t-2 dark:border-gray-700 transition-colors duration-500'>
            <div className='w-full max-w-7xl mx-auto'>

                <div className='grid-cols-2 w-full justify-around flex'>


                    <div className='mt-3'>
                        <Footer.Title title='About' />
                        <Footer.LinkGroup col>
                            <Footer.Link as={Link} to='/about'> 
                                This Project
                            </Footer.Link>
                            <Footer.Link href='https://github.com/ShhmonDai/Horizon-Delivery-Manager' target='_blank' rel='noopener noreferrer'>
                                Source Code
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    <div className='mt-3'>
                        <Footer.Title title='The Horizon' />
                        <Footer.LinkGroup col>
                            <Footer.Link href='https://luxuryrentalsmanhattan.com/buildings/the-horizon' target='_blank' rel='noopener noreferrer'>
                                About
                            </Footer.Link>
                            <Footer.Link href='https://www.google.com/maps/place/Horizon+Condominium/@40.7455495,-73.9739413,17z/data=!4m15!1m8!3m7!1s0x89c259ddc0c26745:0x96c0a626ab819dfa!2s415+E+37th+St,+New+York,+NY+10016!3b1!8m2!3d40.7455455!4d-73.9713664!16s%2Fg%2F11srw0vblc!3m5!1s0x89c2591ad4a06dd1:0x69b8e28729d5b291!8m2!3d40.7456772!4d-73.9711688!16s%2Fg%2F1tddt34w?entry=ttu' target='_blank' rel='noopener noreferrer'>
                                Directions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>


                </div>

                <Footer.Divider />

                <div className='grid w-full sm:flex justify-center sm:justify-around'>
                    <Footer.Copyright href='#' by="Szymon's blog" year={new Date().getFullYear()} />
                    <div className='flex gap-6 mt-4 sm:mt-0'>
                        <Footer.Icon href='https://www.linkedin.com/in/shhmon/' target='_blank' rel='noopener noreferrer' icon={BsLinkedin} />
                        <Footer.Icon href='https://github.com/ShhmonDai' target='_blank' rel='noopener noreferrer' icon={BsGithub} />
                        <Footer.Icon href='https://www.shhmon.com' target='_blank' rel='noopener noreferrer' icon={BsLaptop} />
                        <Footer.Icon href='https://instagram.com/shh.mon' target='_blank' rel='noopener noreferrer' icon={BsInstagram} />
                    </div>
                </div>


            </div>
        </Footer>
    )
}