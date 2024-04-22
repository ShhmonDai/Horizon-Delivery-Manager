import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { toggleTheme } from "../redux/theme/themeSlice";
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from "../redux/user/userSlice";



export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };



  return (

      <Navbar className='border-b-2 sticky top-0 z-40 backdrop-blur transition-all duration-500'>
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
          <span className='mx-1 px-2 py-1 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-lg text-white'>The Horizon</span>
          <span className="hidden sm:inline">Manager</span>
        </Link>

      <Link to='/packages'> 
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
      </Link>

        <div className='flex gap-2 md:order-2'>
          <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </Button>

          {currentUser ? (
            <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.profilePicture} status="online" statusPosition="top-right" bordered color="light" rounded />}>
              <Dropdown.Header>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              {currentUser.isAdmin && (
              <Link to={'/dashboard?tab=apartments'}>
                <Dropdown.Item>Dashboard</Dropdown.Item>
              </Link> 
              )}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>

          ) :
            (
              <Link to='/sign-in'>
                <Button gradientDuoTone="pinkToOrange" outline>
                  Sign In
                </Button>
              </Link>
            )

          }

          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={'div'}>
            <Link to='/'> Home </Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={'div'}>
            <Link to='/about'> About </Link>
          </Navbar.Link>
          {currentUser ? ( <Navbar.Link active={path === "/packages"} as={'div'}>
            <Link to='/packages'> Packages </Link>
          </Navbar.Link> ) : ( '' ) }
        <Navbar.Link className='sm:hidden' as={'div'}>
          <div className="flex gap-2 items-center" onClick={() => dispatch(toggleTheme())}>
            THEME: {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </div>
        </Navbar.Link>

        </Navbar.Collapse>

      </Navbar>

  )
}