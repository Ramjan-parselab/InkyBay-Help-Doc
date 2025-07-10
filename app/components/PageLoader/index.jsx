export default function PageLoader () {
    return(
        <>
            <div className="min-h-screen bg-background">
            {/* Header with Navigation */}
            <header className="border-b bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <div className="h-3 bg-gray-200 rounded  w-48 mb-4 animate-pulse bg-muted"></div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-6 bg-gray-200 rounded-full  w-6 mb-4 animate-pulse  bg-muted"></div>
                        <div className="h-3 bg-gray-200 rounded  w-48 mb-4 animate-pulse bg-muted"></div>
                        <div className="h-3 bg-gray-200 rounded  w-48 mb-4 animate-pulse bg-muted"></div>
                    </div>
                </div>
                </div>
            </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-3 bg-gray-200 rounded-full mx-auto  w-100 mb-4 animate-pulse bg-muted"></div>
            <div className="h-3 bg-gray-200 rounded-full mx-auto  w-80 mb-4 animate-pulse bg-muted"></div>
            <div className="h-7 bg-gray-200 rounded mx-auto  w-100 mb-4 animate-pulse bg-muted"></div>
            <div className="h-3 bg-gray-200 rounded-full mx-auto  w-80 mb-4 animate-pulse bg-muted"></div>      
        </div>
      </section>

      {/* Alert Banner */}
      <div className="bg-orange-500 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 bg-orange-300 rounded-full animate-pulse bg-muted"></div>
            <div className="h-4 w-80 bg-orange-300 animate-pulse bg-muted"></div>
            <div className="h-4 w-4 bg-orange-300 rounded-full animate-pulse bg-muted"></div>
          </div>
        </div>
      </div>

      {/* Featured Articles Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <div className="h-3 w-96 bg-gray-200 mx-auto mb-4 rounded-full animate-pulse bg-muted"></div>
             <div className="h-3 w-80 bg-gray-200 mx-auto rounded-full animate-pulse bg-muted"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg border p-6">
                <div className="flex items-start space-x-3 mb-4">
                     <div className="h-3 w-80 bg-gray-200 rounded animate-pulse bg-muted"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 animate-pulse bg-muted"></div>
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse bg-muted"></div>
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <div className="h-8 w-98 bg-gray-200 mx-auto rounded mb-2 animate-pulse bg-muted"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg border p-6">
                <div className="mb-4">
                     <div className="h-8 w-8 bg-gray-200 rounded mb-3 animate-pulse bg-muted"></div>
                     <div className="h-4 w-40 bg-gray-200 mb-3 animate-pulse bg-muted"></div>
                </div>
                <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-gray-200 animate-pulse bg-muted"></div>
                    <div className="h-4 w-4/5 bg-gray-200 animate-pulse bg-muted"></div>
                    <div className="h-4 w-3/5 bg-gray-200 animate-pulse bg-muted"></div>
                </div>
                 <div className="h-5 w-24 bg-gray-200 animate-pulse bg-muted"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-3 w-96 bg-gray-200 mx-auto mb-4 rounded-full animate-pulse bg-muted"></div>
             <div className="h-3 w-80 bg-gray-200 mx-auto rounded-full animate-pulse bg-muted"></div>
            
          </div>
          
          {/* Category Tabs */}
          <div className="flex justify-center space-x-8 mb-8">
            {[1, 2, 3].map((tab) => (
                 <div key={tab} className="h-6 w-32 bg-gray-200 animate-pulse bg-muted"></div>
            ))}
          </div>
          
          {/* FAQ Items */}
          <div className="space-y-4">
            {[1, 2, 3].map((faq) => (
              <div key={faq} className="bg-white rounded-lg border p-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-96 bg-gray-200 animate-pulse bg-muted"></div>
                  <div className="h-4 w-4 bg-gray-200  rounded-full animate-pulse bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <div className="h-8 w-98 bg-gray-200 mx-auto rounded mb-2 animate-pulse bg-muted"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg border p-6">
                <div className="mb-4">
                     <div className="h-8 w-8 bg-gray-200 rounded mb-3 animate-pulse bg-muted"></div>
                     <div className="h-4 w-40 bg-gray-200 mb-3 animate-pulse bg-muted"></div>
                </div>
                <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-gray-200 animate-pulse bg-muted"></div>
                    <div className="h-4 w-4/5 bg-gray-200 animate-pulse bg-muted"></div>
                    <div className="h-4 w-3/5 bg-gray-200 animate-pulse bg-muted"></div>
                </div>
                 <div className="h-5 w-24 bg-gray-200 animate-pulse bg-muted"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {[1, 2, 3, 4].map((col) => (
              <div key={col}>
                <div className="h-5 w-24 mb-4 bg-gray-700 animate-pulse bg-muted"> </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((link) => (
                    <div key={link} className="h-4 w-20 bg-gray-700 animate-pulse bg-muted"> </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="h-4 w-48 bg-gray-700 animate-pulse bg-muted"></div>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((social) => (
                  <div key={social} className="h-5 w-5 rounded bg-gray-700 animate-pulse bg-muted"> </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
        </>
    );
}