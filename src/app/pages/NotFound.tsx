import { Link } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <h1 className="text-9xl font-black text-blue-100 absolute">404</h1>
      
      <div className="relative z-10 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Oops! Page not found</h2>
        <p className="text-slate-500 mb-8 max-w-md">
          The page you are looking for might have been removed or had its name changed.
        </p>
        
        {/* Using Link is safer than useNavigate in Error Boundaries */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
        >
          <MoveLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}