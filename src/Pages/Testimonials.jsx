import React from "react";

const testimonials = [
  {
    name: "Rafi Ahmed",
    role: "Business Owner",
    quote:
      "SmartBills made my life easier! I can pay my utility bills in minutes and track everything in one dashboard.",
    image: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Sumaiya Islam",
    role: "Teacher",
    quote:
      "I love how simple and secure the system is. The PDF report download feature is a lifesaver!",
    image: "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Tanvir Hasan",
    role: "Engineer",
    quote:
      "I used to forget my bill dates, but now SmartBills reminds me and helps me pay right on time.",
    image: "https://i.pravatar.cc/100?img=22",
  },
];

const Testimonials = () => {
  return (
    <section
      className="py-16 text-center"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2
          className="text-3xl font-bold mb-10"
          style={{ color: "var(--text-primary)" }}
        >
          What Our <span className="text-[#E5CBB8]">Users</span> Say
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-xl p-6 shadow hover:shadow-lg transition"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 mx-auto rounded-full mb-4"
              />
              <p
                className="italic mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                "{t.quote}"
              </p>
              <h4
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {t.name}
              </h4>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {t.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
