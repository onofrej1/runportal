"use client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 mx-auto flex gap-6">
      <div>
        <div className="max-w-sm p-6 border-t-green-700 border-t-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h5 className="mb-2 text-xl font-bold dark:text-white">
            Najnovsie komentare
          </h5>
          <div className="space-y-2">
            <p className="pl-2">We care about privacy policy</p>
            <p className="pl-2">Lorem ipsum generated sentence</p>
            <p className="pl-2">We care about privacy policy</p>
          </div>
        </div>

        <div className="mt-2 max-w-sm p-6 border-t-green-700 border-t-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h5 className="mb-2 text-xl font-bold dark:text-white">
            Odber noviniek
          </h5>

          <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
            <div className="relative w-full">
              <label
                htmlFor="email"
                className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter your email"
                type="email"
                id="email"
              />
            </div>
            <div>
              <button
                type="submit"
                className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-green-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
              >
                Subscribe
              </button>
            </div>
          </div>

          <p>We care about privacy policy</p>
        </div>
      </div>
      
      <div>{children}</div>
    </div>
  );
}
