export default function About() {
    return (
        <div className='min-h-screen flex justify-center'>
            
            <div className='max-w-7xl mx-auto pb-40 pt-5 sm:pt-10 sm:mx-5 px-8 sm:px-16 md:px-30 lg:px-40 text-center dark:bg-white dark:bg-opacity-5'>
                <div className='text-left text-gray-900 dark:text-gray-300'>


                    <div className='text-md flex flex-col gap-6'>

                        <h1 className='text-3xl dark:text-white font font-semibold text-center mt-7 '>
                            About The Horizon Delivery Manager 
                        </h1>


                        <p className="text-lg md:text-xl">
                            The Horizon Manager is an app designed to streamline and optimize the delivery process within The Horizon building. &nbsp;
                                <p className="inline text-lg font-semibold">
                                    It allows the workers to sort packages into specific labeled locations on the shelves and quickly look up package location
                                    and the number of packages.
                                </p>
                        </p>

                        <p className="text-lg md:text-xl">
                        The primary design goal of the manager is simplicity. This is to help the busy, elderly or less tech savy workers to use the web app without struggling.
                        Instead of including many extra features I've kept it plain so the app can be used on the go during the busy times. It is meant to be used as an addition
                        to BuildingLink to complement it's rich features but lack of it's ease of use. 
                        </p> 

                        <p className="text-lg md:text-xl">    
                            Before The Horizon Manager workers only knew in which room the packages were located but not where in the room they were. 
                            This led to workers having to, in the worst case scenario, look through every package pile to find the correct package for a specific apartment.
                        </p>

                             
                        <p className="text-lg md:text-xl font-semibold">
                            With thanks to The Horizon Manager the package look up time was reduced from Big(O) Notation of O(n) to O(1)! 
                        </p>




                    </div>
                </div>

                {/* Worker Image */}
                <div className="w-auto mt-20">
                    <img className='w-full' src='/Worker.png' alt='worker image' />
                    <h1 className="text-gray-500">Pictured: The Horizon employee's approval!</h1>
                </div>



            </div>
        </div>
    );
}