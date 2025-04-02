import { FiDollarSign, FiTrendingUp, FiTrendingDown } from "react-icons/fi"

const DashboardContent = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Financial Overview</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <FiDollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                    <dd className="text-2xl font-semibold text-gray-900">$24,500.00</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <FiTrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Income (This Month)</dt>
                    <dd className="text-2xl font-semibold text-gray-900">$4,200.00</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <FiTrendingDown className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Expenses (This Month)</dt>
                    <dd className="text-2xl font-semibold text-gray-900">$3,100.00</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {[
                { id: 1, name: "Grocery Shopping", amount: -120.5, date: "2023-06-15" },
                { id: 2, name: "Salary Deposit", amount: 3000, date: "2023-06-01" },
                { id: 3, name: "Electric Bill", amount: -85.2, date: "2023-06-10" },
                { id: 4, name: "Freelance Payment", amount: 450, date: "2023-06-08" },
                { id: 5, name: "Restaurant Dinner", amount: -65.8, date: "2023-06-13" },
              ].map((transaction) => (
                <li key={transaction.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{transaction.name}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.amount > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {transaction.amount > 0 ? (
                            <FiTrendingUp className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" />
                          ) : (
                            <FiTrendingDown className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-400" />
                          )}
                          {transaction.amount > 0 ? "Income" : "Expense"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{transaction.date}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardContent

