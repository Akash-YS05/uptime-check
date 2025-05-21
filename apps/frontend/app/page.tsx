import Link from "next/link"
import { CheckIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <header className="py-6 px-4 sm:px-6 lg:px-8 border-b backdrop-blur-sm bg-white/70 sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-xl font-light tracking-tight">Monitr</div>
            <nav className="hidden sm:flex space-x-6">
              <Link href="#features" className="text-sm font-light hover:text-gray-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-light hover:text-gray-600 transition-colors">
                How it works
              </Link>
              <Link href="#pricing" className="text-sm font-light hover:text-gray-600 transition-colors">
                Pricing
              </Link>
              <Link href="#faq" className="text-sm font-light hover:text-gray-600 transition-colors">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-sm font-light hover:text-gray-600 transition-colors">
                Login
              </Link>
              <Link
                href="#"
                className="hidden sm:inline-flex px-4 py-2 rounded-full bg-black text-white text-sm font-light hover:bg-gray-800 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      <main className="flex-1 text-black">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-white"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-24 right-1/4 w-64 h-64 bg-teal-100 rounded-full opacity-40 blur-3xl"></div>
            <div className="hidden lg:block absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-100 rounded-full opacity-30 blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-left max-w-xl mx-auto lg:mx-0">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-light mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Website monitoring made simple
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-tight mb-6 leading-14">
                  Know when your sites are {" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    down
                  </span>
                </h1>
                <p className="text-lg sm:text-xl font-light text-gray-600 mb-8">
                  Monitr provides real-time alerts when your websites experience downtime, so you can fix issues before
                  your users notice.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    href="#"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 font-light text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-600/20 text-white"
                  >
                    Start monitoring
                  </Link>
                  <Link
                    href="#"
                    className="px-6 py-3 rounded-full border border-gray-200 text-sm font-light hover:bg-gray-50 transition-colors"
                  >
                    Learn more
                  </Link>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 font-light">
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-white"></div>
                  </div>
                  <span>Join 2,000+ companies monitoring their sites</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 lg:hidden"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl shadow-blue-600/5 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>
                  <div className="p-1">
                    <img
                      src="/placeholder.svg?height=600&width=1000"
                      alt="Monitr dashboard preview"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-100 rounded-full blur-xl opacity-70"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full blur-xl opacity-70"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Logos Section */}
        {/* <section className="py-12 border-y bg-gray-50/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-light text-gray-500 mb-8">Trusted by companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-70">
              <div className="h-6 w-24 bg-gray-400 rounded"></div>
              <div className="h-6 w-20 bg-gray-400 rounded"></div>
              <div className="h-6 w-28 bg-gray-400 rounded"></div>
              <div className="h-6 w-24 bg-gray-400 rounded"></div>
              <div className="h-6 w-20 bg-gray-400 rounded"></div>
            </div>
          </div>
        </section> */}

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-white"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-24 right-1/4 w-64 h-64 bg-teal-100 rounded-full opacity-40 blur-3xl"></div>
            <div className="hidden lg:block absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-100 rounded-full opacity-30 blur-3xl"></div>
          </div>
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 -right-24 w-96 h-96 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          </div>

          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 text-sm font-light mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Features
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
                Everything you need for reliable monitoring
              </h2>
              <p className="text-gray-600 font-light max-w-2xl mx-auto">
                Our platform provides comprehensive tools to ensure your websites and services are always available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Real-time Monitoring",
                  description: "Check your website status every 30 seconds from multiple global locations.",
                },
                {
                  title: "Instant Alerts",
                  description: "Receive notifications via email, SMS, Slack, or webhook when issues are detected.",
                },
                {
                  title: "Detailed Reports",
                  description: "Access comprehensive uptime reports and analytics to identify patterns.",
                },
                {
                  title: "Status Pages",
                  description: "Create public or private status pages to keep your users informed.",
                },
                {
                  title: "SSL Monitoring",
                  description: "Get alerted before your SSL certificates expire to prevent security warnings.",
                },
                {
                  title: "API Access",
                  description: "Integrate monitoring data directly into your existing tools and dashboards.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 border border-gray-100 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 flex items-center justify-center mb-4 group-hover:from-purple-600/20 group-hover:to-blue-600/20 transition-all">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
                  </div>
                  <h3 className="text-xl font-light mb-2">{feature.title}</h3>
                  <p className="text-gray-600 font-light">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50/80 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-white"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-24 right-1/4 w-64 h-64 bg-teal-100 rounded-full opacity-40 blur-3xl"></div>
            <div className="hidden lg:block absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-100 rounded-full opacity-30 blur-3xl"></div>
          </div>
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-24 left-1/4 w-64 h-64 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-24 right-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          </div>

          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 text-sm font-light mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  How it works
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">How Monitr works</h2>
              <p className="text-gray-600 font-light max-w-2xl mx-auto">
                Setting up monitoring for your websites takes less than 5 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Add your websites",
                  description: "Enter the URLs you want to monitor and set your check frequency.",
                },
                {
                  step: "2",
                  title: "Configure alerts",
                  description: "Choose how and when you want to be notified about downtime.",
                },
                {
                  step: "3",
                  title: "Relax and focus",
                  description: "We'll monitor your sites 24/7 and alert you only when there's an issue.",
                },
              ].map((step, index) => (
                <div key={index} className="text-center relative">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 -z-10"></div>
                  )}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 flex items-center justify-center mx-auto mb-6">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-gray-100">
                      <span className="font-light text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-light mb-2">{step.title}</h3>
                  <p className="text-gray-600 font-light">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-white"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-24 right-1/4 w-64 h-64 bg-teal-100 rounded-full opacity-40 blur-3xl"></div>
            <div className="hidden lg:block absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-100 rounded-full opacity-30 blur-3xl"></div>
          </div>
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute bottom-1/3 -left-24 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          </div>

          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 text-sm font-light mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Pricing
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">Simple, transparent pricing</h2>
              <p className="text-gray-600 font-light max-w-2xl mx-auto">
                Choose the plan that fits your monitoring needs. All plans include our core features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$19",
                  description: "Perfect for small websites and personal projects",
                  features: ["10 websites", "1-minute checks", "Email alerts", "7-day history", "1 team member"],
                },
                {
                  name: "Professional",
                  price: "$49",
                  description: "Ideal for growing businesses with multiple sites",
                  features: [
                    "50 websites",
                    "30-second checks",
                    "Email & SMS alerts",
                    "30-day history",
                    "5 team members",
                    "API access",
                  ],
                  featured: true,
                },
                {
                  name: "Enterprise",
                  price: "$99",
                  description: "For businesses that need comprehensive monitoring",
                  features: [
                    "Unlimited websites",
                    "15-second checks",
                    "All alert channels",
                    "1-year history",
                    "Unlimited team members",
                    "Priority support",
                  ],
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`p-8 border rounded-2xl flex flex-col bg-white/80 backdrop-blur-sm ${
                    plan.featured
                      ? "border-transparent bg-gradient-to-b from-white to-purple-50 shadow-xl shadow-blue-600/10 relative"
                      : "border-gray-100 shadow-sm hover:shadow-md transition-all"
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl"></div>
                  )}
                  <h3 className="text-xl font-light mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-light">{plan.price}</span>
                    <span className="text-gray-600 font-light">/month</span>
                  </div>
                  <p className="text-gray-600 font-light mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div
                          className={`h-5 w-5 rounded-full ${plan.featured ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-black"} flex items-center justify-center mr-2 flex-shrink-0`}
                        >
                          <CheckIcon className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-light text-gray-800">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#"
                    className={`mt-auto px-6 py-3 rounded-full text-center text-sm font-light transition-all ${
                      plan.featured
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 shadow-lg shadow-blue-600/20"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    Get started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50/80 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-white"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-24 right-1/4 w-64 h-64 bg-teal-100 rounded-full opacity-40 blur-3xl"></div>
            <div className="hidden lg:block absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-100 rounded-full opacity-30 blur-3xl"></div>
          </div>
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-24 right-1/4 w-64 h-64 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-24 left-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          </div>

          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 text-sm font-light mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">Frequently asked questions</h2>
              <p className="text-gray-600 font-light max-w-2xl mx-auto">
                Find answers to common questions about Monitr.
              </p>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {[
                {
                  question: "How often do you check my websites?",
                  answer:
                    "Depending on your plan, we check your websites every 15 seconds to 1 minute from multiple global locations to ensure accuracy.",
                },
                {
                  question: "What happens when my site goes down?",
                  answer:
                    "We'll immediately send you an alert through your configured channels. We'll continue monitoring and notify you when your site is back up.",
                },
                {
                  question: "Do you offer a free trial?",
                  answer:
                    "Yes, we offer a 14-day free trial on all plans with no credit card required. You can test all features before committing.",
                },
                {
                  question: "Can I monitor internal or private websites?",
                  answer:
                    "Yes, with our agent-based monitoring, you can monitor internal websites, services, and servers that aren't publicly accessible.",
                },
                {
                  question: "How do I cancel my subscription?",
                  answer:
                    "You can cancel your subscription at any time from your account settings. There are no long-term contracts or cancellation fees.",
                },
              ].map((faq, index) => (
                <div key={index} className="py-6 group cursor-pointer">
                  <h3 className="text-lg font-light mb-2 flex justify-between items-center">
                    {faq.question}
                    <span className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-300 transition-colors">
                      +
                    </span>
                  </h3>
                  <p className="text-gray-600 font-light">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t bg-gray-50/80 backdrop-blur-sm">
      <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-white"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-24 right-1/4 w-64 h-64 bg-teal-100 rounded-full opacity-40 blur-3xl"></div>
            <div className="hidden lg:block absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-100 rounded-full opacity-30 blur-3xl"></div>
          </div>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Customers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-light text-gray-600 hover:text-gray-900">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 font-light mb-4 md:mb-0">
              © {new Date().getFullYear()} Monitr. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
