import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { AuthContext } from "../Provider/AuthProvider";
import { API_BASE_URL } from "../config";

const Providers = () => {
  const { user } = useContext(AuthContext);
  const [providers, setProviders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    setLoadingProviders(true);
    axios
      .get(`${API_BASE_URL}/providers`, { signal: controller.signal })
      .then((res) => {
        if (!isMounted) return;
        setProviders(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        if (!isMounted || controller.signal.aborted) return;
        console.error("Provider fetch error:", err);
        setError("Unable to load providers right now.");
      })
      .finally(() => {
        if (isMounted) {
          setLoadingProviders(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!user?.email) {
      setSubscriptions([]);
      setLoadingSubscriptions(false);
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    setLoadingSubscriptions(true);
    axios
      .get(`${API_BASE_URL}/subscriptions`, {
        params: { email: user.email },
        signal: controller.signal,
      })
      .then((res) => {
        if (!isMounted) return;
        setSubscriptions(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        if (!isMounted || controller.signal.aborted) return;
        console.error("Subscription fetch error:", err);
        setError("Unable to load your subscriptions.");
      })
      .finally(() => {
        if (isMounted) {
          setLoadingSubscriptions(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user]);

  const providerTypes = useMemo(() => {
    const types = new Set();
    providers.forEach((provider) => {
      if (provider?.type) {
        types.add(provider.type);
      }
    });
    return ["All", ...Array.from(types)];
  }, [providers]);

  const filteredProviders = useMemo(() => {
    if (selectedType === "All") return providers;
    return providers.filter((provider) => provider.type === selectedType);
  }, [providers, selectedType]);

  const isSubscribed = (providerId) => {
    return subscriptions.some((sub) => sub.providerId === providerId);
  };

  const handleSubscribe = async (providerId) => {
    if (!user?.email) {
      Swal.fire({
        title: "Login Required",
        text: "Please sign in to subscribe to a provider.",
        icon: "info",
        confirmButtonColor: "#E5CBB8",
        confirmButtonText: "Go to Login",
        showCancelButton: true,
        cancelButtonText: "Maybe Later",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/auth/login";
        }
      });
      return;
    }

    if (isSubscribed(providerId)) {
      toast.success("You are already subscribed to this provider.");
      return;
    }

    const provider = providers.find((item) => item._id === providerId);
    toast.loading("Subscribing...", { id: `subscribe-${providerId}` });

    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions`, {
        email: user.email,
        providerId,
      });

      const insertedId = response?.data?.insertedId;
      setSubscriptions((prev) => [
        ...prev,
        {
          _id: insertedId || `${providerId}-${Date.now()}`,
          email: user.email,
          providerId,
          providerName: provider?.name || "Unknown Provider",
          type: provider?.type || "General",
          subscribedAt: new Date().toISOString(),
        },
      ]);

      toast.success("Subscription successful!", {
        id: `subscribe-${providerId}`,
      });
      Swal.fire({
        title: "Subscribed!",
        text: `You will now see ${
          provider?.name || "this provider"
        } in your bills experience.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Subscription error:", error);
      const message =
        error?.response?.data?.message ||
        "Failed to subscribe. Please try again.";
      toast.error(message, { id: `subscribe-${providerId}` });
    }
  };

  const formatDate = (value) => {
    if (!value) return "Unknown";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Unknown";
    return parsed.toLocaleDateString();
  };

  return (
    <section
      className="min-h-screen py-12 sm:py-14 md:py-16"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <Motion.div
          initial={{ opacity: 0, y: -25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Provider Marketplace
          </h1>
          <p
            className="mt-3 text-sm sm:text-base md:text-lg max-w-3xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Choose trusted electricity, gas, water, and internet providers.
            Subscribe once to personalize your bill feed and unlock upcoming
            automations.
          </p>
        </Motion.div>

        {error ? (
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-400 rounded-lg p-4 text-center mb-6">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8">
          {providerTypes.map((type) => {
            const isActive = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium border transition-all ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-transparent text-black dark:text-white border-gray-400 hover:bg-black/10"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {loadingProviders ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2">
            {filteredProviders.length === 0 ? (
              <p
                className="text-center text-sm sm:text-base font-medium col-span-full"
                style={{ color: "var(--text-secondary)" }}
              >
                No providers found for this category.
              </p>
            ) : (
              filteredProviders.map((provider, index) => {
                const subscribed = isSubscribed(provider._id);
                return (
                  <Motion.div
                    key={provider._id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="card rounded-2xl shadow-md border border-gray-800/20 overflow-hidden"
                    style={{ backgroundColor: "var(--card-bg)" }}
                  >
                    {provider.logo ? (
                      <img
                        src={provider.logo}
                        alt={provider.name || "Provider logo"}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="h-40 bg-linear-to-r from-[#111827] to-[#1f2937]"></div>
                    )}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <h2
                          className="text-xl sm:text-2xl font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {provider.name || "Unnamed Provider"}
                        </h2>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-black text-white uppercase tracking-wide">
                          {provider.type || "General"}
                        </span>
                      </div>
                      {provider.description ? (
                        <p
                          className="mt-3 text-sm leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {provider.description}
                        </p>
                      ) : null}

                      <div
                        className="mt-4 space-y-2 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {provider.pricing ? (
                          <p>
                            <span className="font-semibold text-white/90">
                              Pricing:
                            </span>{" "}
                            {provider.pricing}
                          </p>
                        ) : null}
                        {provider.coverage ? (
                          <p>
                            <span className="font-semibold text-white/90">
                              Coverage:
                            </span>{" "}
                            {provider.coverage}
                          </p>
                        ) : null}
                        {provider.website ? (
                          <a
                            href={provider.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline text-xs"
                          >
                            Visit provider site
                          </a>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSubscribe(provider._id)}
                        disabled={subscribed}
                        className={`mt-5 w-full px-4 py-2 rounded-md text-sm sm:text-base font-semibold transition-colors ${
                          subscribed
                            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 cursor-not-allowed"
                            : "bg-[#E5CBB8] text-black hover:bg-[#d9b99f]"
                        }`}
                      >
                        {subscribed ? "Subscribed" : "Subscribe"}
                      </button>
                    </div>
                  </Motion.div>
                );
              })
            )}
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div
            className="lg:col-span-2 card rounded-2xl border border-gray-800/20 p-6 sm:p-8"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h2
              className="text-xl sm:text-2xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              How subscriptions work
            </h2>
            <ul
              className="mt-4 space-y-3 text-sm sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>
                • Subscribe once to a provider to pin them to your bill feed.
              </li>
              <li>
                • We will soon auto-suggest relevant bills, reminders, and
                insights based on your subscriptions.
              </li>
              <li>
                • Manage your preferences anytime from this provider
                marketplace.
              </li>
            </ul>
          </div>
          <div
            className="card rounded-2xl border border-gray-800/20 p-6 sm:p-7"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h2
              className="text-lg sm:text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Your subscriptions
            </h2>

            {loadingSubscriptions ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-bars loading-md"></span>
              </div>
            ) : subscriptions.length === 0 ? (
              <p
                className="text-sm mt-3"
                style={{ color: "var(--text-secondary)" }}
              >
                You haven&apos;t subscribed to any providers yet. Explore the
                list to get started.
              </p>
            ) : (
              <ul
                className="mt-4 space-y-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {subscriptions.map((sub) => (
                  <li
                    key={sub._id || `${sub.providerId}-${sub.subscribedAt}`}
                    className="border border-gray-800/20 rounded-lg px-3 py-2"
                    style={{ backgroundColor: "var(--bg-secondary)" }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {sub.providerName || "Provider"}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {sub.type || "General"}
                    </p>
                    <p className="text-xs mt-1">
                      Since {formatDate(sub.subscribedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Providers;
