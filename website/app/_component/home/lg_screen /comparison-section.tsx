import { Check, X } from "lucide-react"

export default function ComparisonSection() {
  // Data structure for comparison features
  const comparisonData = [
    {
      feature: "Speed",
      wetrends: { text: "Fast delivery via request queue", positive: true },
      agencies: { text: "Slower due to internal processes", positive: false },
      freelancers: { text: "Unpredictable based on workload", positive: false },
    },
    {
      feature: "Flexibility",
      wetrends: { text: "Pause anytime, scale as needed", positive: true },
      agencies: { text: "Fixed contracts", positive: false },
      freelancers: { text: "Depends on availability", positive: false },
    },
    {
      feature: "Communication",
      wetrends: { text: "Simple, direct, structured", positive: true },
      agencies: { text: "Multiple layers of contacts", positive: false },
      freelancers: { text: "Direct but informal", positive: true },
    },
    {
      feature: "Quality",
      wetrends: { text: "Always high-quality output", positive: true },
      agencies: { text: "Good, but costly", positive: true },
      freelancers: { text: "Can be hit or miss", positive: false },
    },
    {
      feature: "Best For",
      wetrends: { text: "Startups, creators, fast-moving teams", positive: true },
      agencies: { text: "Big brands with big budgets", positive: true },
      freelancers: { text: "Small, one-time projects", positive: true },
    },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white flex justify-center">
      <div className="container px-4 sm:px-6 md:px-8 mx-auto ">
        <div className="text-left mb-10 md:mb-16 mx-auto ">
          <h2 className="text-4xl md:text-5xl lg:text-7xl mb-4 md:mb-6 font-bold ">Why WeTrends?</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
            See why businesses choose WeTrends over traditional agencies for their content creation needs
          </p>
        </div>

        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden lg:block overflow-x-auto max-w-9xl mx-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-6 text-left border-b-2 border-gray-200 w-1/4">
                  <span className="text-2xl font-bold text-gray-900">Feature</span>
                </th>
                <th className="p-6 text-left border-b-2 border-wetrends-500 bg-wetrends-50 w-1/4">
                  <span className="text-2xl font-bold text-wetrends-600">WeTrends</span>
                </th>
                <th className="p-6 text-left border-b-2 border-gray-200 w-1/4">
                  <span className="text-2xl font-semibold text-gray-800">Agencies</span>
                </th>
                <th className="p-6 text-left border-b-2 border-gray-200 w-1/4">
                  <span className="text-2xl font-semibold text-gray-800">Freelancers</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index}>
                  <td className="p-6 border-t border-gray-200">
                    <span className="text-xl font-medium text-gray-900">{row.feature}</span>
                  </td>
                  <td className="p-6 text-left border-t border-gray-200 bg-wetrends-50">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 text-wetrends-600">
                        {row.wetrends.positive ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                      </div>
                      <span className="text-lg text-wetrends-700 font-medium">{row.wetrends.text}</span>
                    </div>
                  </td>
                  <td className="p-6 text-left border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 text-gray-600">
                        {row.agencies.positive ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <span className="text-lg text-gray-600">{row.agencies.text}</span>
                    </div>
                  </td>
                  <td className="p-6 text-left border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 text-gray-600">
                        {row.freelancers.positive ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <span className="text-lg text-gray-600">{row.freelancers.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-6 border-t-2 border-gray-200"></td>
                <td className="p-6 border-t-2 border-wetrends-500 bg-wetrends-50">
                  <button className="w-full py-4 px-6 bg-wetrends-600 rounded-md text-white text-lg font-medium hover:bg-wetrends-700 transition-colors shadow-md">
                    Get Started
                  </button>
                </td>
                <td className="p-6 border-t-2 border-gray-200"></td>
                <td className="p-6 border-t-2 border-gray-200"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tablet View - Only visible on md screens */}
        <div className="hidden md:block lg:hidden overflow-x-auto mb-8 max-w-4xl mx-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left border-b-2 border-gray-200 w-1/4">
                  <span className="text-xl font-bold text-gray-900">Feature</span>
                </th>
                <th className="p-4 text-left border-b-2 border-wetrends-500 bg-wetrends-50 w-1/4">
                  <span className="text-xl font-bold text-wetrends-600">WeTrends</span>
                </th>
                <th className="p-4 text-left border-b-2 border-gray-200 w-1/4">
                  <span className="text-xl font-semibold text-gray-800">Agencies</span>
                </th>
                <th className="p-4 text-left border-b-2 border-gray-200 w-1/4">
                  <span className="text-xl font-semibold text-gray-800">Freelancers</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index}>
                  <td className="p-4 border-t border-gray-200">
                    <span className="text-base font-medium text-gray-900">{row.feature}</span>
                  </td>
                  <td className="p-4 text-left border-t border-gray-200 bg-wetrends-50">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 flex-shrink-0 text-wetrends-600">
                        {row.wetrends.positive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </div>
                      <span className="text-sm text-wetrends-700 font-medium">{row.wetrends.text}</span>
                    </div>
                  </td>
                  <td className="p-4 text-left border-t border-gray-200">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 flex-shrink-0 text-gray-600">
                        {row.agencies.positive ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{row.agencies.text}</span>
                    </div>
                  </td>
                  <td className="p-4 text-left border-t border-gray-200">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 flex-shrink-0 text-gray-600">
                        {row.freelancers.positive ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{row.freelancers.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-4 border-t-2 border-gray-200"></td>
                <td className="p-4 border-t-2 border-wetrends-500 bg-wetrends-50">
                  <button className="w-full py-3 px-4 bg-wetrends-600 rounded-md text-white text-base font-medium hover:bg-wetrends-700 transition-colors shadow-md">
                    Get Started
                  </button>
                </td>
                <td className="p-4 border-t-2 border-gray-200"></td>
                <td className="p-4 border-t-2 border-gray-200"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Shown only on mobile */}
        <div className="lg:hidden space-y-6 md:space-y-8 max-w-3xl mx-auto">
          {/* WeTrends Card */}
          <div className="border-2 border-wetrends-500 rounded-xl overflow-hidden shadow-md">
            <div className="bg-wetrends-600 p-3 sm:p-4 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white">WeTrends</h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {comparisonData.map((row, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="font-medium text-lg text-gray-900 mb-2">{row.feature}</div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 text-wetrends-600">
                      {row.wetrends.positive ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </div>
                    <span className="text-base text-gray-700">{row.wetrends.text}</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 px-6 mt-6 bg-wetrends-600 rounded-md text-white text-lg font-medium hover:bg-wetrends-700 transition-colors shadow-md">
                Learn More
              </button>
            </div>
          </div>

          {/* Comparison Toggle for Other Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-100 p-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800">Agencies</h3>
              </div>
              <div className="p-4 space-y-3">
                {comparisonData.slice(0, 3).map((row, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="font-medium text-sm text-gray-900 mb-1">{row.feature}</div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0 text-gray-600">
                        {row.agencies.positive ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{row.agencies.text}</span>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <span className="text-sm text-gray-500">See all features</span>
                </div>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-100 p-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800">Freelancers</h3>
              </div>
              <div className="p-4 space-y-3">
                {comparisonData.slice(0, 3).map((row, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="font-medium text-sm text-gray-900 mb-1">{row.feature}</div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0 text-gray-600">
                        {row.freelancers.positive ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{row.freelancers.text}</span>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <span className="text-sm text-gray-500">See all features</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
