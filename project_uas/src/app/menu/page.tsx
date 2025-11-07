"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./page.css";

interface MenuItem {
  id: number;
  name: string;
  price: String;
  description: string;
  category: "Main Dish" | "Beverages" | "Vegetables" | "Add-on";
  imageUrl: string;
}

export default function MenuItem() {
  const [filter, setFilter] = useState<String>("All");
  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Ayam Bakar (Without Rice",
      price: "Rp. 19000",
      description:
        "Best Seller Ayam Bakar dengan bumbu khas yang meresap hingga ke dalam daging ayamnya,menjadikan hidangan ini sangat lezat dan menggugah selera.",
      category: "Main Dish",
      imageUrl: "/images/makanan/ayam-bakar.jpeg",
    },

    {
      id: 2,
      name: "Ayam bakar Goreng (Without Rice)",
      price: "Rp. 21000",
      description:
        "Andalan warung makan Ayam Bakar Ojolali. Dibuat dengan ayam yang empuk dan berkualitas, hidangan ini dibuat dengan membakar ayam yang dioleskan bumbu khas Ojolali terlebih dahulu, kemudian digoreng dengan baluran telur.",
      category: "Main Dish",
      imageUrl: "/images/makanan/ayam-bakar-goreng-abg.jpeg",
    },

    {
      id: 3,
      name: "Ayam Goreng Kremes (Without Rice)",
      price: "Rp. 21000",
      description:
        "Hidangan Ayam goreng yang empuk didalam dan renyah diluar dengan taburan kremes yang gurih.",
      category: "Main Dish",
      imageUrl: "/images/makanan/ayam-goreng-kremes.jpeg",
    },

    {
      id: 4,
      name: "Ayam Penyet (Without Rice)",
      price: "Rp. 19000",
      description:
        "Ayam Goreng yang di penyet dengan ulekan agar sedikit pipih, lalu disajikan dengan samabal pedas.",
      category: "Main Dish",
      imageUrl: "/images/makanan/ayam-penyet.jpeg",
    },

    {
      id: 5,
      name: "Ayam Gurame/Nila Bakar (Without Rice)",
      price: "Rp. 22000",
      description:
        "Ikan Gurame atau Nila yang dibakar dengan bumbu rempah, hingga dagingnya lembut dan terasa gurih.",
      category: "Main Dish",
      imageUrl: "/images/makanan/ikan-gurame-bakar.png",
    },

    {
      id: 6,
      name: "Ayam Gurame/Nila Goreng (Without Rice)",
      price: "Rp. 22000",
      description:
        "Ikan Gurame atau Nila yang digoreng hingga renyah dan gurih. Disajikan dengan Sambal OJolali.",
      category: "Main Dish",
      imageUrl: "/images/makanan/ikan-gurame-goreng.png",
    },

    {
      id: 7,
      name: "Iga Bakar (Without Rice)",
      price: "Rp. 32000",
      description:
        "Iga bakar dengan citarasa yang manis menggunakan bumbu-bumbu yang terpilih.",
      category: "Main Dish",
      imageUrl: "/images/makanan/iga-bakar.png",
    },

    {
      id: 8,
      name: "Sop Iga (Without Rice)",
      price: "Rp. 32000",
      description:
        "Iga Bakar yang direbus dalam waktu lama dengan bumbu rempah pilihan, sehingga menghasilkan kuah sop yang gurih dan daging iga yang empuk. ",
      category: "Main Dish",
      imageUrl: "/images/makanan/sop-iga.png",
    },

    {
      id: 9,
      name: "Tahu",
      price: "Rp. 1500",
      description: "Tahu dengan bumbu khas yang menggugah selera.",
      category: "Add-on",
      imageUrl: "/images/makanan/tahu.jpeg",
    },

    {
      id: 10,
      name: "Tempe",
      price: "Rp. 1500",
      description: "Tempe dengan bumbu khas yang menggugah selera.",
      category: "Add-on",
      imageUrl: "/images/makanan/tempe.jpeg",
    },

    {
      id: 11,
      name: "Kremesan",
      price: "Rp. 1500",
      description:
        "adonan Tepung yang digoreng hingga renyah sebagai pelengkap hidangan ayam goreng.",
      category: "Add-on",
      imageUrl: "/images/makanan/kremesan.png",
    },

    {
      id: 12,
      name: "Nasi",
      price: "Rp. 4000",
      description: "Nasi putih pendamping makanan.",
      category: "Add-on",
      imageUrl: "/images/makanan/nasi.jpeg",
    },

    {
      id: 13,
      name: "Sayur Asem",
      price: "Rp. 3000",
      description:
        "Hidangan Kuah yang dibuat dari berbagai sayuran segar dengan rasa asam yang menyegarkan.",
      category: "Vegetables",
      imageUrl: "/images/makanan/sayur-asem.png",
    },

    {
      id: 14,
      name: "Cah Kangkung",
      price: "Rp. 7000",
      description:
        "Hidangan tumis kangkung yang dimasak dengan api besar dan fibumbui dengan saus tiram serta bumbu pilihan Ojolali.",
      category: "Vegetables",
      imageUrl: "/images/makanan/cah-kangkung.jpeg",
    },

    {
      id: 15,
      name: "Es Teh Manis",
      price: "Rp. 4000",
      description:
        "Walaupun ini adalah minuman teh yang sudah umum, namun minuman ini sangat menyegarkan sekali lho....",
      category: "Beverages",
      imageUrl: "/images/makanan/es-teh.png",
    },

    {
      id: 16,
      name: "Es Teh Tawar",
      price: "Rp. 2000",
      description:
        "Walaupun ini adalah minuman teh yang sudah umum, namun minuman ini sangat menyegarkan sekali lho....",
      category: "Beverages",
      imageUrl: "/images/makanan/es-teh.png",
    },

    {
      id: 17,
      name: "Aqua",
      price: "Rp. 4000",
      description:
        "Air mineral dalam kemasan botol untuk menemani hidangan Anda.",
      category: "Beverages",
      imageUrl: "/images/makanan/aqua.jpeg",
    },
  ];

  const filteredMenu =
    filter === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === filter);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Our Menu</h1>
        <p className="text-muted">
          Savor the smoky flavor of perfection — from juicy grilled chicken to
          delicious sides and refreshing drinks.
        </p>
      </div>

      <div className="d-flex justify-content-center gap-3 mb-5">
        {["All", "Main Dish", "Beverages", "Vegetables", "Add-on"].map((categories) => (
          <button
            key={categories}
            className={`btn rounded-pill btn-hover-shadow ${filter === categories ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(categories)}
          >
            {categories}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {filteredMenu.map((item) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
            <div className="card h-100 card-hover-shadow">
              <img
                src={item.imageUrl}
                className="card-img-top"
                alt={item.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold text-danger">{item.price}</h6>
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text text-muted small text-truncate-2">
                  {item.description}
                </p>  
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
