export default function About() {
    return (
        <div className='min-h-screen flex justify-center'>
            
            <div className='max-w-7xl mx-auto pb-40 pt-10 sm:mx-5 px-10 sm:px-20 md:px-40 text-center dark:bg-white dark:bg-opacity-5'>
                <div className='text-left text-gray-900 dark:text-gray-300'>


                    <div className='text-md flex flex-col gap-6'>

                        <h1 className='text-3xl dark:text-white font font-semibold text-center mt-7 '>
                            About The Horizon Delivery Manager 
                        </h1>


                        <p className="text-xl">
                            The Horizon Manager is an app designed to streamline and optimize the delivery process within The Horizon building. 
                            <b> It allows the workers to sort packages into specific labeled locations on the shelves and quickly look up package location 
                            and the nubmer of packages.</b>
                        </p>

                            
                        <p className="text-xl">    
                            Before The Horizon Manager workers only knew in which room the packages were located but not where in the room they were. 
                            This led to workers having to, in the worst case scenario, look through every package pile to find the correct package for a specific apartment.
                        </p>

                             
                        <p className="text-xl">
                            <b>With thanks to The Horizon Manager the package look up time was reduced from Big(O) Notation of O(n) to O(1)!</b> 
                        </p>




                    </div>
                </div>
            </div>
        </div>
    );
}