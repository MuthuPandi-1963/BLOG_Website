import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import { Link } from "react-router-dom";
export default function Logo() {
  return (
     <div className="flex items-center ">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <BsGlobeCentralSouthAsia className="text-news-blue w-8 h-8 mr-3" />
              <h1 className="text-2xl font-bold text-news-blue text-nowrap">NEWS 24</h1>
            </Link>
          </div>
  )
}
