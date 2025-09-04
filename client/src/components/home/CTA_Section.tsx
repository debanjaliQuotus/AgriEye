import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const CTA_Section = () => {
  return (
    <div>
       {/* CTA Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-emerald-50 to-blue-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Ready to Protect Your Property?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of property owners who trust our advanced animal
                detection system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white text-lg px-12 py-4 h-auto shadow-lg shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Create Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-emerald-600 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-700 text-lg px-12 py-4 h-auto transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
    </div>
  )
}

export default CTA_Section
