import Link from 'next/link';

const Navbar = () =>
{
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">
        <Link href="/" passHref>
          Home
        </Link>
      </div>
      <div className="space-x-4">
        <Link href="../../report/" passHref>
          Report Pdf
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
