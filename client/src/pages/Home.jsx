import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className='min-h-screen flex justify-center'>
      <div className='max-w-7xl mx-auto pb-30 pt-10 sm:mx-5 px-10 sm:px-20 md:px-40 text-center dark:bg-black dark:bg-opacity-40'>
        <div className='text-left text-gray-900 dark:text-gray-400'>


          <div className='text-md flex flex-col gap-4'>

            <h1 className='text-3xl dark:text-white font font-semibold text-center '>
              Welcome to the Horizon Delivery Manager
            </h1>
            <h1 className='text-xl dark:text-white text-center'>
              The Horizon building can now enjoy prompt and efficient delivery operations,
              saving time and reducing hassle for both residents and delivery staff!
            </h1>


            <Button className='w-auto mx-auto my-2' gradientDuoTone='pinkToOrange' type='button' as={Link} to='/packages'>
              Start Organizing!
            </Button>



          </div>
        </div>
      </div>
    </div>
  );
}